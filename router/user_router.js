import express from "express";
import { getAllUser } from "../controller/user_ctrl.js";
import { login, visitorLogin } from "../controller/user/login.js";

const router = new express.Router();

// get
router.get('/user', getAllUser);

// post
router.post('/login', login);
router.post('/visitor-login', visitorLogin);

export default router;