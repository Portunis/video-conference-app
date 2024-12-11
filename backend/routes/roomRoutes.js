// routes/roomRoutes.js
const express = require('express');
const { createRoom, getRoomInfo, getUserRooms } = require('../controllers/roomController');
const { verifyToken } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

router.post(
    '/createRoom',
    verifyToken,
    [body('roomName').not().isEmpty()],
    createRoom
);


router.get('/:roomId', getRoomInfo);


router.get('/', verifyToken, getUserRooms);

module.exports = router;
