const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RoomUser = sequelize.define('RoomUser', {
    roomUserId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // название таблицы, связанной с userId
            key: 'userId',
        },
    },
    roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Rooms', // название таблицы, связанной с roomId
            key: 'roomId',
        },
    },
    status: {
        type: DataTypes.ENUM('online', 'offline'), // статус: online или offline
        allowNull: false,
        defaultValue: 'offline'
    },
    isUserNotAuth: {
        type: DataTypes.BOOLEAN, // булевый флаг для проверки авторизации
        allowNull: false,
        defaultValue: false, // можно задать стандартное значение
    },
    notAuthUserName: {
        type: DataTypes.STRING(255), // имя неавторизованного пользователя
        allowNull: true, // может быть null, если пользователь авторизован
    },
});

module.exports = RoomUser;
