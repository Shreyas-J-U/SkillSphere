import express from "express";

import {
  getJobRecommendations,
  searchJobsManually,
} from "../controllers/jobController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

// Get personalized job recommendations
router.get("/recommendations", requireAuth, attachUser, getJobRecommendations);

// Manual job search
router.get("/search", requireAuth, attachUser, searchJobsManually);

export default router;
