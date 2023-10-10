import db from "../db/index.js";

export async function getAllUser(req, res) {
  try {
    const [result] = await db.query('select uid, username, nickname from user');
    // console.log(result);
    res.send({
      status: 0,
      message: 'Get user list success.',
      data: result
    })
  } catch (err) {
    res.send({
      state: -1,
      message: 'Get user list failed.',
      details: err
    })
  }
}