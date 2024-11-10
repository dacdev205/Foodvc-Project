const Menu = require("../models/menu");
const fs = require("fs");
const Product = require("../models/product");
const User = require("../models/user");
const Category = require("../models/category");
module.exports = class menuAPI {
  static async fetchMenus(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        category = "all",
        page = 1,
        limit = 5,
        minPrice = 0,
        maxPrice = Infinity,
        minRating = 0,
        maxRating = 5,
        sort = "-createaAt",
      } = req.query;

      let query = {};

      if (category && category !== "all") {
        const categoryDoc = await Category.findOne({
          name: { $regex: category, $options: "i" },
        }).exec();

        if (categoryDoc) {
          const productIdsByCategory = await Product.find({
            category: categoryDoc._id,
          }).select("_id");

          if (!productIdsByCategory.length) {
            return res.json({ menus: [], totalPages: 0 });
          }

          query["productId"] = { $in: productIdsByCategory.map((p) => p._id) };
        } else {
          return res.json({ menus: [], totalPages: 0 });
        }
      }

      if (searchTerm && filterType === "name") {
        const productIdsByName = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        if (query["productId"]) {
          query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
            productIdsByName.some((p) => p._id.equals(id))
          );
        } else {
          query["productId"] = { $in: productIdsByName.map((p) => p._id) };
        }
      }

      const productIdsByPrice = await Product.find({
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      }).select("_id");

      if (query["productId"]) {
        query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
          productIdsByPrice.some((p) => p._id.equals(id))
        );
      } else {
        query["productId"] = { $in: productIdsByPrice.map((p) => p._id) };
      }

      const menusByRating = await Menu.find(query)
        .populate({
          path: "reviews",
          select: "rating",
        })
        .exec();

      const menuIdsByRating = menusByRating
        .filter((menu) => {
          const ratings = menu.reviews.map((review) => review.rating);
          const avgRating = ratings.length
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
          return avgRating >= minRating && avgRating <= maxRating;
        })
        .map((menu) => menu._id);

      query["_id"] = { $in: menuIdsByRating };

      const totalMenus = await Menu.countDocuments(query);
      const totalPages = Math.ceil(totalMenus / limit);

      const menus = await Menu.find(query)
        .populate({
          path: "productId",
          populate: {
            path: "category",
          },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

      res.json({ menus, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchMenusSeller(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        category = "all",
        page = 1,
        limit = 5,
        shopId,
        minPrice = 0,
        maxPrice = Infinity,
        minRating = 0,
        maxRating = 5,
      } = req.query;

      let query = {};

      if (shopId) {
        query["shopId"] = shopId;
      }

      if (category && category !== "all") {
        const categoryDoc = await Category.findOne({
          name: { $regex: category, $options: "i" },
        }).exec();

        if (categoryDoc) {
          const productIdsByCategory = await Product.find({
            category: categoryDoc._id,
          }).select("_id");

          if (!productIdsByCategory.length) {
            return res.json({ menus: [], totalPages: 0 });
          }

          query["productId"] = { $in: productIdsByCategory.map((p) => p._id) };
        } else {
          return res.json({ menus: [], totalPages: 0 });
        }
      }

      if (searchTerm && filterType === "name") {
        const productIdsByName = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        if (query["productId"]) {
          query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
            productIdsByName.some((p) => p._id.equals(id))
          );
        } else {
          query["productId"] = { $in: productIdsByName.map((p) => p._id) };
        }
      }

      const productIdsByPrice = await Product.find({
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      }).select("_id");

      if (query["productId"]) {
        query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
          productIdsByPrice.some((p) => p._id.equals(id))
        );
      } else {
        query["productId"] = { $in: productIdsByPrice.map((p) => p._id) };
      }

      const menusByRating = await Menu.find(query)
        .populate({
          path: "reviews",
          select: "rating",
        })
        .exec();

      const menuIdsByRating = menusByRating
        .filter((menu) => {
          const ratings = menu.reviews.map((review) => review.rating);
          const avgRating = ratings.length
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
          return avgRating >= minRating && avgRating <= maxRating;
        })
        .map((menu) => menu._id);

      query["_id"] = { $in: menuIdsByRating };

      const totalMenus = await Menu.countDocuments(query);
      const totalPages = Math.ceil(totalMenus / limit);

      const menus = await Menu.find(query)
        .populate("productId")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

      res.json({ menus, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async fetchMenusAdmin(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        category = "all",
        page = 1,
        limit = 5,
        minPrice = 0,
        maxPrice = Infinity,
        minRating = 0,
        maxRating = 5,
      } = req.query;

      let query = {};

      if (category && category !== "all") {
        const categoryDoc = await Category.findOne({
          name: { $regex: category, $options: "i" },
        }).exec();

        if (categoryDoc) {
          const productIdsByCategory = await Product.find({
            category: categoryDoc._id,
          }).select("_id");

          if (!productIdsByCategory.length) {
            return res.json({ menus: [], totalPages: 0 });
          }

          query["productId"] = { $in: productIdsByCategory.map((p) => p._id) };
        } else {
          return res.json({ menus: [], totalPages: 0 });
        }
      }

      if (searchTerm && filterType === "name") {
        const productIdsByName = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        if (query["productId"]) {
          query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
            productIdsByName.some((p) => p._id.equals(id))
          );
        } else {
          query["productId"] = { $in: productIdsByName.map((p) => p._id) };
        }
      }

      const productIdsByPrice = await Product.find({
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      }).select("_id");

      if (query["productId"]) {
        query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
          productIdsByPrice.some((p) => p._id.equals(id))
        );
      } else {
        query["productId"] = { $in: productIdsByPrice.map((p) => p._id) };
      }

      const menusByRating = await Menu.find(query)
        .populate({
          path: "reviews",
          select: "rating",
        })
        .exec();

      const menuIdsByRating = menusByRating
        .filter((menu) => {
          const ratings = menu.reviews.map((review) => review.rating);
          const avgRating = ratings.length
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
          return avgRating >= minRating && avgRating <= maxRating;
        })
        .map((menu) => menu._id);

      query["_id"] = { $in: menuIdsByRating };

      const totalMenus = await Menu.countDocuments(query);
      const totalPages = Math.ceil(totalMenus / limit);

      const menus = await Menu.find(query)
        .populate("productId")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

      res.json({ menus, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // fetch product by id
  static async fetchProductByID(req, res) {
    const id = req.params.id;
    try {
      const product = await Menu.findOne({ productId: id })
        .populate("productId")
        .populate("shopId");
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const { productId, quantity, shopId } = req.body;

      if (!shopId) {
        return res.status(400).json({ message: "shopId is required" });
      }

      const productInMenu = await Menu.findOne({ productId, shopId });

      if (productInMenu) {
        productInMenu.quantity += quantity;
        await productInMenu.save();
      } else {
        const newMenuProduct = new Menu({
          productId,
          quantity,
          shopId,
        });
        await newMenuProduct.save();
      }

      res
        .status(201)
        .json({ message: "Sản phẩm được thêm vào menu thành công" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update product details in the menu
  static async updateProductInMenu(req, res) {
    const menuItemId = req.params.id;
    let new_image = "";

    try {
      const existingMenuProduct = await Menu.findById(menuItemId).populate(
        "productId"
      );

      if (!existingMenuProduct) {
        return res.status(404).json({ message: "Product not found in menu" });
      }

      if (req.file) {
        new_image = req.file.filename;
        // Remove the old image
        try {
          fs.unlinkSync("./uploads/" + existingMenuProduct.productId.image);
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      } else {
        new_image = existingMenuProduct.productId.image;
      }

      const updatedProduct = {
        ...req.body,
        image: new_image,
      };

      // Update product details in the inventory
      await existingMenuProduct.productId.set(updatedProduct);
      await existingMenuProduct.productId.save();

      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Update product quantity in the menu
  static async updateProductQuantityInMenu(req, res) {
    const productId = req.params.id;
    const { quantity } = req.body;

    try {
      const existingMenuProduct = await Menu.findOne({ productId: productId });
      if (!existingMenuProduct) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      const oldQuantityInMenu = existingMenuProduct.quantity;

      if (quantity !== oldQuantityInMenu) {
        const quantityDifference = quantity - oldQuantityInMenu;

        existingMenuProduct.quantity = quantity;
        await existingMenuProduct.save();

        const existingInventoryProduct = await Product.findById(
          existingMenuProduct.productId
        );

        if (existingInventoryProduct) {
          existingInventoryProduct.quantity -= quantityDifference;
          await existingInventoryProduct.save();
        }
      }

      res
        .status(200)
        .json({ message: "Product quantity updated successfully" });
    } catch (err) {
      console.error("Error updating product quantity in menu:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Apply voucher to products in the menu
  static async applyVoucher(req, res) {
    try {
      const { productId, discount } = req.body;

      if (!productId || isNaN(discount)) {
        return res.status(400).json({ success: false, error: "Invalid input" });
      }

      await Menu.updateMany(
        { productId: { $in: productId } },
        { $mul: { price: 1 - discount / 100 } }
      );

      res
        .status(200)
        .json({ success: true, message: "Voucher applied successfully" });
    } catch (error) {
      console.error("Error applying voucher:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};
