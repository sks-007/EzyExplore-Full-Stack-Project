import express from "express";
import {
  getExpenseGroups,
  getExpenseGroup,
  createExpenseGroup,
  addExpense,
  removeExpense,
  calculateSplit,
  updateGroupStatus,
  addMember
} from "../controllers/expenseController.js";

const router = express.Router();

// Expense group routes
router.get("/", getExpenseGroups);
router.post("/", createExpenseGroup);
router.get("/:id", getExpenseGroup);
router.patch("/:id/status", updateGroupStatus);

// Expense operations
router.post("/:id/expenses", addExpense);
router.delete("/:id/expenses/:expenseId", removeExpense);
router.get("/:id/calculate", calculateSplit);

// Member operations
router.post("/:id/members", addMember);

export default router;
