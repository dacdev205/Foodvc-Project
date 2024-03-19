import axios from "axios";
const url = "http://localhost:3000/users"

export default class singleAPI {
    static async getSingleUserById(id){
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }
    static async getUserByEmail(email){
        const res = await axios.get(`${url}/getUserByEmail/${email}`);
        return res.data;
    }
    
}