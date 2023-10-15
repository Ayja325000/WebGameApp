export async function websocketConnect(req, res) {
  try {
    const reqBody = req.body;
    const { userId, to, from } = reqBody;
    const map = global.WebSocketRetransmission;
    const mapR = global.WebSocketRetransmissionReverse;
    to.forEach(toId => {
      if (map.has(userId)) {
        map.get(userId).add(toId);
      } else {
        const set = new Set();
        set.add(toId);
        map.set(userId, set);
      }
      if (mapR.has(toId)) {
        mapR.get(toId).add(userId);
      } else {
        const set = new Set();
        set.add(userId);
        mapR.set(toId, set);
      }
    });
    from.forEach(fromId => {
      if (map.has(fromId)) {
        map.get(fromId).add(userId);
      } else {
        const set = new Set();
        set.add(userId);
        map.set(fromId, set);
      }
      if (mapR.has(userId)) {
        mapR.get(userId).add(fromId);
      } else {
        const set = new Set();
        set.add(fromId);
        mapR.set(userId, set);
      }
    });
    console.log(Array.from(map.entries()));
    res.send({
      status: 0,
      message: 'Websocket connect success.'
    })
  } catch (err) {
    res.send({
      state: -1,
      message: 'Unknow Error!Connect failed.',
      details: err
    })
  }
}