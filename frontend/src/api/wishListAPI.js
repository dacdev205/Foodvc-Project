import axios from "axios";
const url = "http://localhost:3000/wish-list";
const token = localStorage.getItem("access-token");

export default class cartAPI {
  static async getAllWishList(email) {
    try {
      const res = await axios.get(`${url}?email=${email}`, {
        headers: {
          authorization: `Bearer ${token}`,
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
      const res = await axios.get(`${url}/${productId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error getting product from wish:", error);
      throw error;
    }
  }

  static async addProductToWishList(wishItem) {
    const res = await axios.post(url, wishItem, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async updateProduct(productId, updateData) {
    try {
      const res = await axios.put(`${url}/${productId}`, updateData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async deleteProduct(id) {
    const res = await axios.delete(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
