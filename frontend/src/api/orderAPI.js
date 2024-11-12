import axios from "axios";
const url = "http://localhost:3000/order";
const urlStatus = "http://localhost:3000";
const getToken = () => localStorage.getItem("access-token");

export default class orderAPI {
  static async postProductToOrder(orderItem) {
    const token = getToken();

    try {
      const res = await axios.post(url, orderItem, {
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
  static async getUserOrders(userId) {
    const token = getToken();

    try {
      const res = await axios.get(
        `http://localhost:3000/order/order-user/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getAllStatuses() {
    const token = getToken();

    try {
      const response = await axios.get(`${urlStatus}/statuses`, {
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

  static async getOrderById(id) {
    const token = getToken();

    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getAllOrder(
    searchTerm = "",
    searchStatus = "",
    page = 1,
    limit = 5,
    shopId
  ) {
    const token = getToken();

    try {
      const res = await axios.get(`${url}/allOrder`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          searchStatus,
          page,
          limit,
          shopId,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
  static async getAllOrderAdmin(
    searchTerm = "",
    searchStatus = "",
    page = 1,
    limit = 5
  ) {
    const token = getToken();

    try {
      const res = await axios.get(`${url}/allOrder/admin`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          searchStatus,
          page,
          limit,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
  static async updateOrderStatus(orderId, statusId) {
    const token = getToken();

    try {
      const res = await axios.patch(
        `${url}/${orderId}`,
        { statusId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async adminGetOrders(
    searchTerm = "",
    searchStatus = "",
    page = 1,
    limit = 5
  ) {
    const token = getToken();

    try {
      const res = await axios.get(`${url}/allOrder/admin`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          searchStatus,
          page,
          limit,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      throw error;
    }
  }
  static async addOrderRequest(orderId, orderRequestId) {
    const token = getToken();

    try {
      const res = await axios.patch(
        `${url}/${orderId}/add-order-request`,
        { orderRequestId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async cancelOrder(orderId, cancelReason) {
    const token = getToken();

    try {
      const res = await axios.patch(
        `${url}/cancel-order`,
        {
          orderId,
          reason: cancelReason,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  }
}
//   static async deleteProduct(id){
//     const res = await axios.delete(`${url}/${id}`);
//     return res.data
//   }
