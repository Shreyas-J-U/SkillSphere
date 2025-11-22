import express from "express";
import {
  uploadFile,
  uploadMiddleware,
} from "../controllers/uploadController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", requireAuth, attachUser, uploadMiddleware, uploadFile);

export default router;
