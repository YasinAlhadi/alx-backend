const kue = require('kue');

const queue = kue.createQueue();

function createPushNotificationsJobs(jobs, queue) {
    if (!(jobs instanceof Array)) throw Error('Jobs is not an array');

    for (const job of jobs) {
        const jobCreated = queue.create('push_notification_code_3', job).save((err) => {
            if (!err) console.log(`Notification job created: ${jobCreated.id}`);
        });

        jobCreated.on('complete', () => {
            console.log(`Notification job ${jobCreated.id} completed`);
        });

        jobCreated.on('failed', (err) => {
            console.log(`Notification job ${jobCreated.id} failed: ${err}`);
        });

        jobCreated.on('progress', (progress) => {
            console.log(`Notification job ${jobCreated.id} ${progress}% complete`);
        });
    }
}

module.exports = createPushNotificationsJobs;