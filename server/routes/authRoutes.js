import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { requireAuth, attachUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, attachUser, getMe);

export default router;
