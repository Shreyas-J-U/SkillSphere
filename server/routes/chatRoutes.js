import express from "express";
import {
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  getUnreadCount,
} from "../controllers/chatController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", requireAuth, attachUser, getOrCreateChat);
router.get("/", requireAuth, attachUser, getUserChats);
router.get("/unread/count", requireAuth, attachUser, getUnreadCount);
router.get("/:id/messages", requireAuth, attachUser, getChatMessages);
router.post("/:id/messages", requireAuth, attachUser, sendMessage);

export default router;
