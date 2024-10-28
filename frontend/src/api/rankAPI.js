import axios from "axios";
const url = "http://localhost:3000/rank/add-point";
const getToken = () => localStorage.getItem("access-token");

export default class rankAPI {
  static async addPoint(data) {
    const token = getToken();
    const res = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
