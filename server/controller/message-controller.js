const MessageModel = require('../models/message-model');
const ChatModel = require('../models/chat-model');

class MessageController {
  async addMessage(req, res) {
    const { chatId: chatIdFromBody, senderId, receiverId, text } = req.body;
    console.log('chatIdFromBody', chatIdFromBody);
    let chatId = await ChatModel.findById(chatIdFromBody);

    let isNewChatCreated = false;

    if (!chatId) {
      const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId],
      });

      await newChat.save();
      chatId = newChat._id;
      console.log('newChat', newChat);
      isNewChatCreated = true;
    }
    console.log('chatId', chatId);
    const createdMessage = new MessageModel({
      chatId,
      senderId,
      receiverId,
      text,
    });
    try {
      const message = await createdMessage.save();
      res.status(200).json({ message, isNewChatCreated });
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
