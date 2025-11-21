import express from 'express';
import { getUsers, getUserById, updateProfile, updateSkills } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.put('/skills', protect, updateSkills);

export default router;
