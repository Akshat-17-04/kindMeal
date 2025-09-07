const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  deliveryWindowStart: Date,
  deliveryWindowEnd: Date,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  coldChainRequired: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["OPEN", "FULFILLED", "EXPIRED", "CANCELLED"],
    default: "OPEN"
  }
}, { timestamps: true });

requestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Request", requestSchema);
