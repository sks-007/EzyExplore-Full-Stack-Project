import express from "express";
import {
  register,
  login,
  getCurrentUser,
  changePassword,
  logout,
  verifyToken
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", verifyToken, getCurrentUser);
router.post("/change-password", verifyToken, changePassword);

export default router;
