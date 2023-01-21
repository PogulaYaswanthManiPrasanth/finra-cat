
const { ServiceModuleController }       = require('service.module.core');

const { MainProcess,
        ChildProcessControllerModule }  = require('service.core');

var cat_report_packager_mod = new ChildProcessControllerModule({
  processName: 'CATReportPackagerController',
  childModule: 'cat-report.packager',
  childModulePaths: './src/finra-cat.submitter/',
  configRequired: true,
  configFilename: 'cat.submitter.config.json',
  lifecycleTimeout: 5000,
  loggerDomain: `CATReportPackagerController`,
  logSeverity: 'DEBUG'
});

var cat_submitter_controller_mod = new ChildProcessControllerModule({
  processName: 'CATSubmitterController',
  childModule: 'cat-report.submitter',
  childModulePaths: './src/finra-cat.submitter/',
  configRequired: true,
  configFilename: 'cat.submitter.config.json',
  lifecycleTimeout: 5000,
  loggerDomain: `CATSubmitterController`,
  logSeverity: 'DEBUG'
});

var cat_dbupdater_controller_mod = new ChildProcessControllerModule({
  processName: 'CATDBUpdaterController',
  childModule: 'cat-report.db.updater',
  childModulePaths: './src/finra-cat.submitter/',
  configRequired: true,
  configFilename: 'cat.submitter.config.json',
  lifecycleTimeout: 5000,
  loggerDomain: `CATDBUpdaterController`,
  logSeverity: 'DEBUG'
});

let serviceModController = new ServiceModuleController(`CAT Report Submitter`, "1.0.0", { loadSerially: true });

serviceModController.register(cat_report_packager_mod);

serviceModController.register(cat_submitter_controller_mod);

serviceModController.register(cat_dbupdater_controller_mod);

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


