import express from "express";
import {
  createSession,
  getSessionByBarterId,
  markUserReady,
  completeSession,
  startMeetingInstance,
  endMeetingInstance,
} from "../controllers/sessionController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", requireAuth, attachUser, createSession);
router.get("/barter/:barterId", requireAuth, attachUser, getSessionByBarterId);
router.put("/:id/ready", requireAuth, attachUser, markUserReady);
router.put("/:id/start", requireAuth, attachUser, startMeetingInstance);
router.put("/:id/end", requireAuth, attachUser, endMeetingInstance);
router.put("/:id/complete", requireAuth, attachUser, completeSession);

export default router;
