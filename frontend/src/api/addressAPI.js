import axios from "axios";
const url = "https://foodvc-server.onrender.com/address"

export default class addressAPI {


    static async postAddressToDB(address) {
      try {
          const res = await axios.post(url, address);
          return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  static async updateAddressInDB(productId, updateData) {
    try {
      const res = await axios.patch(`${url}/${productId}`, updateData);
      return res.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
//   static async deleteProduct(id){
//     const res = await axios.delete(`${url}/${id}`);
//     return res.data
//   }
    
}