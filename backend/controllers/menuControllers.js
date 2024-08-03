const Menu = require("../models/menu");
const fs = require("fs");
const Product = require("../models/product");
module.exports = class menuAPI {
  //fetch all menu
  static async fetchAllMenu(req, res) {
    try {
      const menus = await Menu.find().populate("productId");
      res.status(200).json(menus);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // fetch product by id
  static async fetchProductByID(req, res) {
    const id = req.params.id;
    try {
      const product = await Menu.findOne({ id }).populate("productId");
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
  // updateProductInMenu
  static async updateProductInMenu(req, res) {
    const id = req.params.id;
    let new_image = "";

    try {
      const existingMenuProduct = await Menu.findById(id).populate("productId");

      if (!existingMenuProduct) {
        return res.status(404).json({ message: "Product not found in menu" });
      }

      if (req.file) {
        new_image = req.file.filename;
        // Remove the old image
        try {
          fs.unlinkSync("./uploads/" + existingMenuProduct.productId.image);
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = existingMenuProduct.productId.image;
      }

      const updatedProduct = {
        ...req.body,
        image: new_image,
      };

      await existingMenuProduct.productId.set(updatedProduct);
      await existingMenuProduct.productId.save();

      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // updateProductQuantityInMenu
  static async updateProductQuantityInMenu(req, res) {
    const id = req.params.id;
    try {
      const existingMenuProduct = await Menu.findById(id);
      if (!existingMenuProduct) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      // Save current quantity in menu
      const oldQuantityInMenu = existingMenuProduct.quantity;

      if (req.body.quantity > oldQuantityInMenu) {
        const quantityDifference = req.body.quantity - oldQuantityInMenu;
        existingMenuProduct.quantity = req.body.quantity;
        await existingMenuProduct.save();
        // Update quantity in inventory
        const existingInventoryProduct = await Product.findById(
          existingMenuProduct.product
        );
        if (existingInventoryProduct) {
          existingInventoryProduct.quantity -= quantityDifference;
          await existingInventoryProduct.save();
        }
      } else if (req.body.quantity < oldQuantityInMenu) {
        const quantityDifference = oldQuantityInMenu - req.body.quantity;
        // Update quantity in menu
        existingMenuProduct.quantity = req.body.quantity;
        await existingMenuProduct.save();

        // Update quantity in inventory
        const existingInventoryProduct = await Product.findById(
          existingMenuProduct.product
        );
        if (existingInventoryProduct) {
          existingInventoryProduct.quantity += quantityDifference;
          await existingInventoryProduct.save();
        }
      } else {
        // If quantity not changed, just update quantity in menu
        existingMenuProduct.quantity = req.body.quantity;
        await existingMenuProduct.save();
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // applyVoucher
  static async applyVoucher(req, res) {
    try {
      const { productId, discount } = req.body;
      // Validate inputs
      if (!productId || isNaN(discount)) {
        return res.status(400).json({ success: false, error: "Invalid input" });
      }
      // Update prices for items in the selected category
      await Menu.updateMany(
        { product: { $in: productId } },
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
