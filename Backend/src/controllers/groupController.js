import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import Balance from "../models/Balance.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;

    const group = await Group.create({
      name,
      members,
      createdBy
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("members", "name")
      .populate("createdBy", "name");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    await Expense.deleteMany({ group: groupId });
    await Balance.deleteMany({ group: groupId });
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};