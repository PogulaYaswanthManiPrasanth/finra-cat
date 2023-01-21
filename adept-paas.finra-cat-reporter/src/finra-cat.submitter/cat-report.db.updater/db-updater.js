/*
 * File:		    db-updater.js
 *
 * Description:	This class will update the trade report event and trade event records in DB
 *
 * Created:			Wednesday, 17th JUN 2020 01:00:00 pm
 *
 * Author:			Kethan Chandrakanth (kchandrakanth@thapovan-inc.com)
 *
 * Modified:		Wednesday, 17th JUN 2020 01:00:00 pm
 *       By:		Kethan Chandrakanth (kchandrakanth@thapovan-inc.com)
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

const { initializeDb,
  disconnectDb,
  tradeEvent,
  tradeReport,
  tradeReportEvent }                    = require('adept.trade-store.db');

const sendToSlack                       = require('../utils/slack');

const stateUtil                         = require('adept.tradestore.util');

const { Exception, Errors }             = require('com.errors');

/**
 * @class DBUpdaterService
 * @extends {ServiceModule}
 */
exports.DBUpdater = class DBUpdaterService extends ServiceModule {


  /**
   * Creates an instance of ReportPackagerService.
   * @param {*} _args
   * @memberof ReportPackagerService
   */
  constructor(..._args) {

    super(..._args);

    this.config = { redis: {} };

    this.redisReader = undefined;

    this.isRunning = false;

  }

  /**
   * Lifecyle load method . sets the config required for the app
   * @param {*} _cb
   * @memberof ReportPackagerService
   */
  async load(_cb) {

    try {

      if (!(gService.context.config && gService.context.config.redis && gService.context.config.redis.dbUpdaterQueue)) {

        throw new Exception(Errors.ECNFMIS, "Missing redis dbUpdater queue configuration");
      }

      this.config.redis = (gService.context.config && gService.context.config.redis);

    } catch (err) {

      this.log.error(err);

    }

  }

  /**
   * Lifecycle initialize method . initialize redis client
   * @param {*} _cb
   * @memberof ReportPackagerService
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

      await this.initializeRedis();

    }
    catch (err) {

      this.log.error(err);

    }

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

        this.log.error('REDIS connection error for ReportPackagerService.', _error);

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

        try {

          await initializeDb(`mongodb://${data.dbHost}:${data.dbPort}/${data.dbName}`);

          let reportEvents = data.reportEvents;

          let reportId = data.reportId;

          let now = data.now;

          sendToSlack(`Updating: TradeReporEvent and TradeEvent`);

          await this.asyncForEach(reportEvents, async (reportEvent) => {

            await tradeReportEvent().upsertTradeReportEvent({
              _id: reportEvent._id,
              "spec_data.submission.dt": now,
            });

            let tradeEventDoc = await tradeEvent().getAllTradeEvents({ filter: { "spec_data.event.json.firmROEID": reportEvent.event_data.firmROEID } });

            tradeEventDoc = tradeEventDoc.items[0];

            tradeEventDoc.spec_data.submission = {};
            tradeEventDoc.spec_data.submission.dt = now;

            await tradeEvent().updateTradeEventById(tradeEventDoc._id, { spec_data: tradeEventDoc.spec_data, state: stateUtil.EventStates.WorkFlowEventStates.STATE.SUBMITTED });

            this.log.info("Trade Event:", tradeEventDoc._id, "Trade Report Event:", reportEvent._id);

          });

          await tradeReport().upsertTradeReport({ _id: reportId, state : stateUtil.EventStates.WorkFlowEventStates.STATE.SUBMITTED });

          await disconnectDb();

        } catch (err) {

          sendToSlack(`Err: ${err.toString()}`);

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

      return this.redisClient.blpop(this.config.redis.dbUpdaterQueue, 1, (err, msg) => {

        if (!err) {

          if (msg) {

            try {

              const jsonmsg = JSON.parse(msg[1]);

              return resolve(jsonmsg);

            } catch (err) {
              // TODO: log error to log also to event monitor
              this.log.error(err);

              this.log.error(`Error when reading from queue::${this.config.redis.dbUpdaterQueue}`);

              return resolve();

            }

          }

          return resolve();

        } else {

          // TODO Need to check the implementation fpr proper logging
          this.log.error(err)

          // TODO Need to revisit this logic
          if (this.isRunning) {

            this.log.error(`Error when reading from queue::${this.config.redis.dbUpdaterQueue}`);

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

}
