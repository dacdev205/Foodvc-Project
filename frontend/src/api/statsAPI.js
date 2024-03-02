import axios from "axios";
const url = "https://foodvc-server.onrender.com/adminStats"

export default class statsAPI {
    static async getAllStats(){
        const res = await axios.get(url);
        return res.data;
    }
    static async fetchDataByYear(selectedYear) {
        try {
            const res = await axios.get(`${url}/${selectedYear}`, {
                params: {
                    year: selectedYear
                }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching data by year:", error);
            throw error;
        }
    }
    static async fetchDataByMonth(selectedYear, selectedMonth) {
        try {
            const res = await axios.get(`${url}/${selectedYear}/${selectedMonth}`, {
                params: {
                    year: selectedYear,
                    month: selectedMonth
                }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching data by year:", error);
            throw error;
        }
    }
}