/*
 * File:		    trade-file-content.js
 *
 * Description:		Class for handling trade file content CRUD operations
 *
 * Created:			Tuesday, 29th April 2020 04:05:10 pm
 *
 * Author:			Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:		Tuesday, 29th April 2020 04:05:10 pm
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


const { tradeFileContent }              = require('adept.trade-store.db');

let tradeFileContentModel = undefined;

/**
 * Class for handling trade file cotnent CRUD operations
 * @class TradeFileModel
 */
class TradeFileContentModel {

  constructor() {

    tradeFileContentModel = tradeFileContent();

  }

  /**
   * Method to create tradeFile record
   * @param {*} tradeFileContentObj
   * @returns tradeFileContentData
   * @memberof TradeFileContentModel
   */
  async createTradeFileContents(tradeFileContentObj) {

    try {

      let tradeFileContentData = tradeFileContentModel.createTradeFileContents(tradeFileContentObj);

      return tradeFileContentData;

    } catch (err) {

      this.log.error(err);

    }

  }

}


let _tradeFileContentModelInstance = null;

exports.getTradeFileContentModelInstance = function () {

  if (!_tradeFileContentModelInstance) _tradeFileContentModelInstance = new TradeFileContentModel();

  return _tradeFileContentModelInstance;
}
