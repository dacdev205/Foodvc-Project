const UserRank = require("../models/userRank");

module.exports = class UserRankAPI {
  // Tạo user rank mới
  static async createUserRank(req, res) {
    const { user_rank_name, user_discount, user_rank_point } = req.body;

    try {
      const newUserRank = new UserRank({
        user_rank_name,
        user_discount,
        user_rank_point,
      });

      await newUserRank.save();
      res
        .status(201)
        .json({ message: "User rank created successfully", data: newUserRank });
    } catch (error) {
      res.status(500).json({ message: "Error creating user rank", error });
    }
  }

  // Lấy tất cả user ranks với pagination và tìm kiếm
  static async getAllUserRanks(req, res) {
    const { page = 1, limit = 10, search = "" } = req.query;

    try {
      const query = search
        ? { user_rank_name: { $regex: search, $options: "i" } }
        : {};

      const userRanks = await UserRank.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

      const totalUserRanks = await UserRank.countDocuments(query);

      res.status(200).json({
        data: userRanks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalUserRanks,
          totalPages: Math.ceil(totalUserRanks / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user ranks", error });
    }
  }

  // Lấy user rank theo ID
  static async getUserRankById(req, res) {
    const { id } = req.params;

    try {
      const userRank = await UserRank.findById(id);

      if (!userRank) {
        return res.status(404).json({ message: "User rank not found" });
      }

      res.status(200).json({ data: userRank });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user rank", error });
    }
  }

  // Cập nhật user rank
  static async updateUserRank(req, res) {
    const { id } = req.params;
    const { user_rank_name, user_discount, user_rank_point } = req.body;

    try {
      const updatedUserRank = await UserRank.findByIdAndUpdate(
        id,
        { user_rank_name, user_discount, user_rank_point },
        { new: true, runValidators: true }
      );

      if (!updatedUserRank) {
        return res.status(404).json({ message: "User rank not found" });
      }

      res.status(200).json({
        message: "User rank updated successfully",
        data: updatedUserRank,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user rank", error });
    }
  }

  // Xóa user rank
  static async deleteUserRank(req, res) {
    const { id } = req.params;

    try {
      const deletedUserRank = await UserRank.findByIdAndDelete(id);

      if (!deletedUserRank) {
        return res.status(404).json({ message: "User rank not found" });
      }

      res.status(200).json({
        message: "User rank deleted successfully",
        data: deletedUserRank,
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user rank", error });
    }
  }
};
