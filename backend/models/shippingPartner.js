const mongoose = require("mongoose");

const ShippingPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requiredFields: {
    type: [String],
    default: ["apiToken", "shopId"],
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

module.exports = mongoose.model("ShippingPartner", ShippingPartnerSchema);
