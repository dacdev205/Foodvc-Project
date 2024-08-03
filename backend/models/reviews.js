const mongoose = require("mongoose");
//
const reviewSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});
// create a model instance
module.exports = mongoose.model("Review", reviewSchema);
