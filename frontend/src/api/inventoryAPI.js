import axios from "axios";
const url = "http://localhost:3000/inventory";
const token = localStorage.getItem("access-token");

export default class inventoryAPI {
  static async getProductById(id) {
    const res = await axios.get(`${url}/${id}`);
    return res.data;
  }
  static async getAllMenu() {
    const res = await axios.get(url);
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
