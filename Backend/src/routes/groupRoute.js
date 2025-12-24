import express from "express";
import {
  createGroup,
  getGroupById,
  getAllGroups,
  deleteGroup
} from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/", createGroup);
groupRouter.get("/", getAllGroups);
groupRouter.get("/:groupId", getGroupById);

groupRouter.delete("/:groupId", deleteGroup)

export default groupRouter;
