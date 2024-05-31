import axios from "axios";
const url = "http://localhost:3000/vouchers";

export default class voucherAPI {
  static async getVoucherById(id) {
    const res = await axios.get(`${url}/${id}`);
    return res.data;
  }
  static async getAllVoucher() {
    const res = await axios.get(url);
    return res.data;
  }
}
