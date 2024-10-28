const mongoose = require("mongoose");

const shopRankSchema = mongoose.Schema({
  shop_rank_name: {
    type: String,
    required: true,
    enum: ["Bronze", "Silver", "Gold", "Platinum"],
  },
  shop_discount: {
    type: Number,
    required: true,
  },
  shop_rank_point: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("ShopRank", shopRankSchema);
