import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  submitRating,
  getUserRatings,
  getBarterRatings,
  canRateBarter
} from '../controllers/ratingController.js';

const router = express.Router();

// Submit a rating (protected)
router.post('/', protect, submitRating);

// Get ratings for a specific user (public)
router.get('/user/:userId', getUserRatings);

// Get ratings for a specific barter (protected)
router.get('/barter/:barterRequestId', protect, getBarterRatings);

// Check if user can rate a barter (protected)
router.get('/can-rate/:barterRequestId', protect, canRateBarter);

export default router;
