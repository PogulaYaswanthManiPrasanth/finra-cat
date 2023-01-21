/*
 * File:		    trade-file.js
 *
 * Description:		Class for handling trade file CRUD operations
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


const { tradeFile }                     = require('adept.trade-store.db');

let tradeFileModel = undefined;

/**
 * Class for handling trade file CRUD operations
 * @class TradeFileModel
 */
class TradeFileModel {

    constructor() {

        tradeFileModel = tradeFile()

    }

    /**
     * Method to create tradeFile record
     * @param {*} _tradeFileObj
     * @returns tradeFileData
     * @memberof TradeFileModel
     */
    async upsertTradeFile(_tradeFileObj){

        try {

            let tradeFileData = tradeFileModel.upsertTradeFile(_tradeFileObj);

            return tradeFileData;

        }
        catch(err) {

            this.log.error(err);

        }
    }
}

let _tradeFileModelInstance = null;

exports.getTradeFileModelInstance = function() {

    if( !_tradeFileModelInstance ) _tradeFileModelInstance = new TradeFileModel();

    return _tradeFileModelInstance;
}
