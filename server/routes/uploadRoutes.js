import express from 'express';
import { uploadFile, uploadMiddleware } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadMiddleware, uploadFile);

export default router;
