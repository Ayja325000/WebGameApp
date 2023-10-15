import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from './router/user_router.js';
// import cookieParser from "cookie-parser";
import { server as WebSocketServer } from 'websocket';
import http from 'http';

/////////////// API服务///////////////////////////////////////
const app = express();
const port = 80;
// 使用 body-parser 中间件来解析请求体
app.use(bodyParser.urlencoded({ extended: false })); // 解析 URL 编码的数据
app.use(bodyParser.json()); // 解析 JSON 格式的数据
app.use(cors()); // 解决跨域问题
// app.use(cookieParser()); // 处理cookie

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});

app.use('/api', userRouter);


////////////////// WebSocket服务 /////////////////////////////////////////

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8888, function () {
  console.log((new Date()) + ' Server is listening on port 8888');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

// WebSocket转发表，由http请求更改，定义成全局以便修改
global.WebSocketRetransmission = new Map();
global.WebSocketRetransmissionReverse = new Map();
const retransmission = global.WebSocketRetransmission;
const clients = new Map();
const clientsID = new Map();
wsServer.on('request', function (request) {
  // if (!originIsAllowed(request.origin)) {
  //   // Make sure we only accept requests from an allowed origin
  //   request.reject();
  //   console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
  //   return;
  // }
  try {
    const connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + request.origin + ' Connection accepted.');
    connection.on('message', function (message) {
      console.log('Received Message Data: ' + JSON.stringify(message));
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        let data = message.utf8Data;
        console.log('Retransmission Map:', Array.from(retransmission.entries()));
        try {
          data = JSON.parse(message.utf8Data);
          if (data.userId) {
            console.log('ClientID: ', data.userId);
            clients.set(data.userId, connection);
            clientsID.set(connection, data);
            console.log('clients', Array.from(clients.keys()));
          }
          console.log('To: ', retransmission.get(data.userId));
          (retransmission.get(data.userId) ?? []).forEach(toId => {
            const connect = clients.get(toId);
            if (connect) {
              connect.sendUTF(JSON.stringify(data));
            }
          })
        } catch (e) {
          console.warn('Error:', e);
        }
        // connection.sendUTF(JSON.stringify(data));
      } else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
      } else {
        console.log('Received Unknow Type Message: ' + JSON.stringify(message));
      }
    });
    connection.on('close', function (reasonCode, description) {
      clients.delete(clientsID.get(connection));
      clientsID.delete(connection);
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  } catch (e) {
    console.log('Error: ', e);
  }
})