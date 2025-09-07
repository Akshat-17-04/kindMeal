const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    score: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PROPOSED", "ACCEPTED", "REJECTED", "EXPIRED"],
      default: "PROPOSED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
