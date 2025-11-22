import express from "express";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";
import {
  submitRating,
  getUserRatings,
  getBarterRatings,
  canRateBarter,
} from "../controllers/ratingController.js";

const router = express.Router();

// Submit a rating (protected)
router.post("/", requireAuth, attachUser, submitRating);

// Get ratings for a specific user (public)
router.get("/user/:userId", getUserRatings);

// Get ratings for a specific barter (protected)
router.get(
  "/barter/:barterRequestId",
  requireAuth,
  attachUser,
  getBarterRatings
);

// Check if user can rate a barter (protected)
router.get(
  "/can-rate/:barterRequestId",
  requireAuth,
  attachUser,
  canRateBarter
);

export default router;
