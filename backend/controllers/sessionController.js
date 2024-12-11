const Session = require('../db/models/Session');
const Room = require('../db/models/Room');
const User = require('../db/models/User');


const createSession = async (req, res) => {
    const { roomId, userId } = req.body;

    try {
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const session = await Session.create({ roomId, userId });

        res.status(201).json({ sessionId: session.sessionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getRoomSessions = async (req, res) => {
    const { roomId } = req.params;

    try {
        const sessions = await Session.findAll({ where: { roomId } });
        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createSession, getRoomSessions };
