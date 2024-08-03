const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WishList", wishListSchema);
