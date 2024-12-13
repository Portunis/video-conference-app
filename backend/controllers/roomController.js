const Room = require('../db/models/Room');
const User = require('../db/models/User');
const { getAndCreateIfNotExist } = require('../repository/roomUserRepository');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const RoomUser = require('../db/models/RoomUsers');
const { Op, Sequelize } = require('sequelize');

const createRoom = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('userRoom', req.user)
    const { roomName } = req.body;
    const { id } = req.user;

    try {
        const room = await Room.create({
            roomName,
            createdBy: id
        });

        await getAndCreateIfNotExist({
            userId: id,
            roomId: room.roomId
        })

        res.status(201).json({ roomId: room.roomId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getRoomInfo = async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findByPk(roomId, { include: User });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserRooms = async (req, res) => {
    const accessToken = req.cookies.access_token;

    console.log('accessToken', accessToken);

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token provided' });
    }
    const decoded = jwt.verify(accessToken, config.jwt.secret);
    console.log('decoded', decoded)

    const user = await User.findOne({ where: { userId: decoded.id } });

    console.log('user', user);

    try {
        const rooms = await Room.findAll({
            where: {
                roomId: {
                    [Sequelize.Op.in]: Sequelize.literal(`
                        (SELECT "roomId"
                            FROM "RoomUsers"
                            WHERE "userId" = '${user.dataValues.userId}')
                      `)
                }
            },
            include: [{
                model: User,
                through: { attributes: ['status', 'userId'] },
            }],
        });

        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createRoom, getRoomInfo, getUserRooms };
