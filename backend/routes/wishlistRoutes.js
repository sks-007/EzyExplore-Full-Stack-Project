import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/", removeFromWishlist);
router.delete("/clear", clearWishlist);

export default router;
