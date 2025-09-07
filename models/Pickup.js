const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupAt: Date,
    dropAt: Date,
    routeDistanceKm: Number,
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_TRANSIT", "COMPLETED", "FAILED"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);
