[Home](../README.md)
## Adept Paas Finra CAT Scheduler
### Overview

This service is responsible for submitting trade reports from Tuesday-Saturday. There is a cron service which is run on
backgroud to trigger a request to the submitter service.
# Folder Structure
  ```
  |-- etc
  |-- src
	|-- cat-report.scheduler
 ```
# Folder Details
## etc

This folder contains the configuration to run the scheduler
## src

This folder contains the source code to run

* cron

This service allows to run cron perodically to trigger the submission. This loops all the available domain in the config and connects the DB for any trade reports to needs submission. This uses the cron expression that is configured in the etc folder.

* report-scheduler

This service contians logic to send data to the submitter service. This gets triggered by the cron service with trade reports that need to submitted on the regular basis.
## Running the service

```node index.js```
## etc/config.json

For service configuration

* redis - This contains the configuration for redis
### cron

* schedule - This is cron expression to execute the scheduler

* mapping - domain : [entityId1, entityId2, entityIdN]

* timezone - timezone for scheduling the cron

* scheduled - to activate or deactivate

description - Human friendly description for the cron expression

```json
{
	"redis": {
		"retry": {
			"attempt": 100,
			"total_retry_time": 3600000
		},
		"url": "redis://xdata.dom1:6379/1"
	},
	"cron": {
		"schedule": "01 00 * * 2-6",
		"submission": {
			"SABBY:OATS": {
                "entityIds": ["WEDBUSH:WEDP"],
				"redis": {
					"queue": "finra-oats-submitter::packager::input"
				},
				"mongo": {
					"dbHost": "xdata.dom1",
					"dbPort": 27017,
					"dbName": "adept-wedb"
				}
			} ,
			"WEDBUSH:CAT": {
				"entityIds": ["WEDBUSH:WEDP"],
				"redis": {
					"queue": "finra-submitter::packager::input"
                },
				"mongo": {
					"dbHost": "xdata.dom1",
					"dbPort": 27017,
					"dbName": "adept-wedb"
				}
			}
		},
		"timezone": "America/New_York",
		"scheduled" : true,
		"description": "At 12:01 AM on every day-of-week from Tuesday through Saturday."
	}
}

```
