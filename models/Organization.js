const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["NGO", "BUSINESS", "SCHOOL", "HUB"],
      required: true,
    },
    address: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    coldChainCap: { type: Boolean, default: false },
  },
  { timestamps: true }
);

organizationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Organization", organizationSchema);
