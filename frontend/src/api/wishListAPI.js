import axios from "axios";
const url = "http://localhost:3000/wish-list";
const getToken = () => localStorage.getItem("access-token");

export default class wishListAPI {
  static async getAllWishList(email) {
    try {
      const token = getToken();
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
  static async getWishStores(email) {
    try {
      const token = getToken();
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
      const token = getToken();
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
  static async getUserToWishList(userId) {
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:3000/wish-store/user/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error getting product from wish:", error);
      throw error;
    }
  }
  static async getShopToWishList(productId) {
    try {
      const token = getToken();
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
  static async addShopToWishList(wishItem) {
    try {
      const token = getToken();
      const res = await axios.post(
        `http://localhost:3000/wish-store`,
        wishItem,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error adding product to wish list:", error);
      throw error;
    }
  }
  static async addProductToWishList(wishItem) {
    try {
      const token = getToken();
      const res = await axios.post(url, wishItem, {
        headers: {
          authorization: `Bearer ${token}`,
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
    try {
      const token = getToken();
      const res = await axios.delete(`${url}/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
  static async deleteStore({ userId, shopId }) {
    try {
      const token = getToken();
      const res = await axios.delete(
        `http://localhost:3000/wish-store/${shopId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: { userId },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting shop from wishlist:", error);
      throw error;
    }
  }
}
