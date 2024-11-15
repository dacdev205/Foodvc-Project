import axios from "axios";
const url = "http://localhost:3000/category";
const getToken = () => localStorage.getItem("access-token");

export default class categoryAPI {
  static async getCategoryById(id) {
    const token = getToken();
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async deleteCategoryById(id) {
    const token = getToken();
    const res = await axios.delete(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getAllCategory(searchTerm = "", page = 1, limit = 20) {
    const token = getToken();
    const res = await axios.get(`${url}/get-all`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        searchTerm,
        page,
        limit,
      },
    });
    return res.data;
  }

  static async createCategory(data) {
    const token = getToken();
    const res = await axios.post(`${url}/create_category`, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async updateCategory(id, data) {
    const token = getToken();
    const res = await axios.put(`${url}/${id}`, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
