const Menu = require("../models/menu");
const fs = require("fs");
const Product = require("../models/product");
module.exports = class menuAPI {
  //fetch all menu
  static async fetchAllMenu(req, res) {
    try {
      const menus = await Menu.find();
      res.status(200).json(menus);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // fetch product by id
  static async fetchProductByID(req, res) {
    const id = req.params.id;
    try {
      const product = await Menu.findById(id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // create product
  static async createProduct(req, res) {
    try {
      const { productId, quantity } = req.body;
      const productInMenu = await Menu.findById(productId);
      if (!productInMenu) {
        const product = await Product.findById(productId);
        await Menu.create({
          _id: product._id,
          name: product.name,
          recipe: product.recipe,
          image: product.image,
          brand: product.brand,
          height: product.height,
          length: product.length,
          weight: product.weight,
          width: product.width,
          category: product.category,
          productionLocation: product.productionLocation,
          price: product.price,
          instructions: product.instructions,
          expirationDate: product.expirationDate,
          createdAt: product.createdAt,
          storage: product.storage,
          quantity,
        });
      } else {
        productInMenu.quantity += quantity;
        await productInMenu.save();
      }

      res.status(200).json({ message: "Product added to menu successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async updateProductInMenu(req, res) {
    const id = req.params.id;
    let new_image = "";

    try {
      const existingProduct = await Menu.findById(id);

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (req.file) {
        new_image = req.file.filename;
        // Remove the old image
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

  static async updateProductQuantityInMenu(req, res) {
    const id = req.params.id;
    try {
      const existingMenuProduct = await Menu.findById(id);
      if (!existingMenuProduct) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      // save current quantity in menu
      const oldQuantityInMenu = existingMenuProduct.quantity;

      if (req.body.quantity > oldQuantityInMenu) {
        const quantityDifference = req.body.quantity - oldQuantityInMenu;
        existingMenuProduct.quantity = req.body.quantity;
        await existingMenuProduct.save();
        // update quantity in inventory
        const existingInventoryProduct = await Product.findById(id);
        if (existingInventoryProduct) {
          existingInventoryProduct.quantity -= quantityDifference;
          await existingInventoryProduct.save();
        }
      } else if (req.body.quantity < oldQuantityInMenu) {
        const quantityDifference = oldQuantityInMenu - req.body.quantity;
        // update quantity in menu
        existingMenuProduct.quantity = req.body.quantity;
        await existingMenuProduct.save();

        // update quantity in inventory
        const existingInventoryProduct = await Product.findById(id);
        if (existingInventoryProduct) {
          existingInventoryProduct.quantity += quantityDifference;
          await existingInventoryProduct.save();
        }
      } else {
        // if quantity not change,  just update quantity in menu
        existingMenuProduct.quantity = req.body.quantity;
        await existingMenuProduct.save();
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async applyVoucher(req, res) {
    try {
      const { productId, discount } = req.body;
      // Validate inputs
      if (!productId || isNaN(discount)) {
        return res.status(400).json({ success: false, error: "Invalid input" });
      }
      // Update prices for items in the selected category
      await Menu.updateMany(
        { _id: { $in: productId } },
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
