import express from "express";
import { 
  planVisit,
  getAllVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
  getUserVisits,
  getVisitStats
} from "../controllers/visitController.js";

const router = express.Router();

// CRUD Operations
router.post("/", planVisit);                      // CREATE
router.get("/", getAllVisits);                    // READ (all with filters)
router.get("/stats", getVisitStats);             // Statistics
router.get("/user/:userId", getUserVisits);      // READ (by user)
router.get("/:id", getVisitById);                // READ (single)
router.put("/:id", updateVisit);                 // UPDATE
router.delete("/:id", deleteVisit);              // DELETE

export default router;