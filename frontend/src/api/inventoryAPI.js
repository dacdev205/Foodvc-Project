import axios from "axios";
const url = "http://localhost:3000/inventory";
const getToken = () => localStorage.getItem("access-token");

export default class inventoryAPI {
  static async getProductById(id, shopId) {
    const token = getToken();

    const res = await axios.get(`${url}/${id}/${shopId}`);

    return res.data;
  }
  static async getAllMenu() {
    const token = getToken();

    const res = await axios.get(url);
    return res.data;
  }

  static async addProduct(data) {
    const token = getToken();
    const res = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async updateProduct(productId, shopId, updateData) {
    const token = getToken();
    try {
      const res = await axios.patch(
        `${url}/${productId}/${shopId}`,
        updateData
      );
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async deleteProductById(id, shopId) {
    const token = getToken();

    const res = await axios.delete(`${url}/${id}/${shopId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
