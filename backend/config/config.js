require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'your_password',
        database: process.env.DB_NAME || 'video_conference',
        port: process.env.DB_PORT || 5432,
    },
    redis: {
        host: process.env.REDIS_HOST || '192.168.0.28',
        port: process.env.REDIS_PORT || 6379,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiration: process.env.JWT_EXPIRATION || '3600s',
    },
    server: {
        port: process.env.SERVER_PORT || 3000,
    },
};

module.exports = config;
