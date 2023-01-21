# The Adept(tm) FINRA CAT Reporter Workflow

This workflow consolidates the submitter, receiver and scheduler into a single manageable service. This is designed to run on AWS to submit report to FINRA and receive feedback.

## Deploying the Reporter

To connect POC/TEST machine use: centos@ec2-23-20-42-135.compute-1.amazonaws.com

To connect PROD machine use: centos@ec2-3-87-113-169.compute-1.amazonaws.com

* cd /usr/local/bin/adept
* git clone git@gitlab.xinthesys.org:adept/adept-paas/adept-paas.workflows/adept-pass.cat/adept-paas.finra-cat-reporter.git
* Checkout respective branch qa/prod
* npm install

### Deploying scheduler 

* pm2 start pm2.cat.scheduler.json

### Deploying Receiver

* pm2 start pm2.cat.receiver.json

### Deploying Submitter

* pm2 start pm2.cat.submitter.json

## Running the reporter services

#### Pre-requisites

Ensure pm2 service is installed in the machine. if not installed then install it by running ```npm install pm2 -g```

### Running scheduler 

   ```pm2 start pm2.cat.scheduler.json```
### Running Receiver

   ```pm2 start pm2.cat.receiver.json```

### Running Submitter

   ```pm2 start pm2.cat.submitter.json```
   
## Redeploying after modifications

### Redeploying scheduler

* Take pull
* pm2 restart <serviceID>

### Redeploying Submitter and Receiver

* Take pull
* pm2 restart <serviceID>

# Reporter Design Documentation
For more details on each service refer the below section.
### Submitter Service

The Adept FINRA CAT Submitter service responsibility is to package and submit trade report events into FINRA.

[Submitter workflow in detail](docs/cat.submitter.workflow.md)
## Receiver Service

The Adept FINRA CAT Receiver service responsibility is to watch feedback files sent by FINRA.

[Receiver workflow in detail](docs/cat.receiver.workflow.md)
## Scheduler Service

The Adept FINRA CAT Scheduler service responsibility is to trigger submission reports on daily basis.

[Scheduler service in detail](docs/cat.scheduler.workflow.md)


## Reports archiver Script

The reports archiver script responsibility is to create empty json files for sftp clients if it's not available and copy .bz2 files for finra clients if it's available.

[Reports archiver script in detail](docs/reports-archiver.script.md)

