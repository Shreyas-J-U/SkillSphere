import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  likePost,
  addComment,
} from "../controllers/communityController.js";

const router = express.Router();

router.route("/").post(protect, createPost).get(protect, getPosts);
router.route("/:id/like").put(protect, likePost);
router.route("/:id/comment").post(protect, addComment);

export default router;
