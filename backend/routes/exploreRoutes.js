import express from "express";
import { getExploreIntro } from "../controllers/exploreController.js";
const router = express.Router();
router.get("/", getExploreIntro);
export default router;