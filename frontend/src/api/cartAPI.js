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
      const productId = cartItem.productId;
      const res = await axios.get(`${url}/${productId}`);
      return res.data;
    } catch (error) {
      console.error("Error getting product from cart:", error);
      throw error;
    }
  }

  static async updateProduct(cartId, productId, updateData) {
    try {
      const res = await axios.patch(
        `${url}/${cartId}/product/${productId}`,
        updateData
      );
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async deleteProduct(cartId, id) {
    try {
      const res = await axios.delete(`${url}/${cartId}/product/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}
