const fs = require("fs");
const Product = require("../models/product");
const axios = require('axios');
const Menu = require("../models/menu");

module.exports = class productAPI {
  
      // fetch product by id
      static async fetchProductByID(req, res) {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    
  static async updateProduct(req, res) {
    const id = req.params.id;
    let new_image = "";
    
    try {
      const existingProduct = await Product.findById(id);
  
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
  
}