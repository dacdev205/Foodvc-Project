import axios from "axios";
const url = "http://localhost:3000/adminStats"

export default class statsAPI {
    static async getAllStats(){
        const res = await axios.get(url);
        return res.data;
    }
    
}