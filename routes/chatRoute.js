const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
} = require('../controllers/chatController');

// Send a message
router.post('/message', sendMessage);

// Get chat history between two users
router.get('/history/:senderId/:receiverId', getChatHistory);

module.exports = router;
