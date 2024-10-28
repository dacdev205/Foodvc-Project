import axios from "axios";
const url = "http://localhost:3000/users";
const getToken = () => localStorage.getItem("access-token");

export default class userAPI {
  static async getSingleUserById(id) {
    const token = getToken();
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getUserRank(id) {
    const token = getToken();
    const res = await axios.get(`${url}/ranking/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async updateUserProfile(userId, updateData) {
    try {
      const token = getToken();
      const res = await axios.patch(`${url}/${userId}`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
  static async getAllRoles() {
    const token = getToken();
    const res = await axios.get(`${url}/roles/getAll`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getRoleById(roleId) {
    const token = getToken();
    const res = await axios.get(`${url}/roles/role-detail/${roleId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getUserByEmail(email) {
    const token = getToken();
    const res = await axios.get(`${url}/getUserByEmail/${email}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
