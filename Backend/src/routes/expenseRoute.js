import express from "express";
import {
  addExpense,
  getExpensesByGroup
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/", addExpense);
expenseRouter.get("/group/:groupId", getExpensesByGroup);

export default expenseRouter;
