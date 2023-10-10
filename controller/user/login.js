import db from "../../db/index.js";

export async function login(req, res) {
  try {
    const reqBody = req.body;
    const { username, password } = reqBody;
    console.log('reqBody', reqBody);
    const [result] = await db.query(`select uid, nickname, username from user where username = "${username}" and password = "${password}"`);
    console.log(result);
    if (result.length !== 0) {
      res.send({
        status: 0,
        message: 'Login success.',
        data: result[0]
      })
    } else {
      res.send({
        status: 1,
        message: 'Incorrect Username or password.'
      })
    }
  } catch (err) {
    res.send({
      state: -1,
      message: 'Unknow Error! Login failed.',
      details: err
    })
  }
}

export async function visitorLogin(req, res) {
  try {
    const reqBody = req.body;
    const { nickname } = reqBody;
    console.log('reqBody', reqBody);
    // console.log(result);
    if (!nickname) {
      res.send({
        status: 1,
        message: 'No name error.'
      })
    } else {
      res.send({
        status: 0,
        message: 'Login success.',
        data: {
          visitorId: nickname + Date.now().toString()
        }
      })
    }
  } catch (err) {
    res.send({
      state: -1,
      message: 'Login failed.',
      details: err
    })
  }
}