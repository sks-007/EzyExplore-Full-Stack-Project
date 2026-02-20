import express from "express";
import { 
  createBuddy,
  getLocalBuddies,
  getBuddyById,
  updateBuddy,
  deleteBuddy,
  toggleBuddyAvailability,
  updateBuddyRating
} from "../controllers/buddyController.js";

const router = express.Router();

// CRUD Operations
router.post("/", createBuddy);                    // CREATE
router.get("/", getLocalBuddies);                 // READ (all)
router.get("/:id", getBuddyById);                 // READ (single)
router.put("/:id", updateBuddy);                  // UPDATE
router.delete("/:id", deleteBuddy);               // DELETE

// Additional operations
router.patch("/:id/availability", toggleBuddyAvailability);
router.patch("/:id/rating", updateBuddyRating);

export default router;