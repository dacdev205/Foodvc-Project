import axios from "axios";
const url = "/inventory"

export default class inventoryAPI {
    static async getProductById(id){
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }
    static async getAllMenu(){
          const res = await axios.get(url);
        return res.data;
    }
    
    static async addProduct(product){
        const res = await axios.post(url, product);
        return res.data;
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
      
    static async deleteProductById(id){
        const res = await axios.delete(`${url}/${id}`);
        return res.data;
    }
}