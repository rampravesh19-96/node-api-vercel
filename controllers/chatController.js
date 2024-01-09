const Chat = require('../models/chatModel');

  const sendMessage= async (req, res) => {
    try {
      // Assuming sender ID, receiver ID, and message text are sent in the request body
      const { senderId, receiverId, message } = req.body;

      const newMessage = new Chat({
        sender: senderId,
        receiver: receiverId,
        message,
      });

      const sentMessage = await newMessage.save();

      return res.status(201).json({ message: sentMessage });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  const getChatHistory= async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;

      const chatHistory = await Chat.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      }).sort({ createdAt: 1 });

      return res.status(200).json({ chatHistory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }


module.exports = {sendMessage,getChatHistory};
