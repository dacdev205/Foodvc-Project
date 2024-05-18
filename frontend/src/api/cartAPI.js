import axios from "axios";
const url = "http://localhost:3000/cart";

export default class cartAPI {
  static async getAllCart(email) {
    try {
      const res = await axios.get(`${url}?email=${email}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching cart by email:", error);
      throw error;
    }
  }
  static async getProductToCart(cartItem) {
    try {
      const productId = cartItem._id;
      const res = await axios.get(`${url}/${productId}`);
      return res.data;
    } catch (error) {
      console.error("Error getting product from cart:", error);
      throw error;
    }
  }

  static async postProductToCart(cartItem) {
    try {
      const existingProduct = await this.getProductToCart(cartItem);

      if (existingProduct && existingProduct._id) {
        const updatedQuantity = existingProduct.quantity + 1;
        await this.updateProduct(existingProduct._id, {
          quantity: updatedQuantity,
        });
      } else {
        const res = await axios.post(url, cartItem);
      }
      return cartItem;
    } catch (error) {
      console.error("Error adding/updating product to cart:", error);
      throw error;
    }
  }

  static async updateProduct(productId, updateData) {
    try {
      const res = await axios.patch(`${url}/${productId}`, updateData);
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async deleteProduct(id) {
    const res = await axios.delete(`${url}/${id}`);
    return res.data;
  }
}
