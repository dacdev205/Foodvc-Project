const Message = require('../models/message');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
module.exports = class messageAPI {
    static async fetchAllMessages(req, res) {
        try {
            const messages = await Message.find();
            res.status(200).json(messages);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    static async fetchMessageById(req, res) {
        try {
            const chatId = req.params.chatId;
            const message = await Message.find({ chatId: chatId });

            res.status(200).json(message);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    
    static async sendMessage(req, res) {
        try {
            const { sender, content, receivers } = req.body;
            let chatId = req.body.chatId;
            if (!chatId) {
                chatId = new ObjectId();
            }
            const message = await Message.create({ chatId, sender, receivers, content });
    
            res.status(201).json({ message: 'Message sent successfully', data: message });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
    
    
};
