import express from "express";
import {
  createBarterRequest,
  getBarterRequests,
  getBarterRequestById,
  acceptBarterRequest,
  rejectBarterRequest,
  completeBarterRequest,
} from "../controllers/barterController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", requireAuth, attachUser, createBarterRequest);
router.get("/", requireAuth, attachUser, getBarterRequests);
router.get("/:id", requireAuth, attachUser, getBarterRequestById);
router.put("/:id/accept", requireAuth, attachUser, acceptBarterRequest);
router.put("/:id/reject", requireAuth, attachUser, rejectBarterRequest);
router.put("/:id/complete", requireAuth, attachUser, completeBarterRequest);

export default router;
