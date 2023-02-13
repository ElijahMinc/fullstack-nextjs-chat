const MessageModel = require('../models/message-model');

class MessageController {
  async addMessage(req, res) {
    const { chatId, senderId, text } = req.body;
    console.log({ chatId, senderId, text });
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getMessages(req, res) {
    const { chatId } = req.params;
    try {
      const result = await MessageModel.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new MessageController();
