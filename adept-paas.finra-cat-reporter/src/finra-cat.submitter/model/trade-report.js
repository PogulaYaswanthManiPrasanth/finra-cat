/*
 * File:		    trade-report.js
 *
 * Description:		Class for handling trade report CRUD operations
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


const { tradeReport }                     = require('adept.trade-store.db');

let tradeReportModel = undefined;

/**
 * Class for handling trade report CRUD operations
 * @class TradeReportModel
 */
class TradeReportModel {

    constructor() {

        tradeReportModel = tradeReport()

    }

    /**
     * Method to update tradeReport record
     * @param {*} _tradeReport
     * @returns tradeFileData
     * @memberof TradeReportModel
     */
    async upsertTradeReport(_tradeReport){

        try {

            let result = tradeReportModel.upsertTradeReport(_tradeReport);

            return result;

        }
        catch(err) {

            this.log.error(err);

        }
    }
}

let _tradeReportModelInstance = null;

exports.getTradeReportModelInstance = function() {

    if( !_tradeReportModelInstance ) _tradeReportModelInstance = new TradeReportModel();

    return _tradeReportModelInstance;
}
