import axios from "axios";
const url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2";
const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;

export default class ghnAPI {
  static async getAddressFOODVC(
    offset = 0,
    limit = 50,
    clientPhone = "0962034466"
  ) {
    try {
      const response = await axios.post(
        `${url}/shop/all`,
        {
          offset: offset,
          limit: limit,
          client_phone: clientPhone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Token: GHN_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  static async createOrder(payload) {
    try {
      const response = await axios.post(
        `${url}/shipping-order/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Token: GHN_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  static async cancelOrder(payload) {
    try {
      const response = await axios.post(
        `${url}/switch-status/cancel`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Token: GHN_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  static async getOrderDetailGHN(client_order_code) {
    try {
      const response = await axios.post(
        `${url}/shipping-order/detail-by-client-code`,
        client_order_code,
        {
          headers: {
            "Content-Type": "application/json",
            Token: GHN_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  static async printBillGHN(order_codes) {
    try {
      const response = await axios.post(`${url}/a5/gen-token`, order_codes, {
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
