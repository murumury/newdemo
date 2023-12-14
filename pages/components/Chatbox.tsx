import React, { useState, useEffect } from 'react';

const ChatBox = ({ channel, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Listen for new messages
  useEffect(() => {
    const handleMessage = (message, senderId) => {
      if (senderId !== userId) {
        setMessages((prevMessages) => [...prevMessages, { message, senderId }]);
      }
    };

    // Subscribe to message events
    channel?.on('message', handleMessage);

    return () => {
      // Unsubscribe from message events
      channel?.off('message', handleMessage);
    };
  }, [channel, userId]);

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    channel?.say('message', newMessage);
    setMessages([...messages, { message: newMessage, senderId: userId }]);
    setNewMessage('');
  };
console.log(channel)
  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index} className={msg.senderId === userId ? 'sent' : 'received'}>
            {msg.senderId === userId ? 'You' : msg.senderId}: {msg.message}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;