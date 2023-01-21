/*
 * File:		    trade-event.js
 *
 * Description:		Class for handling trade event CRUD operations
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


const { tradeEvent }              = require('adept.trade-store.db');

let tradeEventModel = undefined;

/**
 * Class for handling trade file cotnent CRUD operations
 * @class TradeFileModel
 */
class TradeEventModel {

  constructor() {

    tradeEventModel = tradeEvent();

  }

  /**
   * Method to update trade event object
   * @param {*} tradeEventObj
   * @returns tradeEventObj
   * @memberof TradeEventModel
   */
  async updateTradeEventData(filter, delta) {

    try {

      let tradeFileContentData = tradeEventModel.updateTradeEventsByQuery(filter, delta);

      return tradeFileContentData;

    } catch (err) {

      this.log.error(err);

    }
  }

  /**
   * Get the trade events based on the filter passed to it
   * @param {*} filter
   * @returns
   * @memberof TradeEventModel
   */
  async getTradeEvents(filter) {

    try {

      let tradeEvent = tradeEventModel.getAllTradeEvents(filter);

      return tradeEvent;

    } catch (err) {

      this.log.error(err);

    }

  }

}



let _tradeEventModelInstance = null;

exports.getTradeEventModelInstance = function () {

  if (!_tradeEventModelInstance) _tradeEventModelInstance = new TradeEventModel();

  return _tradeEventModelInstance;
}
