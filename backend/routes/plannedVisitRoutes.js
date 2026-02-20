import express from "express";
import {
  getPlannedVisits,
  getPlannedVisit,
  createPlannedVisit,
  updatePlannedVisit,
  deletePlannedVisit,
  updateVisitStatus,
  checkPlannedVisit,
  getUpcomingSummary
} from "../controllers/plannedVisitController.js";

const router = express.Router();

// Planned visit routes
router.get("/", getPlannedVisits);
router.post("/", createPlannedVisit);
router.get("/check", checkPlannedVisit);
router.get("/summary", getUpcomingSummary);
router.get("/:id", getPlannedVisit);
router.put("/:id", updatePlannedVisit);
router.delete("/:id", deletePlannedVisit);
router.patch("/:id/status", updateVisitStatus);

export default router;
