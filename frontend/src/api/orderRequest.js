import axios from "axios";
const url = "http://localhost:3000/order-request";
const token = localStorage.getItem("access-token");

export default class orderRequestAPI {
  static async getAllCancelReq(searchTerm = "", page = 1, limit = 5) {
    try {
      const response = await axios.get(`${url}/all-requests`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: { searchTerm, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      return [];
    }
  }
}
