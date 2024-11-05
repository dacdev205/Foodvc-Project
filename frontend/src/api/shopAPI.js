import axios from "axios";
const url = "http://localhost:3000/shop";
const getToken = () => localStorage.getItem("access-token");

export default class shopAPI {
  static async updateShop(shopId, updatedData) {
    const token = getToken();
    const response = await axios.patch(`${url}/update/${shopId}`, updatedData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}
