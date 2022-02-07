const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema(
  {
    ledgerid: {
      type: String,
      required: true,
      unique: true,
    },
    refid: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    subtype: {
      type: String,
    },
    aclass: {
      type: String,
      required: true,
    },
    asset: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ledger = mongoose.model("Ledger", LedgerSchema);
module.exports = Ledger;
