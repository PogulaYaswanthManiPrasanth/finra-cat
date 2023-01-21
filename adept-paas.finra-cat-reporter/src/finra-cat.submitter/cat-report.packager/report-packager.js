/*
 * File:		    index.js
 *
 * Description:		This class will make package the report and metadata  and insert the ouput file path to redis
 *
 * Created:			Wednesday, 06th MAR 2019 03:10:48 pm
 *
 * Author:			Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:		Wednesday, 06th MAR 03:10:48 pm
 *       By:		Anand Ramani (aramani@thapovan-inc.com)
 *
 * 					Copyright (c) 2019 - 2020
 * 					xinthesys, inc. All rights reserved.
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

const fs                                = require('fs');

const path                              = require('path');

const crypto                            = require('crypto');

const { Exception, Errors }             = require('com.errors');

const { initializeDb,
  disconnectDb,
  tradeEvent,
  tradeFile,
  tradeFileContent,
  tradeReportEvent,
  tradeReport }                         = require('adept.trade-store.db');

const { ObjectID }                      = require("mongodb");

const util                              = require('util');

const exec                              = util.promisify(require('child_process').exec);

const generate                          = require('com.small-uuid/generate')

const sendToSlack                       = require('../utils/slack');

const { append }                        = require('../utils/json')

const { Transform }                     = require('stream');

const stateUtil                         = require('adept.tradestore.util');

/**
 * @class ReportPackagerService
 * @extends {ServiceModule}
 */
exports.ReportGenerator = class ReportPackagerService extends ServiceModule {


  /**
   * Lifecyle load method . sets the config required for the app
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async load(_cb) {

    try {

      if (!(gService.context.config && gService.context.config.redis)) {

        throw new Exception(Errors.ECNFMIS, "Missing redis configuration");
      }

      if (!(gService.context.config && gService.context.config.domainmap)) {

        throw new Exception(Errors.ECNFMIS, "Missing domainmap configuration");
      }

      if (!(gService.context.config && gService.context.config.report)) {

        throw new Exception(Errors.ECNFMIS, "Missing report file configuration");
      }

      this.config = (gService.context.config && gService.context.config);

      this.config.redis = (gService.context.config && gService.context.config.redis);

      this.config.domainmap = (gService.context.config && gService.context.config.domainmap);

      this.outputFolder = path.join(process.cwd(), gService.context.config.outputFolder);

      this.reportKeyFile = gService.context.config.reportKeyFile;

      if (gService.context.config && gService.context.config.outputFolder) {

        if (!fs.existsSync(this.outputFolder)) {

          fs.mkdirSync(this.outputFolder);

        }

      }

      this.reportFileConfig = (gService.context.config && gService.context.config.report);
      
      this.reportGroup = this.reportFileConfig.reportGroup;

    } catch (err) {

      throw new Exception(Errors.ECNFINV, "Invalid file configuration");

    }

  }

  /**
   * Lifecycle initialize method . initialize redis client
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async initialize(_cb) {

    try {

      console.log(`config : ${this.config}`)

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

      await this.initializeRedis();

    }
    catch (err) {

      this.log.error(err);

    }

  }

  /**
   * Get short UUID based on the length
   * @param {Number} _len
   * @memberof ReportPackagerService
   */

  getUUID(_len) {

    return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', _len)

  }


  /**
   * initialize redis client
   * @memberof ReportPackagerService
   */
  initializeRedis() {

    return new Promise((resolve, reject) => {

      this.redisClient.on('ready', () => {

        this.log.info('Redis connection success ReportPackagerService');

        this.isRunning = true;

        resolve(true);

      });

      this.redisClient.on('end', () => {

        this.log.info('REDIS connection closed for ReportPackagerService.');

        this.isRunning = false;

        resolve(true);

      });

      this.redisClient.on('error', (_error) => {

        this.log.info('REDIS connection error for ReportPackagerService.', _error);

        this.isRunning = true;

        this.redisClient.quit();

        reject(_error);

      });

    })

  }

  /**
   * Lifecycle start method. Starts reading data and generate reports based on the data recieved
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async start(_cb) {

    this.readInLoop();

  }

  /**
   * Loop to read continuosly data from redis usin blpop
   * @memberof ReportPackagerService
   */
  async readInLoop() {

    if (this.redisClient.connected) {

      let data = null;

      data = await this.readFromQueue();
      
      if (data) {

        if (data.startDate && data.domain) {

          let domains = Object.keys(this.config.domainmap);

          await this.asyncForEach(domains, async (domainName) => {

            let domain = this.config.domainmap[domainName];

            await this.asyncForEach(domain.entityIds, async (entity) => {

              if (entity) {

                if (data.domain.toLowerCase() == domainName.toLowerCase()) {

                  if (data.startDate && data.domain) {

                    this.log.info(`mongodb://${domain.dbHost}:${domain.dbPort}/${domain.dbName}`);

                    let config = this.config;

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

                    config.domainSftpConfigKey = domainName.toLowerCase(); 

                    let reportIds = await this.getTradeReportsByDomainAndEntity(data.domain, entity, data.startDate, config);

                    await this.asyncForEach(reportIds, async (reportId) => {

                      this.log.info('processing...', reportId);

                      config.linkageKey = this.getUUID(12);

                      let result = await this.getTradeReportsByReportId(reportId, config);
                      //console.log("result",result);
                      let _dataStream = result.stream;

                      config.report.reporterIMID = result.reporterIMID;

                      if (_dataStream) {

                        await this.processPackaging(_dataStream, config);
                        

                        await append(this.reportKeyFile, {
                          [config.linkageKey]: {
                            name: domainName,
                            domain: {
                              "dbHost":this.config.domainmap[domainName].dbHost,
                              "dbName":this.config.domainmap[domainName].dbName,
                              "dbPort":this.config.domainmap[domainName].dbPort
                            },
                          },
                        });
                      }

                    });

                    await config.disconnectDb();

                  }

                }

              }

            });

          });

        }

        if (data.reportInfo) {
          //console.log("=======data.reportInfo=========",data.reportInfo);
          await this.asyncForEach(data.reportInfo, async (report) => {

            let domains = Object.keys(this.config.domainmap);

            await this.asyncForEach(domains, async (domainName) => {

              let domain = this.config.domainmap[domainName];

              if (report.domain.toLowerCase() == domainName.toLowerCase()) {

                this.log.info(`mongodb://${domain.dbHost}:${domain.dbPort}/${domain.dbName}`);

                let config = this.config;

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

                config.domainSftpConfigKey = domainName.toLowerCase(); 
                //console.log("====config.domainSftpConfigKey =====",config.domainSftpConfigKey);

                config.linkageKey = this.getUUID(12);

                this.log.info(config.linkageKey);
                this.log.info('processing...', report._id);

                let result = await this.getTradeReportsByReportId(report._id, config);
                //console.log("result==========",result);
                let _dataStream = result.stream;
                //console.log("===========dataStream=======",_dataStream);
                config.report.reporterIMID = result.reporterIMID;

                if (_dataStream) {

                  await this.processPackaging(_dataStream, config);

                  await append(this.reportKeyFile, {
                    [config.linkageKey]: {
                      name: domainName,
                      domain: {
                        "dbHost":this.config.domainmap[domainName].dbHost,
                        "dbName":this.config.domainmap[domainName].dbName,
                        "dbPort":this.config.domainmap[domainName].dbPort
                      },
                    },
                  });
                }

                await config.disconnectDb();

              }

            });

          });

        }

      }

    }

    setImmediate(() => {

      this.readInLoop.call(this);

    });
  }

  /**
   * Reads data from input redis adepter
   * @returns
   * @memberof ReportPackagerService
   */
  async readFromQueue() {

    return new Promise((resolve, reject) => {

      return this.redisClient.blpop(this.config.redis.inputQueue, 1, (err, msg) => {

        if (!err) {

          if (msg) {

            try {

              const jsonmsg = JSON.parse(msg[1]);

              this.log.info(jsonmsg);

              sendToSlack(`==============================================================================================`, true);

              // sendToSlack(`New Submission request: ${jsonmsg.trade_store}`, true);

              return resolve(jsonmsg);

            } catch (err) {
              // TODO: log error to log also to event monitor
              this.log.error(err);

              this.log.info(`Error when reading from queue::${this.config.redis.inputQueue}`);

              return resolve();

            }

          }

          return resolve();

        } else {

          // TODO Need to check the implementation for proper logging
          this.log.error(err);

          // TODO Need to revisit this logic
          if (this.isRunning) {

            this.log.info(`Error when reading from queue::${this.config.redis.inputQueue}`);

          }

          return resolve();

        }

      });

    });

  }

  /**
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async stop(_cb) {

    this.redisClient.quit();

  }

  /**
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async finalize(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async run(_cb) {
    // do nothing for now .its just a placeholder
  }


  async asyncForEach(array, callback) {

    for (let index = 0; index < array.length; index++) {

      await callback(array[index], index, array);

    }

  }

  async getTradeReportsByDomainAndEntity(domain, entityId, startDate, { tradeReport }, sealed = false) {

    try {

      let query = {
        entity_id: entityId,
        ns: "CAT",
        sealed: sealed
      }

      query['scheduled_submission_dt'] = {
        '$gte': new Date(`${startDate}T00:00:00.000Z`).toISOString(),
        '$lt': new Date(`${startDate}T23:59:59.000Z`).toISOString()
      }

      let tradeReports = await tradeReport().getAllTradeReports({ filter: query });

      let reportIds = [];

      tradeReports.items.forEach(tradeReport => {

        reportIds.push(tradeReport._id.toString());

      });

      return Promise.resolve(reportIds);

    } catch (err) {

      this.log.error(err);

    }
  }

  async getTradeReportsByReportId(reportId, { tradeReportEvent, tradeReport }) {

    try {
      //console.log("reportId",reportId);
      let tradeReports = await tradeReport().getAllTradeReports({ filter: {_id : reportId} });
     // console.log(tradeReports);
      let tradeReportObj = tradeReports.items[0];
     // console.log(tradeReportObj);
      let reporterIMID = tradeReportObj.entity_id.split(":")[1];
     // console.log(reporterIMID);
      if(tradeReportObj) {

        if(tradeReportObj.state &&
           tradeReportObj.state == stateUtil.EventStates.WorkFlowEventStates.STATE.PENDING_SUBMISSION) {

            this.log.info('...............PENDING_SUBMISSION...............');

            return null;

          }

        if(tradeReportObj.sealed == false ||
           (tradeReportObj.spec_data.response && tradeReportObj.spec_data.response.dt) != null) {

          let tradeReportStream = await tradeReportEvent().getAllTradeReportEventsByCursor({ filter: { "report_id": reportId } }, { "spec_data.event": 1, "report_id": 1 });

          const transform = new Transform({

            writableObjectMode: true,

            objectMode: true,

            transform(chunk, encoding, callback) {

              this.push(JSON.stringify({ _id: chunk._id, event_data: chunk.spec_data.event.json, report_id: chunk.report_id }) + "\n");

              callback();

            }

          });

          return  {
            stream : tradeReportStream.items.pipe(transform),
            reporterIMID: reporterIMID
          }

        }

      }

      return null;

    } catch (err) {

      this.log.error(err);
      return null;

    }

  }


  async processPackaging(_dataStream, config) {
    //console.log("============process packaging is called==========");

    let { linkageKey, tradeFile, tradeFileContent, tradeReport, tradeReportEvent, disconnectDb, dbHost, dbPort, dbName } = config;

    // let config = this.config;

    let redisClient = this.redisClient;

    let outputFolder = this.outputFolder;

    let reportFileConfig = config.report;

    let reportGroup = reportFileConfig.reportGroup;

    let reportFmt = "json";


    // Packaging Process begins

    try {

      await WriteReport(_dataStream);

      this.log.info('-----------------DONE--------------------------');


    } catch (err) {

      this.log.error(err);

    }

    /**
     * Write Metadata for the report file
     * @param {*} _files
     * @memberof ReportPackagerService
     * @returns
     */
    async function WriteMetaData(_files) {

      let _file = _files[0];

      let splitNames = _file.fileName.split('_');

      let metadata = {
        type: "META",
        fileGenerationDate: splitNames[2],
        "submitter": splitNames[0],
        "fileVersion": reportFileConfig.specVersion,
        "files": _files,
        "reporter": splitNames[1],
        "doneForDay": true
      };

      let mdFileName = `${splitNames[0]}_${splitNames[1]}_${splitNames[2]}_${splitNames[3]}_OrderEvents_${reportGroup}.meta.${reportFmt}`;

      let mdFilePath = path.join(outputFolder, mdFileName);

      fs.writeFileSync(mdFilePath, JSON.stringify(metadata, null, 4));

      return { "metaFileName": mdFileName, "metaFilePath": mdFilePath, metadata: metadata }

    }

    /**
     * Returns the sha256 digest value for the given file
     * @param {*} _fileName
     * @memberof ReportPackagerService
     */

    async function getSHA256(_fileName) {

      return new Promise((resolve, reject) => {

        let hash = crypto.createHash("sha256");
        let stream = fs.createReadStream(_fileName);
        stream.on("error", (err) => reject(err));
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));

      });

    }


    /**
     * Write the trade report to the configured output location
     * @param {*} _dataStream
     * @memberof ReportPackagerService
     */
    async function WriteReport(_dataStream) {

      try {
        let submitterID = reportFileConfig.submitterIdMap[reportFileConfig.reporterIMID] ? reportFileConfig.submitterIdMap[reportFileConfig.reporterIMID] : reportFileConfig.submitterIdMap['default'];

        let fileName = `${submitterID}_${reportFileConfig.reporterIMID}_${getCurrentDate(new Date())}_${linkageKey}_OrderEvents_${reportGroup}.${reportFmt}`;

        let reportPath = path.join(outputFolder, `${fileName}`);

        let jsonObj = {};

        let lineNum = 0;

        async function readStream(stream) {

          return new Promise((resolve, reject) => {

              let chunks = "";
              stream.on("data", chunk => chunks += chunk.toString());
              stream.on("end", () => resolve(chunks));
              stream.on("error", error => reject(error));
          });
        }

        try {

          let chunks = await readStream(_dataStream);

          let reportEvents = [];

            let chunkData = chunks.split('\n');

            try {

              let newChunks = "";

              chunkData.forEach(chunk => {

                try {

                  if (chunk.length > 0 && JSON.parse(chunk) && JSON.parse(chunk).event_data) {

                    let str = JSON.parse(chunk).event_data;
                    newChunks += JSON.stringify(str) + '\n';

                  }
                } catch (err) {

                  sendToSlack(`Err: ${err.toString()}`);

                  this.log.error(err);

                }

              });

              fs.writeFileSync(reportPath, newChunks);

            } catch (err) {
              // An error occurred
              this.log.error(err);
              sendToSlack(`Err: ${err.toString()}`);

            }

            chunkData.forEach((chunk) => {

              try {

                if (chunk.length > 1) {

                  let data = JSON.parse(chunk);

                  reportEvents.push(data);

                  lineNum = lineNum + 1;

                  if (!jsonObj[`${data.report_id}`]) {

                    jsonObj[`${data.report_id}`] = [];

                  }

                  jsonObj[`${data.report_id}`].push({ "line_no": lineNum, "line_content_ref_id": data._id });

                }

              } catch (err) {

                this.log.info(chunk.toString(), err);
                sendToSlack(`Err: ${err.toString()}`);

              }

            });

            let now = new Date();

            let tradeReportId = null;

            if (reportEvents.length > 0) {

              let tradeReportEventDocs = await tradeReportEvent().getAllTradeReportEvents({ filter: { _id: reportEvents[0]._id } })

              if (tradeReportEventDocs.items.length > 0) {

                tradeReportId = tradeReportEventDocs.items[0].report_id;

                await tradeReport().upsertTradeReport({ _id: tradeReportId, report_key: linkageKey, sealed: true, state : stateUtil.EventStates.WorkFlowEventStates.STATE.PENDING_SUBMISSION });

              }
            }

            await exec(`bzip2 -zkf ${reportPath}`);

            let bzipCompressedHash = await getSHA256(`${reportPath}.bz2`);

            let files = [
              {
                fileName: `${fileName}.bz2`,
                recordCount: lineNum,
                compressedHash: bzipCompressedHash,
              }
            ];

            sendToSlack(`Packaged: ${fileName}.bz2`, true);

            let mdFileObj = await WriteMetaData(files);

            let keyArr = Object.keys(jsonObj);

            let key = undefined;

            if (keyArr.length > 0) {

              key = keyArr[0];

              let dataFileId = await storeSubmissionData(key, fileName, jsonObj, linkageKey);

              let metaFileId = await storeSubmissionMeta(key, mdFileObj, linkageKey);

              delete mdFileObj.metadata;

              let reportFileObj = { "reportFilePath": reportPath, "reportFileName": fileName, "bzipFilePath": `${reportPath}.bz2`, "bzipFileName": `${fileName}.bz2` };

              Object.assign(reportFileObj, mdFileObj);
              
              reportFileObj.domainSftpConfigKey = config.domainSftpConfigKey;

              await updateTradeMeta(key, dataFileId, metaFileId);

              redisClient.lpush(config.redis.outputQueue, JSON.stringify(reportFileObj), (_res1, _res2) => { });

              redisClient.lpush(config.redis.dbUpdaterQueue, JSON.stringify({
                now: now,
                reportEvents: reportEvents,
                reportId: tradeReportId,
                dbHost: dbHost,
                dbPort: dbPort,
                dbName: dbName,
              }), (_res1, _res2) => { });

              this.log.info('---------------------COMPLETE--------------------------');

            }

        } catch (error) {

        }

      } catch (err) {
        
        this.log.error(err);
        sendToSlack(`Err: ${err.toString()}`);

      }

    }

    async function asyncForEach(array, callback) {

      for (let index = 0; index < array.length; index++) {

        await callback(array[index], index, array);

      }

    }

    async function storeSubmissionData(_key, _fileName, _jsonObj, linkageKey) {

      try {

        let tradeFileData = undefined;

        let tradeFileObj = {
          filename: _fileName,
          type: "SUB:DATA",
          ref_id: _key,
          ref_collection: "trade-report",
          mime_type: "JSON",
          file_mime_ext: "JSON",
          created_dt: new Date(),
          linkage_key: linkageKey
        }

        tradeFileData = await WriteTradeFile(tradeFileObj);

        await asyncForEach(_jsonObj[_key], async (data) => {

          await WriteTradeFileContent(tradeFileData._id, data);

        });

        return tradeFileData._id;

      } catch (err) {

        this.log.error(err);

      }

      return null;

    }

    async function storeSubmissionMeta(_key, _mdFileObj, linkageKey) {

      try {

        let tradeMetaFileObj = {

          filename: _mdFileObj.metaFileName,
          type: "SUB:META",
          mime_type: "JSON",
          file_mime_ext: "JSON",
          linkage_key: linkageKey

        }

        let tradeMetaFile = await WriteTradeFile(tradeMetaFileObj);

        await WriteTradeFileContent(tradeMetaFile._id, { content: _mdFileObj.metadata });

        await tradeFile().upsertTradeFile({ "_id": tradeMetaFile._id, ref_id: _key, ref_collection: 'trade-report' });

        return tradeMetaFile._id;

      } catch (err) {

        this.log.error(err);

      }

      return null;

    }

    async function updateTradeMeta(_reportId, _dataFileId, _metaFileId) {

      try {
        let submitterID = reportFileConfig.submitterIdMap[reportFileConfig.reporterIMID] ? reportFileConfig.submitterIdMap[reportFileConfig.reporterIMID] : reportFileConfig.submitterIdMap['default'];

        let delta = {
          _id: _reportId,
          reporter_imid: reportFileConfig.reporterIMID,
          submitter_id: submitterID,
          cat_file_number: reportFileConfig.catFileNumber,
          cat_report_group: reportFileConfig.reportGroup,
          cat_file_instruction: "",
          has_errors: false,
          "spec_data.spec_version": reportFileConfig.specVersion,
          "spec_data.submission": {
            "dt": new Date(),
            errors: [],
            has_errors: false
            //"meta_file_id": _metaFileId,
            //"data_file_id": _dataFileId
          }
        }

        await tradeReport().upsertTradeReport(delta);

      } catch (err) {
        
        this.log.error(err);

      }

    }

    async function WriteTradeFile(_tradeFileObj) {

      try {

        let tradeFileData = await tradeFile().upsertTradeFile(_tradeFileObj);

        return tradeFileData;

      } catch (err) {

        this.log.error(err);

        return undefined;

      }

    }

    async function WriteTradeFileContent(_tradeFileId, _data) {

      try {

        let tradeFileContentData = {
          trade_file_id: _tradeFileId,
          seq_no: 1,
          content: {}
        }

        if (_data.content) {

          tradeFileContentData.content = _data.content;

        } else {

          if (_data.line_no) {
            tradeFileContentData.content.line_no = _data.line_no;
          }

          if (_data.line_content_ref_id) {
            tradeFileContentData.content.line_content_ref_id = ObjectID(_data.line_content_ref_id);
          }

        }

        let tradeFileContentRes = await tradeFileContent().createTradeFileContents(tradeFileContentData);

        return tradeFileContentRes;

      } catch (err) {

        this.log.error(err);

        return undefined;

      }

    }

    /**
     * get current data
     * @returns
     * @memberof ReportPackagerService
     */
    function getCurrentDate(_reportDate) {

      let today = _reportDate || new Date();

      return (today.toISOString().split("T")[0]).replace(/-/g, "");

    }

  }



  /**
   * Creates an instance of ReportPackagerService.
   * @param {*} _args
   * @memberof ReportPackagerService
   */
  constructor(..._args) {

    super(..._args);

    this.config = {};

    this.redisReader = undefined;

    this.reportGroup = undefined;

    this.outputFolder = undefined;

    this.tradeStoreHandler = {};

    this.isRunning = false;

    this.reportFmt = "json";

  }

}
