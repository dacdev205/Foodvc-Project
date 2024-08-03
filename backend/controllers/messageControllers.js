const Message = require("../models/message");
module.exports = class messageAPI {
  static async fetchMessageById(req, res) {
    try {
      const messages = await Message.find({
        conversationsId: req.params.conversationsId,
      });

      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async sendMessage(req, res) {
    const newMessage = new Message(req.body);
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json({ message: savedMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
