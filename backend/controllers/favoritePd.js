const WishList = require("../models/favoritePd");
module.exports = class favoritePdAPI {
    //fetch all product
    static async fetchAllWishListProductWithEmail(req, res) {
        try {
            const email = req.query.email;
            const wishList = await WishList.find({email: email});
            if(wishList) {
                res.status(200).json(wishList);
            } else {
                res.status(404).json({message: 'Product not found'})
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    //create prduct 
    static async postProductToWistLish(req, res) {
        const wishItem = req.body;
        try {
            await WishList.create(wishItem);
            res.status(201).json(wishItem);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }

       // fetch product by id
    static async fetchProductWishListByID(req, res) {
        const id = req.params.id;
        try {
            const product = await Cart.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    //update product in wish list
    static async updateProductWishList(req, res) {
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
              res.status(500).json({ message: 'Error to update existing product', error});
            }
    }
    static async deleteProductInWishList(req, res) {
        const id = req.params.id;
        try {
            await WishList.findByIdAndDelete(id);
            res.status(200).json({message: "Product deteted succesfully"});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }    
}