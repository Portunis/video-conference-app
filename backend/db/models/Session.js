const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Session = sequelize.define('Session', {
    sessionId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    roomId: {
        type: DataTypes.UUID,
        references: {
            model: 'Rooms',
            key: 'roomId',
        },
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'userId',
        },
    },
});

module.exports = Session;