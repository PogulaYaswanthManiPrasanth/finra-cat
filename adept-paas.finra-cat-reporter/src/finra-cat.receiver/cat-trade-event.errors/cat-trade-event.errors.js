/*
 * File:		      cat-trade-event.errors.js
 *
 * Description:		This class will store the finra feedbackfiles in to trade store
 *
 * Created:			  Tuesday, 05th May 2020 03:10:48 pm
 *
 * Author:			  Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:			Tuesday, 05th May 2020 03:10:48 pm
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

const sftpWatcher                      = require("../utils/sftp/watcher");

const feedbackFiles                     = require('./feedback.files');

const sendToSlack                       = require('../utils/slack');

const { Exception, Errors }             = require('com.errors');

class TradeEventErrorService extends ServiceModule {

  /**
  * Lifecyle load method . sets the config required for the app
  * @param {*} _cb
  * @memberof TradeEventErrorService
  */
  async load(_cb) {

    try {

      if (!(gService.context.config && gService.context.config.redis)) {

        throw new Exception(Errors.ECNFMIS, "Missing redis configuration");
      }

      if (!(gService.context.config && gService.context.config.sftp)) {

        throw new Exception(Errors.ECNFMIS, "Missing sftp configuration");
      }

      this._config.redis = (gService.context.config && gService.context.config.redis);

      this._config.sftp = (gService.context.config && gService.context.config.sftp);

    } catch (err) {

      this.log.error(err);

    }

  }

  /**
   * Lifecycle start method. Starts streaming data
   * @param {*} _cb
   * @memberof ReportRecieverService
   */
  async start(_cb) {

    setTimeout(() => {

      try {

        this._sftpWatcher = sftpWatcher(this._config.sftp);

        this._sftpWatcher.on("uploaded", (_data) => {

          let fileName = _data.fileName.substr(_data.fileName.indexOf('.') + 1, _data.fileName.length);

          for (let i = 0; i < feedbackFiles.length; i++) {

            const feedbackFile = feedbackFiles[i];

            let fileRegex = new RegExp(`^${feedbackFile}$`);            

            if (fileName.match(fileRegex)) {

              sendToSlack(`Feedback Received: ${_data.fileName}`, true);

              let sftpUpload = { folder: _data.folder, fileName: _data.fileName };

              this.processData(sftpUpload);

              break;

            }

          }

        });

        this._sftpWatcher.on("error", (name, err) => {
          sendToSlack(`Err: ${name} : ${err.toString()}`);
          this.log.info('err', err);
          this.log.error(err);

        });
      } catch (err) {

        sendToSlack(`Err: ${err.toString()}`);
        this.log.info(err);
        this.log.error(err);

      }
    }, 0);


  }

  /**
   * Process the data recieved from the queue
   * @param {*} _data
   * @memberof TradeEventErrorService
   */
  async processData(_data) {

    try {

      this.redisClient.lpush(this._config.redis.queue, JSON.stringify(_data), (_res1, _res2) => { });

    } catch (err) {

      this.log.error(err);

    }

  }

  /**
   * @param {*} _cb
   * @memberof TradeEventErrorService
   */
  async stop(_cb) {

  }

  /**
   * @param {*} _cb
   * @memberof TradeEventErrorService
   */
  async finalize(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   * @param {*} _cb
   * @memberof TradeEventErrorService
   */
  async run(_cb) {

  }

  /**
   * Lifecycle initialize method . initialize redis client
   * @param {*} _cb
   * @memberof TradeEventErrorService
   */
  async initialize(_cb) {

    try {

      this.redisClient = redis.createClient(this._config.redis.url, {
        retry_strategy: (options) => {

          if (options.error && (options.error.code === 'ECONNREFUSED' || options.error.code === 'NR_CLOSED')) {
            // Try reconnecting after 5 seconds
            this.log.info('The server refused the connection. Retrying connection...');
            return 5000;
          }
          if (options.total_retry_time > this._config.redis.retry.total_retry_time) {
            // End reconnecting after a specific timeout and flush all commands with an individual error
            return new Error('Retry time exhausted');
          }
          if (options.attempt > this._config.redis.retry.attempt) {
            // End reconnecting with built in error
            return undefined;
          }
                                        // reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });

      await this.initializeRedisReader();

    } catch (err) {

      sendToSlack(err.toSting());
      this.log.error(err);

    }

  }

  /**
    *
    * @returns
    * @memberof ReportRecieverService
    */
  initializeRedisReader() {

    return new Promise((resolve, reject) => {

      this.redisClient.on('ready', () => {

        this.log.info('Redis connection success CAT-Trade-event.error Service.');

        resolve(true);

      });

      this.redisClient.on('end', () => {

        this.log.info('REDIS connection closed for CAT-Trade-event.error Service.');

        resolve(true);

      });

      this.redisClient.on('error', (_error) => {

        this.log.info('REDIS connection error for CAT-Trade-event.error Service.', _error);

        this.redisClient.quit();

        reject(_error);

      });

    });

  }


  /**
   * Creates an instance of ReportSchedulerService.
   * @param {*} args
   * @memberof ReportRecieverService
   */
  constructor(...args) {

    super(...args);

    this._config = { redis: { "inputQueue": {} } };

    this._sftpWatcher = undefined;

    this.redisClient = undefined;

  }

}

module.exports.TradeEventErrorService = TradeEventErrorService;
