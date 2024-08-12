import axios from "axios";

const url = "http://localhost:3000/wish-list";

const getToken = () => localStorage.getItem("access-token");

export default class CartAPI {
  static async getAllWishList(email) {
    try {
      const token = getToken();
      const res = await axios.get(`${url}?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching wish by email:", error);
      throw error;
    }
  }

  static async getProductToWishList(productId) {
    try {
      const token = getToken();
      const res = await axios.get(`${url}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error getting product from wish:", error);
      throw error;
    }
  }

  static async addProductToWishList(wishItem) {
    try {
      const token = getToken();
      const res = await axios.post(url, wishItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error adding product to wish list:", error);
      throw error;
    }
  }

  static async updateProduct(productId, updateData) {
    try {
      const token = getToken();
      const res = await axios.put(`${url}/${productId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const token = getToken();
      const res = await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}
