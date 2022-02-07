const mongoose = require("mongoose");

const SnapshotSchema = new mongoose.Schema(
  {
    refid: {
      type: String,
      required: true,
    },
    current_value: {
      type: Number,
    },
    as_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Snapshot = mongoose.model("Snapshot", SnapshotSchema);
module.exports = Snapshot;
