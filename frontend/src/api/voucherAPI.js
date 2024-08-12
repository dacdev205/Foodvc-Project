import axios from "axios";
const url = "http://localhost:3000/vouchers";
const token = localStorage.getItem("access-token");

export default class voucherAPI {
  static async getVoucherById(id) {
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getAllVoucher() {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async createVoucher(data) {
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
