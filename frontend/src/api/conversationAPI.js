import axios from "axios";
const url = "http://localhost:3000/api/conversations";
const getToken = () => localStorage.getItem("access-token");

export default class categoryAPI {
  static async createConversation(data) {
    const token = getToken();
    const res = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getConversationsByUserId(userId) {
    const token = getToken();
    const res = await axios.get(`${url}/${userId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
