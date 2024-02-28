const Inventory = require("../models/inventory");
const fs = require("fs");
const axios = require('axios');
const Menu = require("../models/menu");
module.exports = class inventoryAPI {
    //fetch all menu
    static async fetchAllInventory(req, res) {
        try {
            const inventorys = await Inventory.find();
            res.status(200).json(inventorys);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
      // fetch product by id
      static async fetchProductByID(req, res) {
        const id = req.params.id;
        try {
            const product = await Inventory.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    //create prduct 
    static async createProductInInventory(req, res) {
        const product = req.body;
        const imagename =req.file.filename;
        product.image = imagename;
        try {
            await Inventory.create(product);
            res.status(201).json({message: "Product created successfully"});
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }
    // post product to menu
    static async postProductToMenu(req, res) {
      try {
        const { productId, quantity } = req.body;
        const productInInventory = await Inventory.findById(productId);
        productInInventory.quantity -= quantity;
        await productInInventory.save();
        await axios.post("http://localhost:3000/api/foodvc/add-to-menu", {
          productId,
          quantity,
        });
    
        res.status(200).json({ message: "Product transferred successfully" });
      } catch (error) {
        console.error("Error transferring product:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  }
    
  static async updateProductInInventory(req, res) {
    const id = req.params.id;
    let new_image = "";
    
    try {
      const existingProduct = await Inventory.findById(id);
  
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
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
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    static async removeProductFromMenu (req, res) {
        try {
            const { menuItemId } = req.body;
            const menuItem = await Menu.findById(menuItemId);
        
            if (!menuItem) {
              return res.status(404).json({ message: "Product not found in menu" });
            }
            const productInInventory = await Inventory.findById(menuItem._id);
            productInInventory.quantity += menuItem.quantity;
            await productInInventory.save();
            await menuItem.remove();
        
            res.status(200).json({ message: "Product removed from menu successfully" });
          } catch (error) {
            console.error("Error removing product from menu:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
    }

    static async deleteProductFromInventory(req, res) {
      const id = req.params.id;
      try {
          const productInMenu = await Menu.findById(id);
          if (productInMenu) {
              const imgItemMenu = await Menu.findByIdAndDelete(id);
              if(imgItemMenu.image !="") {
                try {
                    fs.unlinkSync("./uploads/" + imgItemMenu.image);
                } catch (err) {
                    console.log(err)
                }
            }
          }
          const imgItemInventory = await Inventory.findByIdAndDelete(id);
          if(imgItemInventory.image !="") {
            try {
                fs.unlinkSync("./uploads/" + imgItemInventory.image);
            } catch (err) {
                console.log(err)
            }
        }
          
          res.status(200).json({message: "Product deleted successfully"});
      } catch (err) {
          res.status(500).json({message: err.message});
      }
      
  }
  
}