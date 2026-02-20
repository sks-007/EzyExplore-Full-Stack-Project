import express from "express";
import {
  getUserBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/user/:userId", getUserBookings);
router.post("/", createBooking);
router.put("/:bookingId", updateBookingStatus);
router.patch("/:bookingId/cancel", cancelBooking);
router.get("/stats", getBookingStats);

export default router;
