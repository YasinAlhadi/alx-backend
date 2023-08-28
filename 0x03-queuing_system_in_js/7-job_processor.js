const kue = require('kue');

const queue = kue.createQueue();

const blockList = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
    if (blockList.includes(phoneNumber)) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    job.progress(0, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
}

queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});