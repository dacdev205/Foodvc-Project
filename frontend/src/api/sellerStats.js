import axios from "axios";
const url = "http://localhost:3000/sellerStats";
const getToken = () => localStorage.getItem("access-token");

export default class sellerStats {
  static async getAllStats(shopId) {
    const token = getToken();
    const res = await axios.get(`${url}/${shopId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async fetchSoldProducts(shopId, startDate, endDate) {
    try {
      const token = getToken();
      const response = await axios.post(
        `${url}/${shopId}/products/sold`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { startDate, endDate },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static async fetchDataByYear(shopId, selectedYear) {
    try {
      const token = getToken();
      const res = await axios.get(`${url}/${shopId}/${selectedYear}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching data by year:", error);
      throw error;
    }
  }

  static async fetchDataByMonth(shopId, selectedYear, selectedMonth) {
    try {
      const token = getToken();
      const res = await axios.get(
        `${url}/${shopId}/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching data by month:", error);
      throw error;
    }
  }
}
