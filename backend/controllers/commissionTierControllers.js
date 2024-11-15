const CommissionTier = require("../models/comissionTier");

module.exports = class CommissionTierController {
  // Get all commission tiers with pagination and search
  static async getAllCommissionTiers(req, res) {
    try {
      const { page = 1, limit = 5, searchTerm = "" } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const searchFilter = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};

      const tiers = await CommissionTier.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .exec();

      const totalTiers = await CommissionTier.countDocuments(searchFilter);
      const totalPages = Math.ceil(totalTiers / limitNumber);

      res.status(200).json({
        tiers,
        totalPages,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching commission tiers",
        error: error.message,
      });
    }
  }
  static async getAllCommissionTiers4User(req, res) {
    try {
      const tiers = await CommissionTier.find();
      res.status(200).json(tiers);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching commission tiers",
        error: error.message,
      });
    }
  }
  static async getCommissionTierById(req, res) {
    const { id } = req.params;

    try {
      const tier = await CommissionTier.findById(id);
      if (!tier) {
        return res.status(404).json({ message: "Commission tier not found" });
      }
      res.status(200).json({
        message: "Commission tier retrieved successfully",
        data: tier,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching commission tier",
        error: error.message,
      });
    }
  }

  // Update a commission tier by ID
  static async updateCommissionTier(req, res) {
    const { id } = req.params;
    const { name, description, revenueRequired, commissionRate } = req.body;

    try {
      const updatedTier = await CommissionTier.findByIdAndUpdate(
        id,
        {
          name,
          description,
          revenueRequired,
          commissionRate,
        },
        { new: true, runValidators: true }
      );
      if (!updatedTier) {
        return res.status(404).json({ message: "Commission tier not found" });
      }
      res.status(200).json({
        message: "Commission tier updated successfully",
        data: updatedTier,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating commission tier",
        error: error.message,
      });
    }
  }

  // Delete a commission tier by ID
  static async deleteCommissionTier(req, res) {
    const { id } = req.params;

    try {
      const deletedTier = await CommissionTier.findByIdAndDelete(id);
      if (!deletedTier) {
        return res.status(404).json({ message: "Commission tier not found" });
      }
      res.status(200).json({ message: "Commission tier deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting commission tier",
        error: error.message,
      });
    }
  }

  // Create a new commission tier
  static async createCommissionTier(req, res) {
    const { name, description, revenueRequired, commissionRate } = req.body;

    try {
      const newTier = new CommissionTier({
        name,
        description,
        revenueRequired,
        commissionRate,
      });

      await newTier.save();
      res.status(201).json({
        message: "Commission tier created successfully",
        data: newTier,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating commission tier",
        error: error.message,
      });
    }
  }
};
