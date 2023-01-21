const { TradeEventErrorService }        = require('./cat-trade-event.errors');

var __theModule__ = undefined;

exports.getInstance = function () {

  return (__theModule__ ? __theModule__ : (__theModule__ = new TradeEventErrorService()));

};
