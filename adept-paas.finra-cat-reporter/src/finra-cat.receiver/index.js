
const { ServiceModuleController }       = require('service.module.core');

const { MainProcess,
        ChildProcessControllerModule }  = require('service.core');


var cat_tradeevent_error_controller_mod = new ChildProcessControllerModule({
  processName: 'CATTradeEventErrorController',
  childModule: 'cat-trade-event.errors',
  childModulePaths: './src/finra-cat.receiver/',
  configRequired: true,
  configFilename: 'cat.receiver.config.json',
  lifecycleTimeout: 5000,
  loggerDomain: `CATTradeEventErrorController`,
  logSeverity: 'DEBUG'
});

var cat_file_storage_mod = new ChildProcessControllerModule({
  processName: 'CATFileLinkageController',
  childModule: 'finra-cat-file.linkage',
  childModulePaths: './src/finra-cat.receiver/',
  configRequired: true,
  configFilename: 'cat.receiver.config.json',
  lifecycleTimeout: 5000,
  loggerDomain: `CATFileLinkageController`,
  logSeverity: 'DEBUG'
});

let serviceModController = new ServiceModuleController(`CAT Report Receiver`, "1.0.0", { loadSerially: true });

serviceModController.register(cat_tradeevent_error_controller_mod);

serviceModController.register(cat_file_storage_mod);

var _opts = {
  enableKeyboard: true,
  configRequired: false,
  enablePidfile: false,
  isDevelopment: false,
  pidfileOverwrite: false,
  mainModule: serviceModController
};

const main = MainProcess.create(_opts);

main.start();


