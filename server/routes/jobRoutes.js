import express from 'express';
import { getJobRecommendations, searchJobsManually } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get personalized job recommendations
router.get('/recommendations', protect, getJobRecommendations);

// Manual job search
router.get('/search', protect, searchJobsManually);

export default router;
