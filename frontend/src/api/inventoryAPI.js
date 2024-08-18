import axios from "axios";
const url = "http://localhost:3000/inventory";
const getToken = () => localStorage.getItem("access-token");

export default class inventoryAPI {
  static async getProductById(id) {
    const token = getToken();

    const res = await axios.get(`${url}/${id}`);
    return res.data;
  }
  static async getAllMenu() {
    const token = getToken();

    const res = await axios.get(url);
    return res.data;
  }

  static async addProduct(product) {
    const token = getToken();
    const res = await axios.post(url, product, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async updateProduct(productId, updateData) {
    const token = getToken();
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
    const token = getToken();

    const res = await axios.delete(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
