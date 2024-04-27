const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  applyVoucher: {
    type: Boolean,
    default: false,
  },
  expirationDate: {
    type: Date,
    default: function() {
      const now = new Date();
      now.setDate(now.getDate() + 4);
      return now;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Inventory", inventorySchema);
