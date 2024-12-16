const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db');
const RoomUser = require('./RoomUsers');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

User.hasMany(RoomUser, {
    foreignKey: 'userId',
    as: 'roomUsers', // alias для обратной связи
});

RoomUser.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user', // alias для ассоциации
});

module.exports = User;