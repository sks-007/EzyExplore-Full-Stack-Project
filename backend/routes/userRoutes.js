import express from "express";
import {
  getUserProfile,
  createUser,
  updateUserProfile,
  getUserStats,
  awardBadge
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:userId", getUserProfile);
router.post("/", createUser);
router.put("/:userId", updateUserProfile);
router.get("/:userId/stats", getUserStats);
router.post("/:userId/badges", awardBadge);

export default router;
