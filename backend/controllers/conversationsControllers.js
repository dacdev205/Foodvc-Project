const Conversasions = require("../models/conversasions");

module.exports = class conversasionsAPI {
    
      static async createConversations (req, res) {
        const { senderId, receiverId } = req.body;
        const newConversations = new Conversasions({
          members: [senderId, receiverId],
        })
        try {
          const savedConversations = await newConversations.save();
          res.status(200).json(savedConversations)
        } catch (error) {
          res.status(500).json(error);
        }
      }

      static async getConversationsById(req, res) {
        try {
          const conversation = await Conversasions.find({
            members:{$in: [req.params.userId]}
          })
          res.status(200).json(conversation)
        } catch (error) {
          res.status(500).json(error)
        }
      }
}




