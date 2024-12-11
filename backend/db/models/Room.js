const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Room = sequelize.define('Room', {
    roomId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    roomName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId',
        },
    },
});

module.exports = Room;