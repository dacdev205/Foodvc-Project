import axios from "axios";
const url = "http://localhost:3000/check-out";
const getToken = () => localStorage.getItem("access-token");

export default class paymentAPI {
  static async getAllPayment(email) {
    const token = getToken();
    try {
      const res = await axios.get(`${url}?email=${email}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getProductToPayment(orderItem) {
    const token = getToken();
    try {
      const productId = orderItem._id;
      const res = await axios.get(`${url}/${productId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async postProductToPayment(ItemBuyNow) {
    const token = getToken();
    try {
      const res = await axios.post(url, ItemBuyNow, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error post item to Payment:", error);
      throw error;
    }
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
  static async deleteProduct(id) {
    const token = getToken();
    const res = await axios.delete(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
