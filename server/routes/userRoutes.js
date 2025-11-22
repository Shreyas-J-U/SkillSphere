import express from "express";
import {
  getUsers,
  getUserById,
  updateProfile,
  updateSkills,
} from "../controllers/userController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.get("/", requireAuth, attachUser, getUsers);
router.get("/:id", requireAuth, attachUser, getUserById);
router.put("/profile", requireAuth, attachUser, updateProfile);
router.put("/skills", requireAuth, attachUser, updateSkills);

export default router;
