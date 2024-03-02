import axios from "axios";
const url = "https://foodvc-server.onrender.com/check-out"

export default class paymentAPI {
  static async getAllPayment(email) {
    try {
      const res = await axios.get(`${url}?email=${email}`); 
      return res.data; 
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
    static async getProductToPayment(orderItem) {
      try {
        const productId = orderItem._id;
        const res = await axios.get(`${url}/${productId}`);
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    static async postProductToPayment(ItemBuyNow) {
      try {
          const res = await axios.post(url, ItemBuyNow);
          return res.data;
      } catch (error) {
        console.error('Error post item to Payment:', error);
        throw error;
      }
    }
  static async updateProduct(productId, updateData) {
    try {
      const res = await axios.patch(`${url}/${productId}`, updateData);
      return res.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
  static async deleteProduct(id){
    const res = await axios.delete(`${url}/${id}`);
    return res.data
  }
    
}