const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishStoreSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WishStore", wishStoreSchema);
