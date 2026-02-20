import express from "express";
import {
  getDestinationReviews,
  createReview,
  markReviewHelpful,
  getUserReviews,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/destination/:destinationId", getDestinationReviews);
router.get("/user/:userId", getUserReviews);
router.post("/", createReview);
router.post("/:reviewId/helpful", markReviewHelpful);
router.delete("/:reviewId", deleteReview);

export default router;
