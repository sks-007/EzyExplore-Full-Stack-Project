import express from "express";
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  getPopularDestinations,
  incrementPopularity
} from "../controllers/destinationController.js";

const router = express.Router();

// Public routes
router.get("/", getDestinations);
router.get("/popular", getPopularDestinations);
router.get("/:id", getDestinationById);
router.post("/:id/increment-popularity", incrementPopularity);

// Admin routes (should add auth middleware)
router.post("/", createDestination);
router.put("/:id", updateDestination);

export default router;
