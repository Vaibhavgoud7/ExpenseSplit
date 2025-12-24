import express from "express";
import {
  createUser,
  getAllUsers,
  deleteUser
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);

userRouter.delete("/:userId", deleteUser);

export default userRouter;
