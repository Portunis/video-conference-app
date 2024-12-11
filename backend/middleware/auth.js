const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User  = require('../db/models/User');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).json({message: 'Invalid token', token: null });
    }
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token', token: null });
    }
};

module.exports = { verifyToken };
