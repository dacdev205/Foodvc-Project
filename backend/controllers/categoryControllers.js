const Category = require("../models/category");
module.exports = class categoryAPI {
  static async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCategories(req, res) {
    try {
      const { searchTerm = "", page = 1, limit = 5 } = req.query;
      const query = {};
      if (searchTerm) {
        const regex = new RegExp(searchTerm, "i");
        query.name = regex;
      }
      const categories = await Category.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalCategories = await Category.countDocuments(query);
      const totalPages = Math.ceil(totalCategories / limit);

      res.status(200).json({
        categories,
        totalPages,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { name, description } = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true }
      );
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
