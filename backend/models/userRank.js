const mongoose = require("mongoose");

const userRankSchema = mongoose.Schema({
  user_rank_name: {
    type: String,
    required: true,
    enum: ["Bronze", "Silver", "Gold", "Platinum"],
  },
  user_discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  user_rank_point: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("UserRank", userRankSchema);
