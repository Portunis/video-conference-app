const { Server } = require('socket.io');
const io = new Server(3001, {
    cors: {
        // origin: 'https://portunis.pw',
        // origin: 'http://localhost:5173',
        origin: ['https://localhost', 'capacitor://localhost', 'https://portunis.pw','http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Выводим сообщение, что сервер успешно запущен
console.log('Socket.IO сервер успешно запущен на порту 3001');

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('joinRoom', (data) => {
//         if (!data || !data.roomId || !data.userId) {
//             console.error('Некорректные данные для joinRoom:', data);
//             return;
//         }
//         console.log(`${data.userId} присоединился в комнату ${data.roomId}`);
//         socket.join(data.roomId);
//         socket.to(data.roomId).emit('userJoined', { userId: data.userId, userName: data.username });
//     });

//     socket.on('offer', (data) => {
//         if (!data || !data.roomId || !data.userId || !data.offer) {
//             console.error('Некорректные данные для offer:', data);
//             return;
//         }
//         console.log(`Отправка предложения от ${data.userId} в комнату ${data.roomId}`);
//         socket.to(data.roomId).emit('offer', data);
//     });

//     socket.on('answer', (data) => {
//         if (!data || !data.roomId || !data.userId || !data.answer) {
//             console.error('Некорректные данные для answer:', data);
//             return;
//         }
//         console.log(`Отправка ответа от ${data.userId} в комнату ${data.roomId}`);
//         socket.to(data.roomId).emit('answer', data);
//     });

//     socket.on('iceCandidate', (data) => {
//         if (!data || !data.roomId || !data.candidate) {
//             console.error('Некорректные данные для iceCandidate:', data);
//             return;
//         }
//         console.log(`ICE кандидат от ${data.roomId}`);
//         socket.to(data.roomId).emit('iceCandidate', data);
//     });

//     socket.on('leaveRoom', (data) => {
//         if (!data || !data.roomId || !data.userId) {
//             console.error('Некорректные данные для leaveRoom:', data);
//             return;
//         }
//         console.log(`${data.userId} покинул комнату ${data.roomId}`);
//         socket.leave(data.roomId);
//         socket.to(data.roomId).emit('userLeft', { userId: data.userId });
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom2', (data) => {
        if (data.roomId) {
            socket.join(data.roomId)
            socket.userData = data
        }
    })

    socket.on('webrtcSend', (data) => {
        io.to(data.roomId).emit('webrtcRecieve', data)
	console.log('data socket connect', data)
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

    socket.on('disconnect', () => {
        if (socket.userData) {
            io.to(socket.userData.roomId).emit('userLeft', { userId: socket.userData.userId, userName: socket.userData.userName });
        }
        console.log('User disconnected:', socket.id);
    });
})