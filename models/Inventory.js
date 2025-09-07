const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
    qtyRemaining: { type: Number, required: true },
    expiryAt: { type: Date, required: true },
    storageType: {
      type: String,
      enum: ["AMBIENT", "CHILLED", "FROZEN"],
      default: "AMBIENT",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
