const RoomUser = require('../db/models/RoomUsers');
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

module.exports = { getAndCreateIfNotExist, setStatus };
