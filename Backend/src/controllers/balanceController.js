
import Balance from "../models/Balance.js";


export const simplifyBalancePair = async (group, userA, userB) => {
  const balanceAB = await Balance.findOne({ group, fromUser: userA, toUser: userB });
  const balanceBA = await Balance.findOne({ group, fromUser: userB, toUser: userA });

  if (!balanceAB || !balanceBA) return;

  if (balanceAB.amount > balanceBA.amount) {
    balanceAB.amount -= balanceBA.amount;
    await balanceAB.save();
    await balanceBA.deleteOne();
  } else if (balanceBA.amount > balanceAB.amount) {
    balanceBA.amount -= balanceAB.amount;
    await balanceBA.save();
    await balanceAB.deleteOne();
  } else {
    await balanceAB.deleteOne();
    await balanceBA.deleteOne();
  }
};


export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const balances = await Balance.find({ group: groupId })
      .populate("fromUser", "name")
      .populate("toUser", "name");

    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserSimplifiedBalances = async (req, res) => {
  try {
    const { userId } = req.params;

    const balances = await Balance.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate("fromUser", "name")
      .populate("toUser", "name");

    const netMap = {};

    balances.forEach((b) => {
      const otherUser =
        b.fromUser._id.toString() === userId
          ? b.toUser
          : b.fromUser;

      const key = otherUser._id.toString();
      if (!netMap[key]) {
        netMap[key] = {
          user: otherUser,
          netAmount: 0
        };
      }

      if (b.fromUser._id.toString() === userId) {
        
        netMap[key].netAmount -= b.amount;
      } else {
        
        netMap[key].netAmount += b.amount;
      }
    });

    const simplified = Object.values(netMap)
      .filter((b) => b.netAmount !== 0)
      .map((b) => ({
        user: b.user,
        amount: Math.abs(b.netAmount),
        type: b.netAmount > 0 ? "receivable" : "payable"
      }));

    res.status(200).json(simplified);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const settleBalance = async (req, res) => {
  try {
    const { group, fromUser, toUser, amount } = req.body;

    const balance = await Balance.findOne({ group, fromUser, toUser });

    if (!balance) {
      return res.status(404).json({ message: "No balance found" });
    }

    if (amount > balance.amount) {
      return res.status(400).json({ message: "Settlement exceeds balance" });
    }

    balance.amount -= amount;

    if (balance.amount === 0) {
      await balance.deleteOne();
    } else {
      await balance.save();
    }

    await simplifyBalancePair(group, fromUser, toUser);

    res.status(200).json({ message: "Balance settled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
