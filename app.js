import express from "express";
import userRouter from './router/user_router.js'

const app = express();
const port = 80;

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});

app.use('/api', userRouter);