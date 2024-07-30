const mongoose = require("mongoose");

const methodDeliverySchema = mongoose.Schema({
  methodId: {
    type: Number,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MethodDelivery", methodDeliverySchema);
