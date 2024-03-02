import axios from "axios";
const url = "https://foodvc-server.onrender.com/order"

export default class orderAPI {
  static async getAllOrderWithEmail(email) {
    try {
      const res = await axios.get(`${url}?email=${email}`); 
      return res.data; 
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
    static async postProductToOrder(orderItem) {
      try {
          const res = await axios.post(url, orderItem);
          return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    static async getUserOrders(userUid) {
      try {
        const userId = userUid;
        const res = await axios.get(`https://foodvc-server.onrender.com/order/order-user/${userId}`);
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    static async getOrderById(id){
      const res = await axios.get(`${url}/${id}`);
      return res.data;
  }
  static async getAllOrder () {
    const res = await axios.get(`https://foodvc-server.onrender.com/order/allOrder`);
    return res.data;
  }
  static async updateOrderStatus(orderId, status) {
    try {
      const res = await axios.patch(`${url}/${orderId}`, { status });
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