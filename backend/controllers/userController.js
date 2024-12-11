const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validationResult } = require('express-validator');
const JWT_EXPIRATION = '15m';
const JWT_REFRESH_EXPIRATION = '7d';
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    try {

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }


        const newUser = await User.create({ username, password, email });

        const token = jwt.sign(
            { userId: newUser.userId },
            config.jwt.secret,
            { expiresIn: process.env.JWT_EXPIRATION }
        );


        res.status(201).json({ userId: newUser.userId, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }


        const accessToken = jwt.sign({ id: user.userId, email: user.email }, config.jwt.secret, {
            expiresIn: JWT_EXPIRATION
        });

        const refreshToken = jwt.sign({ id: user.userId, email: user.email }, config.jwt.secret, {
            expiresIn: JWT_REFRESH_EXPIRATION
        });

        await user.update({ refreshToken });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 60 min
            sameSite: 'strict',
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
            sameSite: 'strict',
        });
        res.json({ userId: user.userId, accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUser = async (req, res) => {
    const accessToken = req.cookies.access_token;

    console.log('accessToken', accessToken);

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token provided' });
    }

    try {
        const decoded = jwt.verify(accessToken, config.jwt.secret);
        const user = await User.findOne({ where: { userId: decoded.id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ userId: user.userId, username: user.username, email: user.email, token: accessToken });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid or expired access token' });
    }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {

        const decoded = jwt.verify(refreshToken, config.jwt.secret);
        const user = await User.findOne({ where: { userId: decoded.id } });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: user.userId, email: user.email }, config.jwt.secret, {
            expiresIn: JWT_EXPIRATION
        });

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            sameSite: 'strict',
        });

        res.json({ message: 'Access token refreshed' });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


module.exports = { registerUser, loginUser,refreshAccessToken, getUser };
