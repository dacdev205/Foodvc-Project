const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
