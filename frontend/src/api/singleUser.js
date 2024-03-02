import axios from "axios";
const url = "https://foodvc-server.onrender.com/users"

export default class singleAPI {
    static async getSingleUserById(id){
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }
    
}