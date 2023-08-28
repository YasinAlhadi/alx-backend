const kue = require('kue');

const queue = kue.createQueue();

const job = queue.create('push_notification_code', {
    phoneNumber: String,
    message: String,
}).save((err) => {
    if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => {
    console.log('Notification job completed');
});

job.on('failed', () => {
    console.log('Notification job failed');
});
