import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one balance entry per pair per group
balanceSchema.index(
  { group: 1, fromUser: 1, toUser: 1 },
  { unique: true }
);

const Balance = mongoose.model("Balance", balanceSchema);

export default Balance;
