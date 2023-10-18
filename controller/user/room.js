import redis from '../../db/redis.js';

const userJoinRoom = async (roomId, userId) => {
  const res = await redis.sAdd(roomId, userId);
  return res;
}
const userExitRoom = async (roomId, userId) => {
  let memberCnt = (await redis.sMembers(roomId)).length;
  if (memberCnt === 1) {
    const res = await redis.del(roomId);
    return res;
  } else {
    const res = await redis.sRem(roomId, userId);
    return res;
  }
}

export async function createRoom(req, res) {
  try {
    const reqBody = req.body;
    console.log(reqBody);
    const { userId, gameId } = reqBody;
    const roomId = 'room_' + gameId + '_' + Date.now().toString().slice(-8);
    await userJoinRoom(roomId, userId);
    res.send({
      status: 0,
      message: 'Create room success.',
      data: {
        roomId: roomId
      }
    })
  } catch (err) {
    console.log(err);
    res.send({
      state: -1,
      message: 'Unknow Error!',
      details: err
    })
  }
}
export async function searchRoom(req, res) {
  try {
    const reqBody = req.body;
    const { roomId } = reqBody;
    const roomMembers = await redis.sMembers(roomId);
    if (roomMembers.length === 0) {
      res.send({
        status: -1,
        message: 'This Room is not Exist.'
      })
    } else {
      res.send({
        status: 0,
        message: 'search room success.',
        data: {
          roomId: roomId,
          members: roomMembers,
          views: ['10005', '10006', '10007', '10008', '10009'],
          gameId: roomId.slice(5, -9) ?? ''
        }
      })
    }
  } catch (err) {
    console.log(err);
    res.send({
      state: -1,
      message: 'Unknow Error!',
      details: err
    })
  }
}
export async function joinRoom(req, res) {
  try {
    const reqBody = req.body;
    const { userId, roomId } = reqBody;
    await userJoinRoom(roomId, userId);
    const roomMembers = await redis.sMembers(roomId);
    res.send({
      status: 0,
      message: 'join room success.',
      data: {
        roomId: roomId,
        members: roomMembers
      }
    })
  } catch (err) {
    console.log(err);
    res.send({
      state: -1,
      message: 'Unknow Error!',
      details: err
    })
  }
}
export async function exitRoom(req, res) {
  try {
    const reqBody = req.body;
    const { userId, roomId } = reqBody;
    await userExitRoom(roomId, userId);
    res.send({
      status: 0,
      message: 'exit room success.',
      data: {
        roomId: roomId
      }
    })
  } catch (err) {
    console.log(err);
    res.send({
      state: -1,
      message: 'Unknow Error!',
      details: err
    })
  }
}