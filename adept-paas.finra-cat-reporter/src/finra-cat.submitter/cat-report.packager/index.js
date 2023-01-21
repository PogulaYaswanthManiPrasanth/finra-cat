
const { ReportGenerator }               = require('./report-packager');

var __theModule__ = undefined;

exports.getInstance = function () {

  return (__theModule__ ? __theModule__ : (__theModule__ = new ReportGenerator()));

};
