import express from "express";
import {
  getComments,
  createComment,
  deleteComment,
  markCommentHelpful,
  updateCommentStatus,
  getCommentStats
} from "../controllers/commentController.js";

const router = express.Router();

// Public routes
router.get("/", getComments);
router.post("/", createComment);
router.get("/stats", getCommentStats);
router.post("/:id/helpful", markCommentHelpful);

// User routes
router.delete("/:id", deleteComment);

// Admin routes (should add auth middleware)
router.patch("/:id/status", updateCommentStatus);

export default router;
