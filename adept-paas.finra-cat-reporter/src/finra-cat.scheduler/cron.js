const cron                              = require('node-cron');

const mongodb                           = require('mongodb');


module.exports = (config, emitter) => {

    return {

        startCron: () => {

            cron.schedule(config.schedule, async () => {

                let date = new Date();

                // date.setDate(date.getDate() - 1)
                
                let domains = Object.keys(config.submission);

                for await (const domain of domains) {

                    let entityIds = config.submission[domain].entityIds;

                    for await (const entityId of entityIds) {

                        let nsArr = domain.split(':');

                        const client = new mongodb.MongoClient(`mongodb://${config.submission[domain].mongo.dbHost}:${config.submission[domain].mongo.dbPort}`);

                        client.connect(async (error) => {

                            if (!error) {
                                
                                const db = client.db(`${config.submission[domain].mongo.dbName}`);

                                let submissionDate = new Date(date).toISOString().split('T')[0];

                                let docs = await db.collection('trade-report').find({ entity_id: entityId,scheduled_submission_dt: { $gte : new Date(`${submissionDate}T00:00:00.000Z`), $lte : new Date(`${submissionDate}T23:59:59.000Z`)} , ns: nsArr[1], sealed: false })

                                let tradeReportDocs = await docs.toArray()

                                for await (const docs of tradeReportDocs) {

                                    emitter.emit('cron-schedule', { domain: nsArr[0], redisQueue: config.submission[domain].redis.queue, reportId: docs._id });

                                }


                            }
                            client.close();
                        })


                    }


                }

            }, {
                //timezone: "config.timezone", 
                //scheduled: config.scheduled
            });
        }
    }
}