const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const RoomUser = require('./RoomUsers');

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

// Устанавливаем ассоциацию между Room и User через RoomUser
Room.belongsToMany(User, {
    through: 'RoomUsers',  // Промежуточная таблица
    foreignKey: 'roomId', // Имя столбца в RoomUser, ссылающееся на Room
    otherKey: 'userId',   // Имя столбца в RoomUser, ссылающееся на User
});
// Устанавливаем ассоциацию между User и Room через RoomUser
User.belongsToMany(Room, {
    through: 'RoomUsers',  // Промежуточная таблица
    foreignKey: 'userId', // Имя столбца в RoomUser, ссылающееся на User
    otherKey: 'roomId',   // Имя столбца в RoomUser, ссылающееся на Room
});

module.exports = Room;