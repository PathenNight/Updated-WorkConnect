const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Send a new message
router.post('/send', messageController.sendMessage);

// Get messages between two users
router.get('/:senderID/:recipientID', messageController.getMessages);

// Delete a message by ID
router.delete('/:messageID', messageController.deleteMessage);

module.exports = router;
