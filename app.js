import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from './router/user_router.js';

const app = express();
const port = 80;
// 使用 body-parser 中间件来解析请求体
app.use(bodyParser.urlencoded({ extended: false })); // 解析 URL 编码的数据
app.use(bodyParser.json()); // 解析 JSON 格式的数据
app.use(cors()); // 解决跨域问题

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});

app.use('/api', userRouter);