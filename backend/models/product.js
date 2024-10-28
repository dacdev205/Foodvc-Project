const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  recipe: String,
  image: String,
  brand: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: Number,
  quantity: Number,
  productionLocation: String,
  height: Number,
  length: Number,
  weight: Number,
  width: Number,
  instructions: String,
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  expirationDate: {
    type: Date,
    default: function () {
      const now = new Date();
      now.setDate(now.getDate() + 4);
      return now;
    },
  },
  transferredToMenu: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("Product", productSchema);
