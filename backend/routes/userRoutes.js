const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser,refreshAccessToken, getUser} = require('../controllers/userController');
const {verifyToken} = require("../middleware/auth");
const router = express.Router();

router.post(
    '/register',
    [
        body('username').not().isEmpty(),
        body('password').isLength({ min: 6 }),
        body('email').isEmail(),
    ],
    registerUser
);

router.post(
    '/login',
    [
        body('username').not().isEmpty(),
        body('password').isLength({ min: 6 }),
    ],
    loginUser
);
router.get('/get-user',verifyToken, getUser)
router.post('/refresh-token', refreshAccessToken);
module.exports = router;
