
import express from "express";
import {
  getGroupBalances,
  settleBalance,
  getUserSimplifiedBalances
} from "../controllers/balanceController.js";

const balanceRouter = express.Router();

balanceRouter.get("/group/:groupId", getGroupBalances);
balanceRouter.get("/user/:userId/simplified", getUserSimplifiedBalances);
balanceRouter.post("/settle", settleBalance);

export default balanceRouter;
