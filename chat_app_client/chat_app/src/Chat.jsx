// Chat.js
import React, { useState } from "react";

function Chat({ selectedUser, onMessageSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    onMessageSend(message);
    setMessage("");
  };

  return (
    <div className="chat">
      <h2>Chat with {selectedUser.username}</h2>
      <div className="messages-container">
        {/* Messages go here */}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Chat;
