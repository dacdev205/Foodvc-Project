import axios from "axios";
const url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2";

export default class ghnAPI {
  static async getShopById(client_phone, shopId, GHNToken) {
    try {
      const response = await fetch(`${url}/shop/all`, {
        method: "POST",
        headers: {
          Token: GHNToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ client_phone }),
      });

      const data = await response.json();

      if (data.code === 200) {
        const shop = data.data.shops.find((shop) => shop._id === shopId);
        return shop || null;
      } else {
        throw new Error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  }

  static async createOrder(payload, token) {
    try {
      const response = await axios.post(
        `${url}/shipping-order/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Token: token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  static async getLeadtime(payload, shopId, token) {
    try {
      const response = await axios.post(
        `${url}/shipping-order/leadtime`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
            shopId: shopId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  static async cancelOrder({ order_codes, token, shopId }) {
    try {
      const response = await axios.post(
        `${url}/switch-status/cancel`,
        { order_codes },
        {
          headers: {
            "Content-Type": "application/json",
            Token: token,
            ShopId: shopId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in cancelOrder:", error.message);
      throw error;
    }
  }

  static async getOrderDetailGHN({ Token, client_order_code }) {
    try {
      const response = await axios.post(
        `${url}/shipping-order/detail-by-client-code`,
        { client_order_code },
        {
          headers: {
            "Content-Type": "application/json",
            Token: Token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching order details:", error.message);
      throw error;
    }
  }

  static async printBillGHN(order_codes, token) {
    try {
      const response = await axios.post(
        `${url}/a5/gen-token`,
        { order_codes },
        {
          headers: {
            "Content-Type": "application/json",
            Token: token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  static async createShop(shopInfo) {
    try {
      const response = await axios.post(`${url}/shop/register`, shopInfo, {
        headers: {
          "Content-Type": "application/json",
          Token: shopInfo.token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
