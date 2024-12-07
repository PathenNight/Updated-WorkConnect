import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Message.css';

const Message = ({ senderID, recipientID }) => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [senderID, recipientID]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/messages/${senderID}/${recipientID}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        try {
            await axios.post('/api/messages/send', {
                senderID,
                recipientID,
                messageContents: messageContent,
            });
            setMessageContent('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = async (messageID) => {
        try {
            await axios.delete(`/api/messages/${messageID}`);
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="message-container">
            <div className="chat-box">
                {messages.map((msg) => (
                    <div
                        key={msg.messageID}
                        className={`message ${
                            msg.senderID === senderID ? 'message-user' : 'message-partner'
                        }`}
                    >
                        <p>{msg.messageContents}</p>
                        {msg.senderID === senderID && (
                            <button onClick={() => deleteMessage(msg.messageID)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>
            <form className="message-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Message;
