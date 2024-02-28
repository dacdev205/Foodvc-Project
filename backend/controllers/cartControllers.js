const Cart = require("../models/cart");
const fs = require("fs");
const axios = require("axios");
const cart = require("../models/cart");
module.exports = class cartAPI {
    //fetch all product
    static async fetchAllProductWithEmail(req, res) {
        try {
            const email = req.query.email;
            const carts = await Cart.find({email: email});
            if(carts) {
                res.status(200).json(carts);
            } else {
                res.status(404).json({message: 'Product not found'})
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    //create prduct 
    static async postProductToCart(req, res) {
        const product = req.body;
        try {
            await Cart.create(product);
            res.status(201).json(product);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }

       // fetch product by id
    static async fetchProductInCartByID(req, res) {
        const id = req.params.id;
        try {
            const product = await Cart.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    //update product by id
    static async updateProductInCart(req, res) {
            const productId = req.params.id;
            const updateData = req.body;
          
            try {
              const existingProduct = await Cart.findById(productId);
          
              if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found' });
              }
          
              if (updateData.quantity) {
                updateData.quantity = Number(updateData.quantity);
              }
          
              existingProduct.set(updateData);
              await existingProduct.save();
          
              res.json(existingProduct);
            } catch (error) {
              res.status(500).json({ message: 'Error to update product' });
            }
    }
    //delete product in cart
    static async deleteProductInCart(req, res) {
        const id = req.params.id;
        try {
            await Cart.findByIdAndDelete(id);
            res.status(200).json({message: "Product deteted succesfully"});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }    
}