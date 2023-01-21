/*
 * File:		    index.js
 *
 * Description:		This class will make package the report and metadata  and insert the ouput file path to redis
 *
 * Created:			Friday, 13th MAR 12:10:48 pm
 *
 * Author:			Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:		Friday, 13th MAR 12:10:48 pm
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

const Client                            = require('ssh2-sftp-client');

const { ServiceModule }                 = require('service.module.core');

const sendToSlack                       = require('../utils/slack');

const { Exception, Errors }             = require('com.errors');

/**
 * @class ReportSubmitterService
 * @extends {ServiceModule}
 */
class ReportSubmitterService extends ServiceModule {

  /**
   * Lifecyle load method . sets the config required for the app
   * @param {*} _cb
   * @memberof ReportSubmitterService
   */
  async load(_cb) {

    try {


      if (!(gService.context.config && gService.context.config.redis && gService.context.config.redis.outputQueue)) {

        throw new Exception(Errors.ECNFMIS, "Missing redis output queue configuration");
      }

      if (!(gService.context.config && gService.context.config.sftp)) {

        throw new Exception(Errors.ECNFMIS, "Missing SFTP configuration");
      }

      this.config.redis = (gService.context.config && gService.context.config.redis);

      this.config.sftp = (gService.context.config && gService.context.config.sftp);

    } catch (err) {

      this.log.error(err);

    }

  }

  /**
   * Lifecycle initialize method . initialize redis client
   * @param {*} _cb
   * @memberof ReportSubmitterService
   */
  async initialize(_cb) {

    try {

      this.redisClient = redis.createClient(this.config.redis.url, {
        retry_strategy: (options) => {

          if (options.error && (options.error.code === 'ECONNREFUSED' || options.error.code === 'NR_CLOSED')) {
            // Try reconnecting after 5 seconds
            this.log.error('The server refused the connection. Retrying connection...');
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

      // this.sftpClient = new SFTPClient();

      await this.initializeRedis();

    }
    catch (err) {

      this.log.error(err);
    }

  }

  /**
   * Connect to SFTP client
   * @memberof ReportSubmitterService
   */
  async connectSFTP() {

    await this.sftpClient.connect({ host: this.config.sftp.host, port: this.config.sftp.port, username: this.config.sftp.username, password: this.config.sftp.password });

  }

  /**
   * initialize redis client
   * @memberof ReportSubmitterService
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

        this.log.error('REDIS connection error for ReportPackagerService.', _error);

        this.isRunning = true;

        this.redisClient.quit();

        reject(_error);

      });

    });

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
   * @memberof ReportSubmitterService
   */
  async readInLoop() {

    if (this.redisClient.connected) {

      let data = await this.readFromQueue();

      if (data) {

        this.uploadReportToSFTP(data);
      }
    }
    setImmediate(() => {

      this.readInLoop.call(this);

    });

  }

  /**
   * Upload report file and meta data to SFTP
   * @param {*} _data
   * @memberof ReportSubmitterService
   */
  async uploadReportToSFTP(_data) {

    try {

      let client = new Client();

      let domainSftpConfig = this.config.sftp[_data.domainSftpConfigKey]

      client.connect(domainSftpConfig)
        .then(async () => {

          sendToSlack(`File Submitted: ${_data.metaFileName}`, true);

          sendToSlack(`File Submitted: ${_data.bzipFileName}`, true);

          await client.put(_data.metaFilePath, `${domainSftpConfig.path}/${_data.metaFileName}`);

          await client.put(_data.bzipFilePath, `${domainSftpConfig.path}/${_data.bzipFileName}`);

          return;

        })
        .then(() => {

          client.end();

        })
        .catch(err => {

          this.log.error(err.message);
          sendToSlack(`Err: ${err.message.toString()}`);

        });

      client.on("error", (err) => {

        if (err) {

          sendToSlack(`Err: ${err.toString()}`);
          this.log.error(err);

        }


      });
      client.on("end", (err) => {

        if (err) {

          sendToSlack(`Err: ${err.toString()}`);
          this.log.error(err);

        }

      });
      client.on("close", (err) => {

        if (err) {

          sendToSlack(`Err: ${err.toString()}`);
          this.log.error('close', err);

        }


      });

    } catch (err) {

      if(err) {

        sendToSlack(`Err: ${err.toString()}`);
        this.log.error(err);

      }

    }

  }

  /**
   * Reads data from input redis adepter
   * @returns
   * @memberof ReportSubmitterService
   */
  async readFromQueue() {

    return new Promise((resolve, reject) => {

      return this.redisClient.blpop(this.config.redis.outputQueue, 1, (err, msg) => {

        if (!err) {

          if (msg) {

            try {

              const jsonmsg = JSON.parse(msg[1]);

              return resolve(jsonmsg);

            } catch (err) {
              // TODO: log error to log also to event monitor
              this.log.error(err);

              this.log.error(`Error when reading from queue::${this.config.redis.outputQueue}`);

              return resolve();

            }

          }

          return resolve();

        } else {

          // TODO Need to check the implementation fpr proper logging
          this.log.error(err)

          // TODO Need to revisit this logic
          if (this.isRunning) {

            this.log.error(`Error when reading from queue::${this.config.redis.outputQueue}`);

          }

          return resolve();

        }

      });

    });

  }

  /**
   * @param {*} _cb
   * @memberof ReportSubmitterService
   */
  async stop(_cb) {

    this.redisClient.quit();

  }

  /**
   * @param {*} _cb
   * @memberof ReportSubmitterService
   */
  async finalize(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   * @param {*} _cb
   * @memberof ReportSubmitterService
   */
  async run(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   * get current data
   * @returns
   * @memberof ReportSubmitterService
   */
  getCurrentDate(_reportDate) {

    let today = _reportDate || new Date();

    return today.toISOString().split("T")[0];

  }


  /**
   * Creates an instance of ReportPackagerService.
   * @param {*} _args
   * @memberof ReportSubmitterService
   */
  constructor(..._args) {

    super(..._args);

    this.config = { redis: {}, sftp: {} };

    this.redisReader = undefined;

    this.sftpClient = undefined;

    this.isRunning = false;

  }

}

module.exports.ReportSubmitterService = ReportSubmitterService;
