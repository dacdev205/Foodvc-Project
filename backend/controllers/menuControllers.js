const Menu = require("../models/menu");
const fs = require("fs");
const Product = require("../models/product");
module.exports = class menuAPI {
  static async fetchMenus(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        category = "all",
        page = 1,
        limit = 8,
      } = req.query;

      let menus = await Menu.find().populate("productId").exec();

      if (searchTerm) {
        if (filterType === "name") {
          menus = menus.filter((menu) =>
            menu.productId.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }

      if (category !== "all") {
        menus = menus.filter((menu) => menu.productId.category === category);
      }

      const totalMenus = menus.length;
      const totalPages = Math.ceil(totalMenus / limit);
      const paginatedMenus = menus.slice((page - 1) * limit, page * limit);

      res.json({ menus: paginatedMenus, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // fetch product by id
  static async fetchProductByID(req, res) {
    const id = req.params.id;
    try {
      const product = await Menu.findOne({ productId: id }).populate(
        "productId"
      );
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const { productId, quantity } = req.body;

      const productInMenu = await Menu.findOne({ productId: productId });

      if (productInMenu) {
        productInMenu.quantity += quantity;
        await productInMenu.save();
      } else {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        await Menu.create({
          productId: product._id,
          quantity,
        });
      }

      res.status(200).json({ message: "Product added to menu successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
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
