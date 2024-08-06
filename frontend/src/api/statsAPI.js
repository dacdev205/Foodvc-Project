import axios from "axios";
const url = "http://localhost:3000/adminStats";
const token = localStorage.getItem("access-token");

export default class statsAPI {
  static async getAllStats() {
    const res = await axios.get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  static async fetchDataByYear(selectedYear) {
    try {
      const res = await axios.get(
        `${url}/${selectedYear}`,
        {
          params: {
            year: selectedYear,
          },
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
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
          params: {
            year: selectedYear,
            month: selectedMonth,
          },
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
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
