const Cart = require("../models/cart");
const Product = require("../models/product");
module.exports = class cartAPI {
  static async fetchAllProductsByUserId(req, res) {
    try {
      const userId = req.params.id;
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId"
      );

      if (cart) {
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Cart not found" });
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
      // Calculate total amount
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

  // Fetch product in cart by productId
  static async fetchProductInCartByID(req, res) {
    const { userId, productId } = req.params;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const product = cart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found in cart" });
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
        return res.status(404).json({ message: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
        (p) => p.productId._id.toString() === productId
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      if (updateData.quantity) {
        cart.products[productIndex].quantity = Number(updateData.quantity);
      }

      await cart.save();

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error updating product in cart" });
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

    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      cart.products.splice(productIndex, 1);

      if (cart.products.length === 0) {
        await Cart.findByIdAndDelete(cartId);
        return res.status(200).json({ message: "Cart deleted successfully" });
      }

      await cart.save();

      res
        .status(200)
        .json({ message: "Product removed from cart successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
