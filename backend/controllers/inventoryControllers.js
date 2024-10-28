const Inventory = require("../models/inventory");
const fs = require("fs");
const Product = require("../models/product");
const axios = require("axios");
const Menu = require("../models/menu");
const Category = require("../models/category");
const Shop = require("../models/shop");

module.exports = class inventoryAPI {
  static async fetchInventorys(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        page = 1,
        limit = 5,
        sortBy = "",
        sortOrder = "asc",
        shopId,
      } = req.query;

      if (!shopId) {
        return res.status(400).json({ message: "shopId is required" });
      }

      const query = { shopId };
      const sortOptions = {};

      if (searchTerm) {
        switch (filterType) {
          case "name":
            query.name = { $regex: searchTerm, $options: "i" };
            break;
          case "category":
            const category = await Category.findOne({
              name: { $regex: searchTerm, $options: "i" },
            });
            if (category) {
              query.category = category._id;
            } else {
              query.category = null;
            }
            break;
          case "brand":
            query.brand = { $regex: searchTerm, $options: "i" };
            break;
          case "productionLocation":
            query.productionLocation = { $regex: searchTerm, $options: "i" };
            break;
          case "instructions":
            query.instructions = { $regex: searchTerm, $options: "i" };
            break;
          default:
            query.name = { $regex: searchTerm, $options: "i" };
            break;
        }
      }

      if (sortBy) {
        sortOptions[sortBy] = sortOrder === "asc" ? -1 : 1;
      }

      const inventory = await Product.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const totalProduct = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProduct / limit);

      res.json({ inventory, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Fetch product by ID
  static async fetchProductByID(req, res) {
    const { id, shopId } = req.params;
    try {
      const product = await Product.findOne({ _id: id, shopId }).populate(
        "category"
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found in this shop" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Create product in inventory
  static async createProductInInventory(req, res) {
    const { shopId, ...productData } = req.body;
    const imagename = req.file.filename;
    productData.image = imagename;
    try {
      const product = await Product.create({ ...productData, shopId });

      const inventoryItem = await Inventory.create({
        shopId: shopId,
        productId: product._id,
      });
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      shop.inventories.push(inventoryItem._id);
      await shop.save();

      return res.status(201).json({ product, inventoryItem, shop });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Post product to menu
  static async postProductToMenu(req, res) {
    try {
      const { productId, quantity, shopId } = req.body;
      const productInInventory = await Product.findOne({
        _id: productId,
        shopId,
      });

      if (!productInInventory) {
        return res
          .status(404)
          .json({ message: "Product not found in this shop" });
      }

      productInInventory.quantity -= quantity;
      await productInInventory.save();

      await axios.post("http://localhost:3000/api/foodvc/add-to-menu", {
        productId,
        quantity,
        shopId,
      });

      productInInventory.transferredToMenu = true;
      await productInInventory.save();
      res.status(200).json({ message: "Product transferred successfully" });
    } catch (error) {
      console.error("Error transferring product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Update product in inventory
  static async updateProductInInventory(req, res) {
    const { id, shopId } = req.params;
    let new_image = "";

    try {
      const existingProduct = await Product.findOne({ _id: id, shopId });

      if (!existingProduct) {
        return res
          .status(404)
          .json({ message: "Product not found in this shop" });
      }

      if (req.file) {
        new_image = req.file.filename;
        try {
          fs.unlinkSync("./uploads/" + existingProduct.image);
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = existingProduct.image;
      }

      const updatedProduct = {
        ...req.body,
        image: new_image,
      };

      await existingProduct.set(updatedProduct);
      await existingProduct.save();

      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Remove product from menu
  static async removeProductFromMenu(req, res) {
    try {
      const { productId, shopId } = req.body;

      // Find the menu item associated with the given product ID
      const menuItem = await Menu.findOne({ product: productId, shopId });

      if (!menuItem) {
        console.log("Menu item not found for product ID:", productId);
        return res
          .status(404)
          .json({ message: "Menu item not found for the product" });
      }

      const productInInventory = await Product.findOne({
        _id: productId,
        shopId,
      });
      if (!productInInventory) {
        return res
          .status(404)
          .json({ message: "Product not found in inventory" });
      }

      // Update the product quantity in inventory
      productInInventory.quantity += menuItem.quantity;
      productInInventory.transferredToMenu = false;
      await productInInventory.save();

      // Remove the product from the menu
      await menuItem.remove();

      res
        .status(200)
        .json({ message: "Product removed from menu successfully" });
    } catch (error) {
      console.error("Error removing product from menu:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Delete product from inventory
  static async deleteProductFromInventory(req, res) {
    const { id, shopId } = req.params;
    try {
      const productInMenu = await Menu.findOne({ _id: id, shopId });
      if (productInMenu) {
        const imgItemMenu = await Menu.findOneAndDelete({ _id: id, shopId });
        if (imgItemMenu.image != "") {
          try {
            fs.unlinkSync("./uploads/" + imgItemMenu.image);
          } catch (err) {
            console.log(err);
          }
        }
      }
      const inventoryItem = await Inventory.findOne({ product: id, shopId });
      if (inventoryItem) {
        await Inventory.findByIdAndDelete(inventoryItem._id);
      }

      const product = await Product.findOne({ _id: id, shopId });
      if (product) {
        const imgProduct = await Product.findByIdAndDelete({ _id: id, shopId });
        if (imgProduct.image != "") {
          try {
            fs.unlinkSync("./uploads/" + imgProduct.image);
          } catch (err) {
            console.log(err);
          }
        }
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
