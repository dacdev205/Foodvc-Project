const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopName: { type: String, required: true, unique: true },
  shop_image: { type: String, unique: true },
  shop_isOpen: { type: Boolean, default: true },
  shop_isActive: { type: Boolean, default: true },
  shop_rating: { type: Number, default: 0 },
  description: { type: String, required: true },
  shop_id_ghn: { type: String, required: true },
  shop_token_ghn: { type: String, required: true },
  inventories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }],
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  shopRank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shopRank",
  },
  shippingPartner: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ShippingPartner" },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Shop", shopSchema);
