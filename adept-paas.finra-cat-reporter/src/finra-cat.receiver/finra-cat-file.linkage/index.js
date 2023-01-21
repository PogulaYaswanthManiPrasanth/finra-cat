const { FileLinkageService }        = require('./finra-cat.file.linkage');

var __theModule__ = undefined;

exports.getInstance = function () {

  return (__theModule__ ? __theModule__ : (__theModule__ = new FileLinkageService()));

};
