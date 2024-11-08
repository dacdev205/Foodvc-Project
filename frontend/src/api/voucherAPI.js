import axios from "axios";
const url = "http://localhost:3000/vouchers";
const getToken = () => localStorage.getItem("access-token");

export default class voucherAPI {
  static async getVoucherById(id) {
    const token = getToken();
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getAllVoucher(
    shopId,
    {
      page = 1,
      limit = 10,
      search = "",
      status,
      expiredBefore,
      expiredAfter,
      quantity,
    }
  ) {
    const token = getToken();

    const params = {
      page,
      limit,
      search,
      status,
      expiredBefore,
      expiredAfter,
      quantity,
    };

    try {
      const res = await axios.get(`${url}/${shopId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params,
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  }
  static async getVoucher4User(shopId) {
    const token = getToken();

    try {
      const res = await axios.get(`${url}/user/${shopId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  }
  static async createVoucher(data) {
    const token = getToken();
    const res = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async updateVoucher(voucherId, updateData) {
    try {
      const token = getToken();
      const res = await axios.patch(`${url}/${voucherId}`, updateData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async updateQuantityVoucher(voucherId, updateData) {
    try {
      const token = getToken();
      const res = await axios.patch(
        `${url}/update-quantity/${voucherId}`,
        updateData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async deleteVoucher(id) {
    try {
      const token = getToken();
      const res = await axios.delete(`${url}/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}
