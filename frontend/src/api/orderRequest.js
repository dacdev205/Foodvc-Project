import axios from "axios";
const url = "http://localhost:3000/order-request";
const getToken = () => localStorage.getItem("access-token");

export default class orderRequestAPI {
  static async getAllCancelReq(searchTerm = "", page = 1, limit = 5, shopId) {
    const token = getToken();
    try {
      const response = await axios.get(`${url}/all-requests`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: { searchTerm, page, limit, shopId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      return [];
    }
  }
  static async getCancelReqById(order_rq_id) {
    const token = getToken();
    try {
      const response = await axios.get(`${url}/cancel-request/${order_rq_id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      return [];
    }
  }
  static async updateRequest(order_rq_id, status) {
    const token = getToken();
    try {
      const response = await axios.put(
        `${url}/cancel-request/${order_rq_id}`,
        status,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      return [];
    }
  }
  static async createReq(payload) {
    const token = getToken();
    try {
      const response = await axios.post(`${url}/cancel-request`, payload, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      return { error: error.message };
    }
  }
}
