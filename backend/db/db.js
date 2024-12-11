const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        dialect: 'postgres',
        port: config.db.port,
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('PostgreSQL connected successfully');
    })
    .catch((error) => {
        console.error('Unable to connect to the PostgreSQL database:', error);
    });

module.exports = sequelize;
