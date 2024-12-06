const Message = require('../models/Message');

// Send a message
const sendMessage = async (req, res) => {
    const { senderID, recipientID, messageContents } = req.body;

    try {
        const message = new Message(senderID, recipientID, messageContents);
        await message.save();
        res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message.' });
    }
};

// Get messages between two users
const getMessages = async (req, res) => {
    const { senderID, recipientID } = req.params;

    try {
        const messages = await Message.getMessages(senderID, recipientID);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages.' });
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    const { messageID } = req.params;

    try {
        await Message.deleteMessage(messageID);
        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message.' });
    }
};

module.exports = { sendMessage, getMessages, deleteMessage };
