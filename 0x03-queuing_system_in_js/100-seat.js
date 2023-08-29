const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');

const app = express();
const router = express.Router();
const port = 1245

const client = redis.createClient();
const queue = kue.createQueue();

const reservationEnabled = true;

function reserveSeat(number) {
    client.set(`available_seats`, number, (err, reply) => {
        redis.print(`Reply: ${reply}`);
    });
}

async function getCurrentAvailableSeats() {
    const getAsync = promisify(client.get).bind(client);
    const availableSeats = await getAsync(`available_seats`);
    return availableSeats;
}

app.get('/available_seats', async (req, res) => {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        res.json({ "status": "Reservation are blocked" });
        return;
    } else {
        const job = queue.create('reserve_seat', {}).save((err) => {
            if (!err) console.log({ "status": "Reservation in process" });
        });

        job.on('complete', () => {
            console.log(`Seat reservation job ${job.id} completed`);
        });

        job.on('failed', () => {
            console.log(`Seat reservation job ${job.id} failed: ${job.result}`);
        });
    }
});

app.get('/process', async (req, res) => {
    queue.process('reserve_seat', async (job, done) => {
        const availableSeats = await getCurrentAvailableSeats();
        if (availableSeats <= 0) {
            done(Error('No seats available'));
        } else {
            reserveSeat(availableSeats - 1);
            if (availableSeats - 1 === 0) reservationEnabled = false;
            done();
        }
    });
    res.json({ "status": "Queue processing" });
});

app.listen(port);
