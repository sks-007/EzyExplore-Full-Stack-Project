import express from "express";
import {
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", getUserNotifications);
router.post("/", createNotification);
router.patch("/:notificationId/read", markAsRead);
router.patch("/user/:userId/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
