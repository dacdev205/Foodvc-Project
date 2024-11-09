const Cart = require("../models/cart");
const Product = require("../models/product");
const mongoose = require("mongoose");

module.exports = class cartAPI {
  static async fetchAllProductsByUserId(req, res) {
    try {
      const userId = req.params.id;
      const cart = await Cart.findOne({ userId }).populate({
        path: "products.productId",
        populate: {
          path: "shopId",
        },
      });

      if (cart) {
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async postProductToCart(req, res) {
    try {
      const { userId, productId, quantity } = req.body;
      let cart = await Cart.findOne({ userId });

      if (cart) {
        let itemIndex = cart.products.findIndex(
          (p) => p.productId.toString() === productId
        );

        if (itemIndex > -1) {
          cart.products[itemIndex].quantity += quantity;
        } else {
          cart.products.push({
            productId,
            quantity,
          });
        }
      } else {
        cart = new Cart({
          userId,
          products: [
            {
              productId,
              quantity,
            },
          ],
        });
      }
      let totalAmount = 0;
      for (let item of cart.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          totalAmount += item.quantity * product.price;
        }
      }
      cart.totalAmount = totalAmount;

      cart = await cart.save();
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async fetchProductInCartByID(req, res) {
    const { userId, productId } = req.params;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      const product = cart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (!product) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không có trong giỏ hàng" });
      }

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update product quantity in cart
  static async updateProductInCart(req, res) {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const updateData = req.body;

    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      const productIndex = cart.products.findIndex(
        (p) => p.productId._id.toString() === productId
      );

      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không có trong giỏ hàng" });
      }

      if (updateData.quantity) {
        cart.products[productIndex].quantity = Number(updateData.quantity);
      }

      await cart.save();

      res.json(cart);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật sản phẩm trong giỏ hàng" });
    }
  }
  static async clearCart(req, res) {
    const { userId } = req.body;
    try {
      await Cart.deleteMany({ userId: userId });
      res.status(200).json({ message: "Giỏ hàng đã được xóa thành công." });
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      res.status(500).json({ message: "Có lỗi xảy ra khi xóa giỏ hàng." });
    }
  }
  static async deleteProductInCart(req, res) {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid cart ID" });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
      const updateResult = await Cart.findByIdAndUpdate(
        cartId,
        { $pull: { products: { productId } } },
        { new: true, useFindAndModify: false }
      );

      if (!updateResult) {
        return res
          .status(404)
          .json({ message: "Giỏ hàng hoặc sản phẩm không tìm thấy" });
      }

      if (updateResult.products.length === 0) {
        await Cart.findByIdAndDelete(cartId);
        return res
          .status(200)
          .json({ message: "Giỏ hàng được xóa thành công" });
      }

      res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
