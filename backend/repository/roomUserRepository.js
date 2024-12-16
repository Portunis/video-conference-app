const RoomUser = require('../db/models/RoomUsers');
const User = require('../db/models/User');
// const Room = require('../db/models/Room');
// const User = require('../db/models/User');


const getAndCreateIfNotExist = async ({ roomId, userId }) => {
    console.log('RoomUser', RoomUser, Object.keys(RoomUser))
    try {
        const existingRoomUser = await RoomUser.findOne({
            where: {
                roomId,
                userId
            }
        })

        console.log('existingRoomUser', existingRoomUser)

        if (existingRoomUser) {
            return existingRoomUser
        }
        
        const createdRoomUser = await RoomUser.create({
            roomId,
            userId,
        })

        console.log('createdRoomUser', createdRoomUser)

        return createdRoomUser
    } catch (err) {
        console.error('getAndCreateIfNotExist', err);
    }
};

const setStatus = async ({ roomUserId, status }) => {
    try {
       const [updatedRowsCount] = await RoomUser.update({
            status
       },
       {
            where: {
                roomUserId
            }
       })

       return !!updatedRowsCount
    } catch (e) {
        console.error('setStatus', e)
    }
}

const getRoomUsers = async ({ roomId }) => {
    try {
        const roomUsers = await RoomUser.findAll({
            where: {
                roomId: roomId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'username', 'email'], // поля, которые вы хотите получить
                }
            ]
        });
        console.log('room users', roomUsers)
        return roomUsers;
    } catch (e) {
        console.error('getRoomUsers', e)
    }
}

module.exports = { getAndCreateIfNotExist, setStatus, getRoomUsers };
