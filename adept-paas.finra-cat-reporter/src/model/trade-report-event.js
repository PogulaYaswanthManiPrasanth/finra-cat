/*
 * File:		    trade-report-event.js
 *
 * Description:		Class for handling trade report event content CRUD operations
 *
 * Created:			Tuesday, 05th May 2020 03:10:48 pm
 *
 * Author:			Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:		Tuesday, 05th May 2020 03:10:48 pm
 *       By:		Anand Ramani (aramani@thapovan-inc.com)
 *
 * 					Copyright (c) 2019 - Present
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


const { tradeReportEvent }              = require('adept.trade-store.db');

let tradeReportEventModel = undefined;

/**
 * Class for handling trade report event CRUD operations
 * @class TradeFileModel
 */
class TradeReportEventMddel {

  constructor() {

    tradeReportEventModel = tradeReportEvent();

  }

  /**
   * Method to update trade event object
   * @param {*} tradeEventObj
   * @returns tradeEventObj
   * @memberof TradeEventModel
   */
  async updateTradeReportEvent(tradeEventObj) {

    try {



    } catch (err) {

      this.log.error(err);

    }
  }

}



let _tradeReportEventModelInstance = null;

exports.getTradeReportEventModelInstance = function () {

  if (!_tradeReportEventModelInstance) _tradeReportEventModelInstance = new TradeReportEventModel();

  return _tradeReportEventModelInstance;

}
