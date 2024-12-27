const { Server } = require('socket.io');
const { getAndCreateIfNotExist, setStatus, getRoomUsers, updateMediaEnabled } = require('../repository/roomUserRepository');
const users = {};
const initIo = () => {
    const io = new Server(3001, {
        cors: {
            // origin: 'https://portunis.pw',
            // origin: 'http://localhost:5173',
            origin: ['https://localhost', 'capacitor://localhost', 'https://portunis.pw','http://localhost:5173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    console.log('Socket.IO сервер успешно запущен на порту 3001');

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
    
        socket.on('joinRoom2', async (data) => {
            if (data.roomId) {
                users[socket.id] = data;
                console.log('user data', data)
                console.log('users', users);
                if (!data.isUserRoom && !data.isAdmin) {
                    console.log('Запрос на вход от:', data.userId)
                    const admins = Object.entries(users).filter(
                        ([, user]) => user.isAdmin && (data.roomId === user.roomId)
                    );
                    console.log('админы', admins)
                    admins.forEach(([adminSocketId]) => {
                        if (io.sockets.sockets.get(adminSocketId)) {
                            console.log('Socket ушел на запрос')
                            io.to(adminSocketId).emit("requestJoin", { userId: data.userId, userName: data.userName });
                        } else {
                            console.warn(`Сокет с ID ${adminSocketId} недоступен.`);
                        }
                    });
                    return
                }


                socket.userData = data
                const roomUser = await getAndCreateIfNotExist({ roomId: data.roomId, userId: data.userId })
                socket.userData.roomUserId = roomUser.roomUserId
                await setStatus({ roomUserId: roomUser.roomUserId, status: 'online' })
                socket.join(data.roomId)

                const roomUsers = await getRoomUsers({ roomId: data.roomId })
                io.to(data.roomId).emit('users', { users: roomUsers })

                socket.on('webrtcSend', (data) => {
                    io.to(data.roomId).emit('webrtcRecieve', data)
                    console.log('data socket connect', data)
                })
            }
        })


        socket.on('leaveRoom', (data) => {
            if (!data || !data.roomId || !data.userId) {
                console.error('Некорректные данные для leaveRoom:', data);
                return;
            }
            console.log(`${data.userId} покинул комнату ${data.roomId}`);
            socket.leave(data.roomId);
            socket.to(data.roomId).emit('userLeft', { userId: data.userId, userName: data.username });
        });

        socket.on('sendToggleMedia', async ({ roomId, userId, isEnabled, kind }) => {
            const isSuccess = await updateMediaEnabled({ roomId, userId, isEnabled, kind })
            if (isSuccess) {
                const roomUsers = await getRoomUsers({ roomId: socket.userData.roomId })
                io.to(socket.userData.roomId).emit('users', { users: roomUsers })
            }
        })
    
        socket.on('disconnect', async () => {
            if (socket.userData) {
                await setStatus({ roomUserId: socket.userData.roomUserId, status: 'offline' })
                
                await Promise.all([
                    updateMediaEnabled({ roomId: socket.userData.roomId, userId: socket.userData.userId, isEnabled: true, kind: 'audio' }),
                    updateMediaEnabled({ roomId: socket.userData.roomId, userId: socket.userData.userId, isEnabled: true, kind: 'video' })
                ])

                io.to(socket.userData.roomId).emit('userLeft', { userId: socket.userData.userId, userName: socket.userData.userName });
                const roomUsers = await getRoomUsers({ roomId: socket.userData.roomId })
                io.to(socket.userData.roomId).emit('users', { users: roomUsers })
                delete users[socket.id]
            }
            console.log('User disconnected:', socket.id);
        });
        socket.on("approveJoin", ({ roomId, userId, userName, isApprove }) => {
            if (!roomId || !userId || !userName) {
                console.error("Некорректные данные: roomId, userId или userName отсутствуют. approve");
                return;
            }

            if (!users || typeof users !== "object") {
                console.error("Объект users отсутствует или некорректен.");
                return;
            }

            const user = Object.entries(users).filter(
                ([, user]) => user.roomId === roomId && user.userId === userId
            );

            user.forEach(([userSocketId]) => {
                if (io.sockets.sockets.get(userSocketId)) {
                    io.to(userSocketId).emit("joinApproved", { roomId, isApprove});
                } else {
                    console.warn(`Сокет с ID ${userSocketId} недоступен.`);
                }
            });
        });
        socket.on("audioDetect", ({ roomId, userId, isSpeaking }) => {
           socket.broadcast.emit('userSpeak', { roomId, userId, isSpeaking });
        });
    })
}

module.exports = { initIo }