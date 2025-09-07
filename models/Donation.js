const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    expiryAt: { type: Date, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    coldChainNeeded: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["LISTED", "MATCHED", "PICKED", "DELIVERED", "CANCELLED"],
      default: "LISTED",
    },
  },
  { timestamps: true }
);

donationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donation", donationSchema);
