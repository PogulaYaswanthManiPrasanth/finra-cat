const { getTradeFileModelInstance  }        = require('./trade-file');

const { getTradeFileContentModelInstance }  = require('./trade-file-content');

const  { getTradeReportEventModelInstance }  = require('./trade-report-event');

const { getTradeEventModelInstance }         = require('./trade-event');

module.exports.getTradeFileModelInstance        =  getTradeFileModelInstance;

module.exports.getTradeFileContentModelInstance =  getTradeFileContentModelInstance;

module.exports.getTradeEventModelInstance         = getTradeEventModelInstance;

module.exports.getTradeReportEventModelInstance   = getTradeReportEventModelInstance;

