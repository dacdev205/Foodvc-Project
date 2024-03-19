import axios from "axios";
const url = "http://localhost:3000/api/messages"

export default class messageAPI {
    static async getAllMessages() {
        const res = await axios.get(url);
        return res.data;
    }
    static async addMessage(message) {
        const res = await axios.post(`${url}/send-message`, message);
        return res.data;
    }
    
    static async getChatWithId(chatId) {
        const res = await axios.get(`${url}/${chatId}`);
        return res.data;
    }
}