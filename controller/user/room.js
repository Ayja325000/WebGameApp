import redis from '../../db/redis.js';

const userJoinRoom = async (roomId, user) => {
  const currentRoomId = await redis.get(`${user}:roomId`);
  if (currentRoomId) {
    await redis.sRem(currentRoomId, user);
  }
  redis.set(`${user}:roomId`, roomId);
  const res = await redis.sAdd(roomId, user);
  return res;
}
const userExitRoom = async (roomId, user) => {
  let memberCnt = (await redis.sMembers(roomId)).length;
  if (memberCnt === 1) {
    const res = await redis.del(roomId);
    return res;
  } else {
    const res = await redis.sRem(roomId, user);
    return res;
  }
}

export async function createRoom(req, res) {
  try {
    const reqBody = req.body;
    console.log(reqBody);
    const { user, gameId } = reqBody;
    const roomId = 'room_' + gameId + '_' + Date.now().toString().slice(-8);
    await userJoinRoom(roomId, user);
    await redis.set(`${roomId}:creater`, user);
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
    const roomMembers = (await redis.sMembers(roomId)).map(val => JSON.parse(val));
    const creater = await redis.get(`${roomId}:creater`);
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
          views: [],
          gameId: roomId.slice(5, -9) ?? '',
          creater: creater
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
    const { user, roomId } = reqBody;
    await userJoinRoom(roomId, user);
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
    const { user, roomId } = reqBody;
    await userExitRoom(roomId, user);
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