
const { DBUpdater }               = require('./db-updater');

var __theModule__ = undefined;

exports.getInstance = function () {

  return (__theModule__ ? __theModule__ : (__theModule__ = new DBUpdater()));

};
