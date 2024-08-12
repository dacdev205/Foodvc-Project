import axios from "axios";
const url = "http://localhost:3000/adminStats";
const token = localStorage.getItem("access-token");

export default class statsAPI {
  static async getAllStats() {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async fetchSoldProducts(startDate, endDate) {
    try {
      const response = await axios.post(
        `${url}/products/sold`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { startDate: startDate, endDate: endDate },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static async fetchDataByYear(selectedYear) {
    try {
      const res = await axios.get(
        `${url}/${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          params: {
            year: selectedYear,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching data by year:", error);
      throw error;
    }
  }
  static async fetchDataByMonth(selectedYear, selectedMonth) {
    try {
      const res = await axios.get(
        `${url}/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          params: {
            year: selectedYear,
            month: selectedMonth,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching data by year:", error);
      throw error;
    }
  }
}
