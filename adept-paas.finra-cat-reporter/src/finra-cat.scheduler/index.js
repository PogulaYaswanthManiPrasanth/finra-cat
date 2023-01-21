
const { ServiceModuleController }       = require('service.module.core');

const { MainProcess,
        ChildProcessControllerModule }  = require('service.core');

var cat_scheduler_module = new ChildProcessControllerModule({
  processName: 'CATSchedulerController',
  childModule: 'cat-report-scheduler',
  childModulePaths: './src/finra-cat.scheduler/',
  configRequired: true,
  configFilename: 'cat.scheduler.config.json',
  lifecycleTimeout: 5000,
  loggerDomain: `CATSchedulerController`,
  logSeverity: 'DEBUG'
});

let serviceModController = new ServiceModuleController(`CAT Report Scheduler`, "1.0.0", { loadSerially: true });

serviceModController.register(cat_scheduler_module);

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


