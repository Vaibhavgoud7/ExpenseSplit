import Expense from "../models/Expense.js";
import Balance from "../models/Balance.js";
import Group from "../models/Group.js";
import { simplifyBalancePair } from "./balanceController.js";


const calculateSplits = (splitType, participants, totalAmount) => {
  if (splitType === "equal") {
    const share = Number((totalAmount / participants.length).toFixed(2));

    return participants.map(userId => ({
      user: userId,
      amount: share
    }));
  }

  if (splitType === "exact") {
    const sum = participants.reduce((acc, p) => acc + p.amount, 0);
    if (sum !== totalAmount) {
      throw new Error("Exact split amounts do not match total");
    }
    return participants;
  }

  if (splitType === "percentage") {
    const percentSum = participants.reduce((acc, p) => acc + p.percentage, 0);
    if (percentSum !== 100) {
      throw new Error("Percentages must sum to 100");
    }

    return participants.map(p => ({
      user: p.user,
      amount: Number(((p.percentage / 100) * totalAmount).toFixed(2))
    }));
  }

  throw new Error("Invalid split type");
};


export const addExpense = async (req, res) => {
  try {
    const {
      description,
      totalAmount,
      paidBy,
      group,
      splitType,
      participants
    } = req.body;

    let splitParticipants;

    
    if (splitType === "equal") {
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        return res.status(404).json({ message: "Group not found" });
      }
      splitParticipants = groupDoc.members;
    } else {
      if (!participants || participants.length === 0) {
        return res.status(400).json({ message: "Participants are required for this split type" });
      }
      splitParticipants = participants;
    }

    const splits = calculateSplits(splitType, splitParticipants, totalAmount);

    const expense = await Expense.create({
      description,
      totalAmount,
      paidBy,
      group,
      splitType,
      splits
    });

    
    for (const split of splits) {
      if (split.user.toString() === paidBy.toString()) continue;

      let balance = await Balance.findOne({
        group,
        fromUser: split.user,
        toUser: paidBy
      });

      if (balance) {
        balance.amount += split.amount;
        await balance.save();
      } else {
        await Balance.create({
          group,
          fromUser: split.user,
          toUser: paidBy,
          amount: split.amount
        });
      }

      
      await simplifyBalancePair(group, split.user, paidBy);
    }

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getExpensesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name")
      .populate("splits.user", "name");

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
