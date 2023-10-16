import express from "express";
import { getAllUser } from "../controller/user_ctrl.js";
import { login, visitorLogin } from "../controller/user/login.js";
import { websocketConnect } from "../controller/user/websocketConnect.js"
import { createRoom, exitRoom, joinRoom, searchRoom } from "../controller/user/room.js";

const router = new express.Router();

// user get apis
router.get('/user', getAllUser);

// login apis
router.post('/login', login);
router.post('/visitor-login', visitorLogin);

// websocket apis
router.post('/ws-connect', websocketConnect);

// room apis
router.post('/create-room', createRoom);
router.post('/search-room', searchRoom);
router.post('/join-room', joinRoom);
router.post('/exit-room', exitRoom);

export default router;