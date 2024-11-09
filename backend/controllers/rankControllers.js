const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = class rankAPI {
  static async initializeUserRanks() {
    const UserRank = mongoose.model("UserRank");

    const ranks = [
      { user_rank_name: "Bronze", user_discount: 0, user_rank_point: 0 },
      { user_rank_name: "Silver", user_discount: 5, user_rank_point: 100 },
      { user_rank_name: "Gold", user_discount: 10, user_rank_point: 500 },
      { user_rank_name: "Platinum", user_discount: 15, user_rank_point: 1000 },
    ];

    for (const rank of ranks) {
      const existingRank = await UserRank.findOne({
        user_rank_name: rank.user_rank_name,
      });
      if (!existingRank) {
        await UserRank.create(rank);
      }
    }
  }

  static async addPointsToUser(req, res) {
    const { userId, pointsToAdd } = req.body;
    const user = await User.findById(userId);
    if (user) {
      user.points += pointsToAdd;
      await user.checkAndUpgradeRank();
      await user.save();
      return res
        .status(200)
        .json({ message: "Điểm được cộng thành công", points: user.points });
    } else {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }
  }
};
