// components/Chat.js
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";
import MessageBubble from "./MessageBubble";

function Chat({ user, roomCode, onLogout, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Listen to messages in this room
  useEffect(() => {
    const q = query(
      collection(db, "rooms", roomCode, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomCode]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        // Always show header on mobile
        setShowHeader(true);
        return;
      }
      
      const currentScrollY = messagesContainerRef.current?.scrollTop || 0;
      const scrollDifference = currentScrollY - lastScrollY;
      
      if (scrollDifference < 0 || currentScrollY < 50) {
        // Scrolling up or at the top - show header
        setShowHeader(true);
      } else if (scrollDifference > 10 && currentScrollY > 50) {
        // Scrolling down significantly and past threshold - hide header
        setShowHeader(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY, isMobile]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "rooms", roomCode, "messages"), {
      text,
      uid: user.uid,
      username: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className={`chat-header ${showHeader ? 'visible' : 'hidden'}`}>
        <div className="chat-header-info">
          <div className="back-button">
            <button onClick={onLeave}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
          </div>

          <div className="room-info">
            <h2>{roomCode}</h2>
            <p>Online</p>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="icon-button" onClick={onLogout} title="Logout">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages" ref={messagesContainerRef}>
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </div>
              <p>Send a message to start the conversation</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} currentUid={user.uid} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="chat-input-container">
        <form onSubmit={sendMessage} className="message-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="message-input"
            />
            <button type="submit" className="send-button">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;