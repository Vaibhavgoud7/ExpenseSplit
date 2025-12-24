import User from "../models/User.js";
import Group from "../models/Group.js";
import Balance from "../models/Balance.js";

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({ name, email });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove user from groups
    await Group.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    // Delete balances involving user
    await Balance.deleteMany({
      $or: [{ fromUser: userId }, { toUser: userId }]
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};