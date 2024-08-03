import axios from "axios";
const url = "http://localhost:3000/order";
const urlStatus = "http://localhost:3000";
export default class orderAPI {
  static async postProductToOrder(orderItem) {
    try {
      const res = await axios.post(url, orderItem);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getUserOrders(userId) {
    try {
      const res = await axios.get(
        `http://localhost:3000/order/order-user/${userId}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getAllStatuses() {
    try {
      const response = await axios.get(`${urlStatus}/statuses`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      return [];
    }
  }

  static async getOrderById(id) {
    const res = await axios.get(`${url}/${id}`);
    return res.data;
  }
  static async getAllOrder() {
    const res = await axios.get(`http://localhost:3000/order/allOrder`);
    return res.data;
  }
  static async updateOrderStatus(orderId, statusId) {
    try {
      const res = await axios.patch(`${url}/${orderId}`, { statusId });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //   static async deleteProduct(id){
  //     const res = await axios.delete(`${url}/${id}`);
  //     return res.data
  //   }
}
