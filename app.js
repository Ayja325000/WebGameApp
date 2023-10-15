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
const connections = new WeakSet();
wsServer.on('request', function (request) {
  // if (!originIsAllowed(request.origin)) {
  //   // Make sure we only accept requests from an allowed origin
  //   request.reject();
  //   console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
  //   return;
  // }
  try {
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + request.origin + ' Connection accepted.');
    connection.on('message', function (message) {
      console.log('Received Message Data: ' + JSON.stringify(message));
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
      } else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
      } else {
        console.log('Received Unknow Type Message: ' + JSON.stringify(message));
      }
    });
    connection.on('close', function (reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  } catch (e) {
    console.log('Error: ', e);
  }
})