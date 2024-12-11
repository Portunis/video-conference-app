const express = require('express');
const { createSession, getRoomSessions } = require('../controllers/sessionController');
const { verifyToken } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();


router.post('/', verifyToken, [body('roomId').not().isEmpty(), body('userId').not().isEmpty()], createSession);


router.get('/:roomId', getRoomSessions);

module.exports = router;
