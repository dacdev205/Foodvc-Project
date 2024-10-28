// models/orderStatus.js
const mongoose = require("mongoose");
const orderStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
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

const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);

module.exports = OrderStatus;
