const { ReportSubmitterService }        = require('./cat-report.submitter');

var __theModule__ = undefined;

exports.getInstance = function () {

  return (__theModule__ ? __theModule__ : (__theModule__ = new ReportSubmitterService()));

};
