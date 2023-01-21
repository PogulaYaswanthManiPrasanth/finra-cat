/*
 * File:		    trade-report-event.js
 *
 * Description:		Class for handling trade report event CRUD operations
 *
 * Created:			Tuesday, 9th June 5:15 pm
 *
 * Author:			Kethan Surana (kchandrakanth@thapovan-inc.com)
 *
 * Modified:		Tuesday, 9th June 5:15 pm
 *       By:		Kethan Surana (kchandrakanth@thapovan-inc.com)
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


const { tradeReportEvent }                   = require('adept.trade-store.db');

let tradeReportEventModel = undefined;

/**
 * Class for handling trade report CRUD operations
 * @class TradeReportModel
 */
class TradeReportEventModel {

    constructor() {

        tradeReportEventModel = tradeReportEvent()

    }

    /**
     * Method to update tradeReportEvent record
     * @param {*} _tradeReportEvent
     * @memberof TradeReportEventModel
     */
    async upsertTradeReportEvent(_tradeReportEvent){

        try {

            let result = tradeReportEventModel.upsertTradeReportEvent(_tradeReportEvent);

            return result;

        }
        catch(err) {

            this.log.error(err);

        }
    }
}

let _tradeReportEventModelInstance = null;

exports.getTradeReportEventModelInstance = function() {

    if( !_tradeReportEventModelInstance ) _tradeReportEventModelInstance = new TradeReportEventModel();

    return _tradeReportEventModelInstance;
}
