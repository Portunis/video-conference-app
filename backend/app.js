const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const { handleError } = require('./controllers/errorController');
const sequelize = require('./db/db');
const redisClient = require('./redis/redis');
const app = express();

const corsOptions = {
    // origin: 'https://portunis.pw',
    origin: ['https://localhost', 'capacitor://localhost', 'https://portunis.pw', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sessions', sessionRoutes);


sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Database sync error:', err);
    });

module.exports = app;
