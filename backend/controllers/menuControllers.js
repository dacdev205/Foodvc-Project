const Menu = require("../models/menu");
const fs = require("fs");
const Inventory = require("../models/inventory");
const axios = require('axios');

module.exports = class menuAPI {
    //fetch all menu
    static async fetchAllMenu(req, res) {
        try {
            const menus = await Menu.find();
            res.status(200).json(menus);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    // fetch product by id
    static async fetchProductByID(req, res) {
        const id = req.params.id;
        try {
            const product = await Menu.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
  
      // create product
    static async createProduct(req, res) {
    try {
      const { productId, quantity } = req.body;
      const productInMenu = await Menu.findById(productId);
      if (!productInMenu) {
        const product = await Inventory.findById(productId);
        await Menu.create({
          _id: product._id,
          name: product.name,
          recipe: product.recipe,
          image: product.image,
          brand: product.brand,
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
    static async updateMenuQuantity(req, res) {
      try {
        const menuItemId = req.body.menuItemId;
        const newQuantity = req.body.quantity;
        const menuItem = await Menu.findById(menuItemId);
        if (!menuItem) {
          return res.status(404).json({ error: 'Menu item not found' });
        }
        menuItem.quantity = newQuantity;
        await menuItem.save();
        res.status(200).json({ message: "Menu quantity updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }

    static async updateProductInMenu(req, res) {
      const id = req.params.id;
      try {
        const existingMenuProduct = await Menu.findById(id);
        if (!existingMenuProduct) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        // save current quantity in menu
        const oldQuantityInMenu = existingMenuProduct.quantity;

        if (req.body.quantity > oldQuantityInMenu) { 
          const quantityDifference = req.body.quantity - oldQuantityInMenu;
          existingMenuProduct.quantity = req.body.quantity;
          await existingMenuProduct.save();
          // update quantity in inventory
          const existingInventoryProduct = await Inventory.findById(id);
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
          const existingInventoryProduct = await Inventory.findById(id);
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
        res.status(500).json({ message: 'Internal Server Error' });
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
        await Menu.updateMany({ _id: { $in: productId } }, { $mul: { price: 1 - discount / 100 } });
        res.status(200).json({ success: true, message: "Voucher applied successfully" });
      } catch (error) {
        console.error("Error applying voucher:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
      }
    }

}