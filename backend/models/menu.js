const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
