/*
 * File:		    trade-file.js
 *
 * Description:		Class for handling trade file CRUD operations
 *
 * Created:			Tuesday, 29th April 2020 04:00:10 pm
 *
 * Author:			Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:		Tuesday, 29th April 2020 04:00:10 pm
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


const { tradeFile }                     = require('adept.trade-store.db');

let tradeFileModel = undefined;

/**
 * Class for handling trade file CRUD operations
 * @class TradeFileModel
 */
class TradeFileModel {

  constructor() {

    tradeFileModel = tradeFile();

  }

  /**
   * Method to create tradeFile record
   * @param {*} tradeFileObj
   * @returns tradeFileData
   * @memberof TradeFileModel
   */
  async createTradeFile(tradeFileObj) {

    try {

      let tradeFileData = tradeFileModel.upsertTradeFile(tradeFileObj);

      return tradeFileData;

    } catch (err) {

      this.log.error(err);

    }

  }

}

let _tradeFileModelInstance = null;

exports.getTradeFileModelInstance = function () {

  if (!_tradeFileModelInstance) _tradeFileModelInstance = new TradeFileModel();

  return _tradeFileModelInstance;
}
