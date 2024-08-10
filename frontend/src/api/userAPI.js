import axios from "axios";
const url = "http://localhost:3000/users";
const token = localStorage.getItem("access-token");

export default class userAPI {
  static async getSingleUserById(id) {
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async updateUserProfile(userId, updateData) {
    try {
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
    const res = await axios.get(`${url}/roles/getAll`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getRoleById(roleId) {
    const res = await axios.get(`${url}/roles/role-detail/${roleId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async getUserByEmail(email) {
    const res = await axios.get(`${url}/getUserByEmail/${email}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
}
