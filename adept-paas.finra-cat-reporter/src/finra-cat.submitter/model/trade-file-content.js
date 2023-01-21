/*
 * File:		    trade-file-content.js
 *
 * Description:		Class for handling trade file content CRUD operations
 *
 * Created:			Monday, 27th APRIL 11:30:48 am
 *
 * Author:			Anand Ramani (aramani@thapovan-inc.com)
 *
 * Modified:		Monday, 27th APRIL 11:30:48 am
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
     * @param {*} _tradeFileContentObj
     * @returns tradeFileContentData
     * @memberof TradeFileContentModel
     */
    async createTradeFileContents(_tradeFileContentObj) {

        try {

            let tradeFileContentData = tradeFileContentModel.createTradeFileContents(_tradeFileContentObj);

            return tradeFileContentData;

        } catch(err) {

            this.log.error(err);

        }
    }
}


let _tradeFileContentModelInstance = null;

exports.getTradeFileContentModelInstance = function() {

    if( !_tradeFileContentModelInstance ) _tradeFileContentModelInstance = new TradeFileContentModel();

    return _tradeFileContentModelInstance;
}
