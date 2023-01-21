/*
 * File:		    report-scheduler.js
 *
 * Description:		This class will make schedule trade submission request and insert the result data in to redis
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

const cronJob                           = require('./cron');

const eventEmitter                      = require('events').EventEmitter;

const { Exception, Errors }             = require('com.errors');

/**
 * @class ReportSchedulerService
 * @extends {ServiceModule}
 */
class ReportSchedulerService extends ServiceModule {

  /**
 * Creates an instance of ReportSchedulerService.
 * @param {*} args
 * @memberof ReportSchedulerService
 */
  constructor(...args) {

    super(...args);

    this.config = { redis: {} };

    this._redisClient = undefined;

  }

  /**
   * Lifecyle load method . sets the config required for the app
   * @param {*} _cb
   * @memberof ReportSchedulerService
   */
  async load(_cb) {

    try {

      this.config.redis = (gService.context.config && gService.context.config.redis);

      this.config.cron = (gService.context.config && gService.context.config.cron);

      if (!(gService.context.config && gService.context.config.redis)) {

        throw new Exception(Errors.ECNFMIS, "Missing redis configuration");
      }

      if (!(gService.context.config && gService.context.config.cron)) {

        throw new Exception(Errors.ECNFMIS, "Missing cron configuration");
      }

    } catch (err) {

      this.log.error(err);

    }

  }

  /**
   * Lifecycle initialize method . initialize redis client
   * @param {*} _cb
   * @memberof ReportSchedulerService
   */
  async initialize(_cb) {

    try {

      this.emitter = new eventEmitter();

      try {

        // await this.initializeRedis();

        cronJob(this.config.cron, this.emitter).startCron();

      } catch (err) {

        this.log.error(err);

      }

    } catch (err) {

      this.log.error(err);

    }

  }

  /**
   * Lifecycle start method. Starts streaming data
   * @param {*} _cb
   * @memberof ReportSchedulerService
   */
  async start(_cb) {

      this.emitter.on('cron-schedule', (data) => {

        try {


          if(!this._redisClient) {

            this.initializeRedis();

          }

          this._redisClient.ping((_err, _data) => {  
          
          if (_err) {

            this.initializeRedis();
          
          } 

          this._redisClient.lpush(data.redisQueue, JSON.stringify({reportInfo:[{_id:data.reportId, domain: data.domain}]}), (_res1, _res2) => { });
          
        })          

          
  
  
        } catch (_error) {
                                        // TODO Need to be removed after testing in poc and production
          console.log(_error)
        }        
        
      });

  }

  /**
   * @param {*} _cb
   * @memberof ReportSchedulerService
   */
  async stop(_cb) {

  }

  /**
   * @param {*} _cb
   * @memberof ReportSchedulerService
   */
  async finalize(_cb) {

  }

  /**
   * @param {*} _cb
   * @memberof ReportSchedulerService
   */
  async run(_cb) {
    // do nothing for now .its just a placeholder
  }

  /**
   *
   * @returns
   * @memberof ReportSchedulerService
   */
  initializeRedis() {

                                        // TODO Need to be removed after testing in poc and production
                                        
    console.log("TEST Inside Initialize Redis");

    try{

      this._redisClient = redis.createClient(this.config.redis.url, {
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
    } catch(_err) {

                                        // TODO Need to remove after tested in POC and Production

      console.log(_err)

    }

   

  }

}

exports.ReportSchedulerService = ReportSchedulerService;

var __theModule__ = undefined;

exports.getInstance = function () {

  return (__theModule__ ? __theModule__ : (__theModule__ = new ReportSchedulerService()));

};
