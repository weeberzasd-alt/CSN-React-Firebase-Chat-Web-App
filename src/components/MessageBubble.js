// components/MessageBubble.js
import React from "react";

function MessageBubble({ msg, currentUid }) {
  const isOwnMessage = msg.uid === currentUid;
  const timestamp = msg.createdAt?.toDate ? msg.createdAt.toDate() : new Date();

  return (
    <div className={`message ${isOwnMessage ? "message-sent" : "message-received"}`}>
      <div className="message-bubble">
        {!isOwnMessage && (
          <div className="message-sender">{msg.username}</div>
        )}
        <div className="message-text">{msg.text}</div>
        <div className="message-time">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;