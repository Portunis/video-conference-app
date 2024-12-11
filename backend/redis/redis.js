const { createClient } = require('redis');
const config = require('../config/config');

const redisClient = createClient({
    socket: {
        host: config.redis.host,
        port: config.redis.port,
    },
});


redisClient.connect()
    .then(() => {
        console.log('Redis connected successfully');
    })
    .catch((err) => {
        console.error('Redis connection error:', err);
        process.exit(1);
    });

redisClient.ping()
    .then(() => {
        console.log('Redis ping successful');
    })
    .catch((err) => {
        console.error('Redis ping failed:', err);
    });

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
module.exports = redisClient;
