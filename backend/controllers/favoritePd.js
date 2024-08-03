const WishList = require("../models/favoritePd");
module.exports = class FavoritePdAPI {
  static async fetchAllWishListProductWithUserId(req, res) {
    try {
      const userId = req.params.userId;

      const wishList = await WishList.find({ userId }).populate("product");
      if (wishList.length > 0) {
        res.status(200).json(wishList);
      } else {
        res
          .status(404)
          .json({ message: "No products found in the wishlist for this user" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Add product to wishlist
  static async postProductToWishList(req, res) {
    const { userId, product } = req.body;
    try {
      const wishItem = new WishList({ userId, product });
      await wishItem.save();
      res.status(201).json(wishItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Fetch a wishlist product by its product ID
  static async fetchProductWishListByProductId(req, res) {
    const productId = req.params.productId;
    try {
      const wishItem = await WishList.findOne({ product: productId }).populate(
        "product"
      );
      if (wishItem) {
        res.status(200).json(wishItem);
      } else {
        res.status(404).json({ message: "Product not found in wishlist" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update a wishlist product
  static async updateProductWishList(req, res) {
    const id = req.params.id;
    const updateData = req.body;
    try {
      const existingWishItem = await WishList.findById(id);
      if (!existingWishItem) {
        return res
          .status(404)
          .json({ message: "Product not found in wishlist" });
      }
      existingWishItem.set(updateData);
      await existingWishItem.save();
      res.json(existingWishItem);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating wishlist product", error: err });
    }
  }

  // Remove a product from wishlist
  static async deleteProductInWishList(req, res) {
    const id = req.params.id;
    try {
      await WishList.findByIdAndDelete(id);
      res
        .status(200)
        .json({ message: "Product deleted successfully from wishlist" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
