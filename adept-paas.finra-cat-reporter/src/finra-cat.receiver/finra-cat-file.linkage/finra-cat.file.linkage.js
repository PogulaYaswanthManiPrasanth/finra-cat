/*
 * File:		      finra-cat.file.storage.js
 *
 * Description:		This class will store the finra feedbackfiles in to trade store
 *
 * Created:			  Tuesday, 29th April 2020 03:10:48 pm
 *
 * Author:			  Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:			Tuesday, 29th April 2020 03:10:48 pm
 *       By:		  Anand Ramani (aramani@thapovan-inc.com)
 *
 * 				        Copyright (c) 2019 - 2020
 * 					      xinthesys, inc. All rights reserved.
 *
 * TODO
 * ============================================================================
 *
 * CHANGELOG
 * ============================================================================
 * Date				Who
 *  				Changes
 * -----------------------------------------------------------------------------
 */

const redis                             = require("com.redis");

const { ServiceModule }                 = require('service.module.core');

const { initializeDb,
  disconnectDb,
  tradeEvent,
  tradeReportEvent,
  tradeReport,
  tradeFile,
  tradeFileContent }                    = require('adept.trade-store.db');

const { ObjectID }                      = require("mongodb");

const fs                                = require('fs');

const path                              = require('path');

const readline                          = require('readline');

const Client                            = require("ssh2-sftp-client");

const { decompress }                    = require('../utils/bzip2');

const error_codes                       = require("../utils/csv/errors_codes");

const sendToSlack                       = require('../utils/slack');

const { read }                          = require('../utils/json')

const stateUtil                         = require('adept.tradestore.util');

const { Exception, Errors }             = require('com.errors');

/**
 * @class ReportSchedulerService
 * @extends {ServiceModule}
 */
class FileLinkageService extends ServiceModule {

  /**
   * Lifecyle load method . sets the config required for the app
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async load(_cb) {

    try {

      if (!(gService.context.config && gService.context.config.redis)) {

        throw new Exception(Errors.ECNFMIS, "Missing redis configuration");
      }

      if (!(gService.context.config && gService.context.config.sftp)) {

        throw new Exception(Errors.ECNFMIS, "Missing sftp configuration");
      }

      this.config.domainmap = (gService.context.config && gService.context.config.domainmap);

      this.config.imidmap = (gService.context.config && gService.context.config.imidmap);

      this.config.redis = (gService.context.config && gService.context.config.redis);

      this.config.sftp = (gService.context.config && gService.context.config.sftp);

      this.outputFolder = path.join(process.cwd(), this.config.sftp.feedback_dir);

      this.reportKeyFile = gService.context.config.reportKeyFile;

      if (!fs.existsSync(this.outputFolder)) {

        fs.mkdirSync(this.outputFolder);

      }

      this._errorCodes = error_codes;

    } catch (err) {

      this.log.info(err);

    }

  }

  /**
   * Lifecycle initialize method . initialize redis client
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async initialize(_cb) {

    try {

      this.redisClient = redis.createClient(this.config.redis.url, {
        retry_strategy: (options) => {

          if (options.error && (options.error.code === 'ECONNREFUSED' || options.error.code === 'NR_CLOSED')) {
            // Try reconnecting after 5 seconds
            this.log.info('The server refused the connection. Retrying connection...');
            return 5000;
          }
          if (options.total_retry_time > this.config.redis.retry.total_retry_time) {
            // End reconnecting after a specific timeout and flush all commands with an individual error
            return new Error('Retry time exhausted');
          }
          if (options.attempt > this.config.redis.retry.attempt) {
            // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });

      await this.initializeRedisReader();

      // await initializeDb(`mongodb://${this.config.mongo.dbHost}:${this.config.mongo.dbPort}/${this.config.mongo.dbName}`);

    } catch (err) {

      this.log.info(err);

    }

  }

  /**
   * Lifecycle start method. Starts streaming data
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async start(_cb) {

    try {

      this.readInLoop();

    } catch (err) {

      this.log.info(err);

    }

  }


  async asyncForEach(array, callback) {

    for (let index = 0; index < array.length; index++) {

      await callback(array[index], index, array);

    }

  }

  /**
   * Loop to read continuosly data from redis usin blpop
   * @memberof ReportPackagerService
   */
  async readInLoop() {

    if (this.redisClient.connected) {

      let data = await this.readFromQueue();

      if (data) {

        let fileDomainName = "celadon";
        let reportKeyObj = null;
        let linkageKey = null;
        let _remoteFile = data.fileName;

        if(_remoteFile.includes("linkage.error")) {

          let imids = Object.keys(this.config.imidmap);

          imids.forEach((imid) => {

            this.log.info('imid', imid);

            if(_remoteFile.includes(imid)) {
              fileDomainName = this.config.imidmap[imid];

              this.log.info('im', fileDomainName);
            }

          });

        } else {

          linkageKey = _remoteFile.split("_")[3];

        }

        let reportKeys = await read(this.reportKeyFile);

        let found = Object.keys(reportKeys).find(reportKey => reportKey == linkageKey);

        if(found) {

          fileDomainName = reportKeys[found].name;
          reportKeyObj = reportKeys[found];

        }

        let domains = reportKeyObj ? [reportKeyObj.name] : Object.keys(this.config.domainmap);

        await this.asyncForEach(domains, async (domainName) => {

          let domain = this.config.domainmap[domainName];

          if (fileDomainName.toLowerCase() == domainName.toLowerCase()) {

            this.log.info(`mongodb://${domain.dbHost}:${domain.dbPort}/${domain.dbName}`);

            let config = {};

            config.initializeDb = initializeDb;
            await config.initializeDb(`mongodb://${domain.dbHost}:${domain.dbPort}/${domain.dbName}`);

            config.tradeFile = tradeFile;
            config.tradeFileContent = tradeFileContent;
            config.tradeReport = tradeReport;
            config.tradeReportEvent = tradeReportEvent;
            config.tradeEvent = tradeEvent;
            config.disconnectDb = disconnectDb;

            config.dbHost = domain.dbHost;
            config.dbPort = domain.dbPort;
            config.dbName = domain.dbName;

            config.sftp = this.config.sftp;

            config.outputFolder = this.outputFolder;

            this.log.info('Processing file...', _remoteFile);
            if(_remoteFile.includes("linkage.error")) {

              await this.processLinkageFiles(data, config);

            } else {

              await this.processFiles(data, config);

            }

            this.log.info('Disconnecting DB...');

            await config.disconnectDb()

          }

        });

        // this.processFiles(data);

      }
    }

    setImmediate(() => {

      this.readInLoop.call(this);

    });

  }

  /**
   *
   * @param {*} _data
   * @memberof ReportRecieverService
   */
  async processFiles(_data, {
    outputFolder,
    sftp,
    tradeEvent,
    tradeReportEvent,
    tradeReport,
    tradeFile,
    tradeFileContent }) {

    try {

      let _remoteFolder = _data.folder;

      let _remoteFile = _data.fileName;

      let linkageKey = _remoteFile.split("_")[3];

      let tradeFileDocs = await tradeFile().getAllTradeFiles({ filter: { linkage_key: linkageKey, type: "SUB:DATA" } });

      let tradeFileDoc = tradeFileDocs.items[0];

      if (tradeFileDoc) {

        let destinationFileStream = fs.createWriteStream(outputFolder + "/" + _remoteFile);

        let destinationFile = outputFolder + "/" + _remoteFile;

        let client = new Client();

        await client.connect(sftp)
          .then(() => {

            return client.get(_remoteFolder + "/" + _remoteFile, destinationFileStream);

          })
          .then(async () => {

            sendToSlack(`Feedback Downloaded: ${_data.fileName}`, true);

            client.end();

            destinationFileStream.end();

            let destinationJSONFile = destinationFile.replace(".bz2", "");

            let newTradeFile = null;

            let newTradeFileContents = null;

            let hasErrors = false;

            if (destinationFile.includes('.bz2')) {

              await decompress(destinationFile);

              let fileStream;

              try {

                fileStream = fs.createReadStream(destinationJSONFile);

              } catch (error) {

                this.log.info(error);
                fileStream.destroy();

              }

              let lineReader = readline.createInterface({
                input: fileStream
              });

              let submissionLineJSON = [];

              let errorSet = 0;

              for await (const line of lineReader) {

                let submissionLine = JSON.parse(line);

                let sLine = submissionLine;

                let errorRecord = null;

                if (submissionLine.errorRecord && typeof submissionLine.errorRecord == 'string') {

                  errorRecord = JSON.parse(submissionLine.errorRecord);
                  sLine.errorRecord = errorRecord;

                } else {

                  errorRecord = submissionLine.errorRecord;
                  sLine.errorRecord = errorRecord;

                }

                submissionLineJSON.push(sLine);

                this.log.info('firmROEID', errorRecord.firmROEID);
                let tradeReportEventDocs = await tradeReportEvent().getAllTradeReportEvents({ filter: { "spec_data.event.json.firmROEID": errorRecord.firmROEID } });

                if (tradeReportEventDocs.items.length > 0) {

                  let tradeReportEventDoc = tradeReportEventDocs.items[0];

                  let submissionListOfErrors = [];

                  this._errorCodes.forEach((element) => {

                    submissionLine.errorCode.forEach(errorCode => {

                      if (errorCode === parseInt(element.code)) {

                        submissionListOfErrors.push(element);

                      }

                    });

                  });

                  if (submissionListOfErrors.length > 0) {

                    errorSet++;
                    hasErrors = true;
                    tradeReportEventDoc.has_errors = true;
                    tradeReportEventDoc.spec_data.event.json.errorROEID = submissionLine.errorROEID ? submissionLine.errorROEID : null;
                    tradeReportEventDoc.spec_data.submission = {};
                    tradeReportEventDoc.spec_data.submission.errors = submissionListOfErrors;
                    tradeReportEventDoc.spec_data.submission.has_errors = true;
                    // tradeReportEventDoc.spec_data.responded_dt = new Date();

                    try {

                      await tradeReportEvent().upsertTradeReportEvent(tradeReportEventDoc);

                    } catch (error) {

                      this.log.info(error);

                    }

                    let errorObj = {
                      has_errors: true,
                      "spec_data.event.json.errorROEID": submissionLine.errorROEID ? submissionLine.errorROEID : null,
                      "spec_data.submission.errors": submissionListOfErrors,
                      "spec_data.submission.has_errors": true,
                      // "spec_data.responded_dt": new Date(),
                      "state": stateUtil.EventStates.WorkFlowEventStates.STATE.RESPONDED
                    }

                    await tradeEvent().updateTradeEventById(new ObjectID(tradeReportEventDoc.wf_event_id), errorObj);

                    // sendToSlack(`Updated: TradeEvent: ${tradeReportEventDoc.wf_event_id.toString()}`);

                    // sendToSlack(`Updated: TradeReportEvent: ${tradeReportEventDoc._id.toString()}`);

                    this.log.info('TE', tradeReportEventDoc.wf_event_id, 'TRE', tradeReportEventDoc._id, 'errors:', submissionListOfErrors);

                  }

                }

              }

              if (hasErrors) {

                let tradeReportId = tradeFileDoc.ref_id;

                let tradeReports = await tradeReport().getAllTradeReports({ filter: { _id: tradeReportId } });

                let tradeReportObj = tradeReports.items[0];

                let errorCount = 0;

                if (tradeReportObj.spec_data.response && tradeReportObj.spec_data.response.errors && tradeReportObj.spec_data.response.errors[0].errorCount) {

                  errorCount = tradeReportObj.spec_data.response.errors[0].errorCount;

                }

                let accepted = tradeReportObj.num_events - errorSet;
                let rejected = errorSet ? errorSet : 0;

                await tradeReport().upsertTradeReport({
                  _id: tradeReportId,
                  "has_errors": true,
                  "spec_data.response.rejected": rejected,
                  "spec_data.response.accepted": accepted
                });

              }

              lineReader.close();
              fileStream.close();

              newTradeFile = {
                "filename": _remoteFile.replace(".bz2", ""),
                "type": "RESP:ERR",
                "mime_type": "JSON",
                "ns" : "CAT:SUBMIT",
                "file_mime_ext": "JSON",
                "created_dt": new Date().toISOString(),
                "ref_collection": "trade-report",
                "ref_id": new ObjectID(tradeFileDoc.ref_id),
                "linkage_key": linkageKey
              }

              let savedNewTradeFile = await tradeFile().upsertTradeFile(newTradeFile);

              newTradeFileContents = {
                trade_file_id: new ObjectID(savedNewTradeFile._id),
                seq_no: 1,
                content: submissionLineJSON
              };

              let savedNewTradeFileContents = await tradeFileContent().createTradeFileContents(newTradeFileContents);

              sendToSlack(`File: ${destinationJSONFile} content: ${JSON.stringify(submissionLineJSON)}.`);

            } else {

              this.log.info('else...', _remoteFile);

              let fileData = await fs.promises.readFile(outputFolder + "/" + _remoteFile, 'utf-8');

              let tradeReportId = tradeFileDoc.ref_id;

              if (fileData) {

                let fileDataParse = JSON.parse(fileData);

                sendToSlack(`File: ${_remoteFile} content: ${fileData}.`)

                if (fileDataParse.stage) {

                  newTradeFile = {
                    "filename": _remoteFile,
                    "type": "RESP:" + fileDataParse.stage,
                    "mime_type": "JSON",
                    "ns" : "CAT:SUBMIT",
                    "file_mime_ext": "JSON",
                    "created_dt": new Date().toISOString(),
                    "ref_collection": "trade-report",
                    "ref_id": new ObjectID(tradeFileDoc.ref_id),
                    "linkage_key": linkageKey
                  }

                } else {

                  newTradeFile = {
                    "filename": _remoteFile,
                    "type": "RESP:ERR",
                    "ns" : "CAT:SUBMIT",
                    "mime_type": "JSON",
                    "file_mime_ext": "JSON",
                    "created_dt": new Date().toISOString(),
                    "ref_collection": "trade-report",
                    "ref_id": new ObjectID(tradeFileDoc.ref_id),
                    "linkage_key": linkageKey
                  }

                }

                let responseFileJSON = JSON.parse(fileData);

                let errorCodeFound = false;

                if (responseFileJSON.status.toLowerCase() === "failure") {

                  let errors = [];

                  if (Array.isArray(responseFileJSON.code)) {

                    await this.asyncForEach(responseFileJSON.code, async (errorCode) => {

                      errorCodeFound = false;

                      await this.asyncForEach(this._errorCodes, async (element) => {

                        if (errorCode === parseInt(element.code)) {

                          errorCodeFound = true;
                          errors.push(element);

                        }

                      });

                      if (errorCodeFound == false) {

                        errors.push({
                          code: errorCode,
                          description: "",
                          explaination: "",
                          type: responseFileJSON.severity ? responseFileJSON.severity : 'Error'
                        });

                      }

                    });

                  } else {

                    errorCodeFound = false;

                    await this.asyncForEach(this._errorCodes, async (element) => {

                      if (responseFileJSON.code === parseInt(element.code)) {

                        errorCodeFound = true;
                        errors.push(element);

                      }

                    });

                    if (errorCodeFound == false && responseFileJSON.code) {

                      errors.push({
                        code: responseFileJSON.code,
                        description: "",
                        explaination: "",
                        type: responseFileJSON.severity ? responseFileJSON.severity : 'Error'
                      });

                    } else if (errorCodeFound == false && !responseFileJSON.code) {

                      errors.push({
                        errorCount: responseFileJSON.errorCount ? responseFileJSON.errorCount : null,
                        type: responseFileJSON.severity ? responseFileJSON.severity : 'Error'
                      });

                    }

                  }

                  if (errors.length > 0) {

                    this.log.info('All Errors: ', errors);

                    let spec_data = {
                      file_type: responseFileJSON.stage ? responseFileJSON.stage : '',
                      status: responseFileJSON.status,
                      has_errors: true,
                      errors: errors
                    }

                    newTradeFile.spec_data = spec_data;

                    let savedNewTradeFile = await tradeFile().upsertTradeFile(newTradeFile);

                    newTradeFileContents = {
                      trade_file_id: new ObjectID(savedNewTradeFile._id),
                      seq_no: 1,
                      content: responseFileJSON
                    };

                    await tradeFileContent().createTradeFileContents(newTradeFileContents);

                    await tradeReport().upsertTradeReport({
                      _id: tradeReportId,
                      "spec_data.type": responseFileJSON.stage ? responseFileJSON.stage : '',
                      "spec_data.status": responseFileJSON.status,
                      "spec_data.response.dt": new Date(),
                      "spec_data.response.errors": errors,
                      "spec_data.response.has_errors": true
                    });

                  } else {

                    // There are no known errors just save the tradeFileContent and update TradeReport
                    this.log.info('No known errors');

                    await tradeFileContent().createTradeFileContents(newTradeFileContents);
                    await tradeReport().upsertTradeReport({
                      _id: tradeReportId,
                      "spec_data.response.dt": new Date(),
                      "spec_data.response.errors": [],
                      "spec_data.response.has_errors": true
                    });
                    await tradeReport().upsertTradeReport({ _id: tradeReportId, has_errors: true });

                  }

                } else if (responseFileJSON.status.toLowerCase() === "success") {

                  let spec_data = {
                    file_type: responseFileJSON.stage ? responseFileJSON.stage : '',
                    status: responseFileJSON.status,
                    has_errors: false,
                    errors: []
                  };

                  newTradeFile.spec_data = spec_data;

                  let savedNewTradeFile = await tradeFile().upsertTradeFile(newTradeFile);

                  newTradeFileContents = {
                    trade_file_id: new ObjectID(savedNewTradeFile._id),
                    seq_no: 1,
                    content: responseFileJSON
                  };

                  await tradeFileContent().createTradeFileContents(newTradeFileContents);

                  let tradeReports = await tradeReport().getAllTradeReports({ filter: { _id: tradeReportId } });

                  let tradeReportObj = tradeReports.items[0];

                  let accepted = tradeReportObj.num_events;
                  let rejected = 0;

                  await tradeReport().upsertTradeReport({
                    _id: tradeReportId,
                    "has_errors": false,
                    "spec_data.response.rejected": rejected,
                    "spec_data.response.accepted": accepted,
                    "spec_data.response.dt": new Date()
                  });

                }

              } else {

                this.log.info('Acknowledgement Error for Data or Meta File');

              }

            }

          })
          .catch(err => {

            sendToSlack(`Err: ${err.toString()}`);

            this.log.info(err.message);
          });

        client.on("error", (err) => {

          if (err)
            sendToSlack(`Err: ${err.toString()}`);

          this.log.info('err');

        });
        client.on("end", (err) => {

          if (err)
            sendToSlack(`Err: ${err.toString()}`);
          this.log.info('end', err);

        });
        client.on("close", (err) => {

          this.log.info('close', err);
          if (err)
            sendToSlack(`Err: ${err.toString()}`);

        });

      } else {

        this.log.info('Trade file not found', _data.fileName);

      }

    } catch (err) {

      this.log.info(err);
      sendToSlack(`Err: ${err.toString()}`);

    }

  }

   /**
   *
   * @param {*} _data
   * @memberof ReportRecieverService
   */
  async processLinkageFiles(_data, {
    outputFolder,
    sftp,
    tradeEvent,
    tradeReportEvent,
    tradeReport,
    tradeFile,
    tradeFileContent }) {

    try {

      let _remoteFolder = _data.folder;

      let _remoteFile = _data.fileName;

      let repos = new Map();

      let submissionLineJSON = [];
      let destinationFileStream = fs.createWriteStream(outputFolder + "/" + _remoteFile);

      let destinationFile = outputFolder + "/" + _remoteFile;

      let client = new Client();

      await client.connect(sftp)
        .then(() => {

          return client.get(_remoteFolder + "/" + _remoteFile, destinationFileStream);

        })
        .then(async () => {

          sendToSlack(`Feedback Downloaded: ${_data.fileName}`, true);

          client.end();

          destinationFileStream.end();

          let destinationJSONFile = destinationFile.replace(".bz2", "");

          let newTradeFile = null;

          let newTradeFileContents = null;

          if (destinationFile.includes('.bz2')) {

            await decompress(destinationFile);

            let fileStream;

            try {

              fileStream = fs.createReadStream(destinationJSONFile);

            } catch (error) {

              this.log.info(error);
              fileStream.destroy();

            }

            let lineReader = readline.createInterface({
              input: fileStream
            });

            for await (const line of lineReader) {

              let submissionLine = JSON.parse(line);

              let sLine = submissionLine;

              let errorRecord = null;

              if (submissionLine.errorRecord && typeof submissionLine.errorRecord == 'string') {

                errorRecord = JSON.parse(submissionLine.errorRecord);
                sLine.errorRecord = errorRecord;

              } else {

                errorRecord = submissionLine.errorRecord;
                sLine.errorRecord = errorRecord;

              }

              submissionLineJSON.push(sLine);

              this.log.info('firmROEID', errorRecord.firmROEID);
              let tradeReportEventDocs = await tradeReportEvent().getAllTradeReportEvents({ filter: { "spec_data.event.json.firmROEID": errorRecord.firmROEID }, sort: { _id: -1 } });

              if (tradeReportEventDocs.items.length > 0) {

                let tradeReportEventDoc = tradeReportEventDocs.items[0];

                let submissionListOfErrors = [];

                this._errorCodes.forEach((element) => {

                  submissionLine.errorCode.forEach(errorCode => {

                    if (errorCode === parseInt(element.code)) {

                      submissionListOfErrors.push(element);

                    }

                  });

                });

                if (submissionListOfErrors.length > 0) {

                  tradeReportEventDoc.has_errors = true;
                  tradeReportEventDoc.spec_data.event.json.errorROEID = submissionLine.errorROEID ? submissionLine.errorROEID : null;
                  tradeReportEventDoc.spec_data.submission = {};
                  tradeReportEventDoc.spec_data.submission.errors = submissionListOfErrors;
                  tradeReportEventDoc.spec_data.submission.has_errors = true;
                  // tradeReportEventDoc.spec_data.responded_dt = new Date();

                  try {

                    await tradeReportEvent().upsertTradeReportEvent(tradeReportEventDoc);

                  } catch (error) {

                    this.log.info(error);

                  }

                  let errorObj = {
                    has_errors: true,
                    "spec_data.event.json.errorROEID": submissionLine.errorROEID ? submissionLine.errorROEID : null,
                    "spec_data.submission.errors": submissionListOfErrors,
                    "spec_data.submission.has_errors": true,
                    "state": stateUtil.EventStates.WorkFlowEventStates.STATE.RESPONDED
                  }

                  await tradeEvent().updateTradeEventById(new ObjectID(tradeReportEventDoc.wf_event_id), errorObj);

                  // sendToSlack(`Updated: TradeEvent: ${tradeReportEventDoc.wf_event_id.toString()}`);

                  // sendToSlack(`Updated: TradeReportEvent: ${tradeReportEventDoc._id.toString()}`);

                  this.log.info('TE', tradeReportEventDoc.wf_event_id, 'TRE', tradeReportEventDoc._id, 'errors:', submissionListOfErrors);

                  if (!repos.has(tradeReportEventDoc.report_id.toString())) {

                    let tradeReports = await tradeReport().getAllTradeReports({ filter: { _id: tradeReportEventDoc.report_id }, sort: { _id: -1 } });

                    let tradeReportObj = tradeReports.items[0];

                    let obj = {
                      linkageKey: tradeReportObj.report_key.toString(),
                      ids: [tradeReportEventDoc._id.toString()],
                      content: [sLine],
                      errorCount: 1,
                      numEvents: tradeReportObj.num_events
                    }
                    repos.set(tradeReportEventDoc.report_id.toString(), obj);

                  } else {

                    let obj = repos.get(tradeReportEventDoc.report_id.toString());
                    obj.content.push(sLine);
                    obj.ids.push(tradeReportEventDoc._id.toString());
                    obj.errorCount = obj.errorCount + 1;
                    repos.set(tradeReportEventDoc.report_id.toString(), obj);

                  }
                }

              }

            }

            if (repos.size > 0) {

              for await (const [key, values] of repos) { 

                let accepted = values.numEvents - values.errorCount;

                let linkage = values.errorCount;
                
                await tradeReport().upsertTradeReport({
                  _id: key,
                  "has_errors": true,
                  "spec_data.response.dt": new Date(),
                  "spec_data.response.linkage": linkage,
                  "spec_data.response.accepted": accepted,
                  "spec_data.response.has_errors": true
                });

              }

              newTradeFile = {
                "filename": _remoteFile.replace(".bz2", ""),
                "type": "RESP:ERR",
                "mime_type": "JSON",
                "file_mime_ext": "JSON",
                "created_dt": new Date().toISOString(),
                "ref_collection": null,
                "ns" : "CAT:SUBMIT",
                "linkage_key": null
              }

              let savedNewTradeFile = await tradeFile().upsertTradeFile(newTradeFile);

              newTradeFileContents = {
                trade_file_id: new ObjectID(savedNewTradeFile._id),
                seq_no: 1,
                content: submissionLineJSON
              };

              let savedNewTradeFileContents = await tradeFileContent().createTradeFileContents(newTradeFileContents);

              sendToSlack(`File: ${destinationJSONFile} content: ${JSON.stringify(submissionLineJSON)}.`);

            }

            lineReader.close();
            fileStream.close();

          }

        })
        .catch(err => {

          sendToSlack(`Err: ${err.toString()}`);

          this.log.info('err', err);

        });

      client.on("error", (err) => {

        if (err)
          sendToSlack(`Err: ${err.toString()}`);

        this.log.info('err', err);

      });

      client.on("end", (err) => {

        if (err)
          sendToSlack(`Err: ${err.toString()}`);

        this.log.info('end', err);

      });

      client.on("close", (err) => {

        if (err)
          sendToSlack(`Err: ${err.toString()}`);
        this.log.info('close', err);

      });
    } catch (err) {

      this.log.info('processLinkageFiles', err);

    }

  }

  /**
   * Reads data from input redis adepter
   * @returns
   * @memberof ReportPackagerService
   */
  async readFromQueue() {

    return new Promise((resolve, reject) => {

      return this.redisClient.blpop(this.config.redis.queue, 1, (err, msg) => {

        if (!err) {

          if (msg) {

            try {

              const jsonmsg = JSON.parse(msg[1]);

              this.log.info('in linkage:',jsonmsg);

              return resolve(jsonmsg);

            } catch (err) {

              this.log.info(err);

              this.log.info(`Error when reading from queue::${this.config.redis.queue}`);

              return resolve();

            }

          }

          return resolve();

        } else {

          // TODO Need to check the implementation fpr proper logging
          this.log.info(err);

          // TODO Need to revisit this logic
          if (this.isRunning) {

            this.log.info(`Error when reading from queue::${this.config.redis.queue}`);

          }

          return resolve();

        }

      });

    });

  }

  /**
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async stop(_cb) {

    await this.redisClient.quit();

  }

  /**
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async finalize(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async run(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   *
   * @returns
   * @memberof ReportRecieverService
   */
  initializeRedisReader() {

    return new Promise((resolve, reject) => {

      this.redisClient.on('ready', () => {

        this.isRunning = true;

        this.log.info('Redis connection success TradeSubmission Service.');

        resolve(true);

      });

      this.redisClient.on('end', () => {

        this.isRunning = false;

        this.log.info('REDIS connection closed for  TradeSubmission Service.');

        resolve(true);

      });

      this.redisClient.on('error', (_error) => {

        this.isRunning = true;

        this.log.info('REDIS connection error for  TradeSubmission Service.', _error);

        this.redisClient.quit();

        reject(_error);

      });

    })

  }

  /**
   * Creates an instance of ReportSchedulerService.
   * @param {*} args
   * @memberof ReportRecieverService
   */
  constructor(...args) {

    super(...args);

    this.config = {};

    this.redisClient = undefined;

  }

}

module.exports.FileLinkageService = FileLinkageService;
