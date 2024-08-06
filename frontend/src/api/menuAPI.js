import axios from "axios";
const url = "http://localhost:3000/api/foodvc";
const token = localStorage.getItem("access-token");

export default class menuAPI {
  static async getProductById(id) {
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getAllMenu() {
    const res = await axios.get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async addProduct(product) {
    const res = await axios.post(url, product, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async updateQuantityProduct(productId, updateData) {
    try {
      const res = await axios.patch(
        `${url}/quantity/${productId}`,
        updateData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async updateProduct(productId, updateData) {
    try {
      const res = await axios.patch(`${url}/${productId}`, updateData, {
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
  static async deleteProductById(id) {
    const res = await axios.delete(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
