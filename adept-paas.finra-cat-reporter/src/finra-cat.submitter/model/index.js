const { getTradeFileModelInstance  }        = require('./trade-file');

const { getTradeFileContentModelInstance }  = require('./trade-file-content');

const { getTradeReportModelInstance }       = require('./trade-report');

module.exports.getTradeFileModelInstance        =  getTradeFileModelInstance;

module.exports.getTradeFileContentModelInstance =  getTradeFileContentModelInstance;

module.exports.getTradeReportModelInstance      =   getTradeReportModelInstance;
