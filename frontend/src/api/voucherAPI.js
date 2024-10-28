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
  static async getAllVoucher(shopId) {
    const token = getToken();
    const res = await axios.get(`${url}/${shopId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
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
}
