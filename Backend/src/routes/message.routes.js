import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getAllUserList, getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users",protectRoute,getAllUserList)
router.get("/:id",protectRoute,getMessage)

router.post("/send/:id",protectRoute,sendMessage)

export default router;