// const { Server } = require('socket.io');
// const { getAndCreateIfNotExist, setStatus, getRoomUsers } = require('../repository/roomUserRepository');
// const users = {};
// const initIo = () => {
//     const io = new Server(3001, {
//         cors: {
//             // origin: 'https://portunis.pw',
//             // origin: 'http://localhost:5173',
//             origin: ['https://localhost', 'capacitor://localhost', 'https://portunis.pw','http://localhost:5173'],
//             methods: ['GET', 'POST'],
//             credentials: true,
//         },
//     });
//
//
//     // Выводим сообщение, что сервер успешно запущен
//     console.log('Socket.IO сервер успешно запущен на порту 3001');
//
//     // io.on('connection', (socket) => {
//     //     console.log('User connected:', socket.id);
//
//     //     socket.on('joinRoom', (data) => {
//     //         if (!data || !data.roomId || !data.userId) {
//     //             console.error('Некорректные данные для joinRoom:', data);
//     //             return;
//     //         }
//     //         console.log(`${data.userId} присоединился в комнату ${data.roomId}`);
//     //         socket.join(data.roomId);
//     //         socket.to(data.roomId).emit('userJoined', { userId: data.userId, userName: data.username });
//     //     });
//
//     //     socket.on('offer', (data) => {
//     //         if (!data || !data.roomId || !data.userId || !data.offer) {
//     //             console.error('Некорректные данные для offer:', data);
//     //             return;
//     //         }
//     //         console.log(`Отправка предложения от ${data.userId} в комнату ${data.roomId}`);
//     //         socket.to(data.roomId).emit('offer', data);
//     //     });
//
//     //     socket.on('answer', (data) => {
//     //         if (!data || !data.roomId || !data.userId || !data.answer) {
//     //             console.error('Некорректные данные для answer:', data);
//     //             return;
//     //         }
//     //         console.log(`Отправка ответа от ${data.userId} в комнату ${data.roomId}`);
//     //         socket.to(data.roomId).emit('answer', data);
//     //     });
//
//     //     socket.on('iceCandidate', (data) => {
//     //         if (!data || !data.roomId || !data.candidate) {
//     //             console.error('Некорректные данные для iceCandidate:', data);
//     //             return;
//     //         }
//     //         console.log(`ICE кандидат от ${data.roomId}`);
//     //         socket.to(data.roomId).emit('iceCandidate', data);
//     //     });
//
//     //     socket.on('leaveRoom', (data) => {
//     //         if (!data || !data.roomId || !data.userId) {
//     //             console.error('Некорректные данные для leaveRoom:', data);
//     //             return;
//     //         }
//     //         console.log(`${data.userId} покинул комнату ${data.roomId}`);
//     //         socket.leave(data.roomId);
//     //         socket.to(data.roomId).emit('userLeft', { userId: data.userId });
//     //     });
//
//     //     socket.on('disconnect', () => {
//     //         console.log('User disconnected:', socket.id);
//     //     });
//     // });
//
//
//     io.on('connection', (socket) => {
//         console.log('User connected:', socket.id);
//
//         socket.on('joinRoom2', async (data) => {
//             if (data.roomId) {
//                 users[socket.id] = data;
//                 if (!data.isAdmin || !data.isUserRoom) {
//                     const admins = Object.entries(users).filter(
//                         ([, user]) => user.isAdmin
//                     );
//
//                     admins.forEach(([adminSocketId]) => {
//                         if (io.sockets.sockets.get(adminSocketId)) {
//                             io.to(adminSocketId).emit("requestJoin", { userId: data.userId, userName: data.userName });
//                         } else {
//                             console.warn(`Сокет с ID ${adminSocketId} недоступен.`);
//                         }
//                     });
//                     return
//                 }
//
//
//                 socket.join(data.roomId)
//                 socket.userData = data
//                 const roomUser = await getAndCreateIfNotExist({ roomId: data.roomId, userId: data.userId })
//                 socket.userData.roomUserId = roomUser.roomUserId
//                 await setStatus({ roomUserId: roomUser.roomUserId, status: 'online' })
//
//                 const roomUsers = await getRoomUsers({ roomId: data.roomId })
//                 io.to(data.roomId).emit('users', { users: roomUsers })
//             }
//         })
//
//         socket.on('webrtcSend', (data) => {
//             io.to(data.roomId).emit('webrtcRecieve', data)
//             console.log('data socket connect', data)
//         })
//
//         socket.on('leaveRoom', (data) => {
//             if (!data || !data.roomId || !data.userId) {
//                 console.error('Некорректные данные для leaveRoom:', data);
//                 return;
//             }
//             console.log(`${data.userId} покинул комнату ${data.roomId}`);
//             socket.leave(data.roomId);
//             socket.to(data.roomId).emit('userLeft', { userId: data.userId, userName: data.username });
//         });
//
//         socket.on('disconnect', async () => {
//             if (socket.userData) {
//                 await setStatus({ roomUserId: socket.userData.roomUserId, status: 'offline' })
//                 io.to(socket.userData.roomId).emit('userLeft', { userId: socket.userData.userId, userName: socket.userData.userName });
//
//                 const roomUsers = await getRoomUsers({ roomId: socket.userData.roomId })
//                 io.to(socket.userData.roomId).emit('users', { users: roomUsers })
//             }
//             console.log('User disconnected:', socket.id);
//         });
//         socket.on("approveJoin", ({ roomId, userId, userName }) => {
//             if (!roomId || !userId || !userName) {
//                 console.error("Некорректные данные: roomId, userId или userName отсутствуют.");
//                 return;
//             }
//
//             if (!users || typeof users !== "object") {
//                 console.error("Объект users отсутствует или некорректен.");
//                 return;
//             }
//
//             const user = Object.entries(users).filter(
//                 ([, user]) => user.roomId === roomId && user.userId === userId
//             );
//
//             if (user.length === 0) {
//                 console.warn(`Нет юзера в комнате ${roomId}`);
//                 return;
//             }
//
//             user.forEach(([userSocketId]) => {
//                 if (io.sockets.sockets.get(userSocketId)) {
//                     io.to(userSocketId).emit("joinApproved", { roomId, });
//                 } else {
//                     console.warn(`Сокет с ID ${userSocketId} недоступен.`);
//                 }
//             });
//         });
//     })
// }
//
// module.exports = { initIo }