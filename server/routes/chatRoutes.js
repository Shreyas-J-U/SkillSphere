import express from 'express';
import { getOrCreateChat, getUserChats, getChatMessages, sendMessage, getUnreadCount } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, getOrCreateChat);
router.get('/', protect, getUserChats);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:id/messages', protect, getChatMessages);
router.post('/:id/messages', protect, sendMessage);

export default router;
