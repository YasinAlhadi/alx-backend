const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');
const { expect } = require('chai');

const queue = kue.createQueue();

before(() => queue.testMode.enter());

describe('createPushNotificationsJobs', () => {
    it('display an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs('jobs', queue)).to.throw(Error, 'Jobs is not an array');
    });

    it('create two new jobs to the queue', () => {
        createPushNotificationsJobs([
            {
                phoneNumber: '4153518780',
                message: 'This is the code 1234 to verify your account'
            },
            {
                phoneNumber: '4153518781',
                message: 'This is the code 4562 to verify your account'
            }
        ], queue);

        expect(queue.testMode.jobs.length).to.equal(2);
        expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
        expect(queue.testMode.jobs[0].data).to.eql({
            phoneNumber: '4153518780',
            message: 'This is the code 1234 to verify your account'
        });
        expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
        expect(queue.testMode.jobs[1].data).to.eql({
            phoneNumber: '4153518781',
            message: 'This is the code 4562 to verify your account'
        });
    });
});

afterEach(() => queue.testMode.clear());

after(() => queue.testMode.exit());