const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

async function setNewSchool(schoolName, value) {
    await client.set(schoolName, value, (err, reply) => {
        redis.print(`Reply: ${reply}`);
    });
}

async function displaySchoolValue(schoolName) {
    await client.get(schoolName, (err, reply) => {
        console.log(reply);
    });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');