// components/ChatRoom.js
import React, { useState } from "react";
import { db } from "../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Chat from "./Chat";

function ChatRoom({ user, onLogout }) {
  const [roomCode, setRoomCode] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);

  // Create a new room
  const createRoom = async () => {
    if (!roomCode) return alert("Enter a room code");

    await setDoc(doc(db, "rooms", roomCode), {
      createdBy: user.uid,
      createdAt: new Date(),
    });

    setActiveRoom(roomCode);
  };

  // Join an existing room
  const joinRoom = async () => {
    if (!roomCode) return alert("Enter a room code");

    const roomRef = doc(db, "rooms", roomCode);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      setActiveRoom(roomCode);
    } else {
      alert("Room does not exist");
    }
  };

  if (activeRoom) {
    return (
      <Chat
        user={user}
        roomCode={activeRoom}
        onLeave={() => setActiveRoom(null)} // Pass leave callback
        onLogout={onLogout}
      />
    );
  }
  

  return (
    <div className="chatroom-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <img src={user.photoURL} alt="Profile" className="user-avatar" />
            <span className="user-name">{user.displayName}</span>
          </div>
          <div className="header-actions">
            <button className="icon-button" onClick={onLogout} title="Logout">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="room-creation">
          <h2 className="section-title">Join or Create a Room</h2>


          <div 
  className="input-group" 
  style={{ position: "relative", display: "inline-block", width: "100%" }}
>
  <input
    type="text"
    placeholder="Enter room code"
    value={roomCode}
    onChange={(e) => setRoomCode(e.target.value)}
    className="room-input"
    style={{
      width: "100%",
      paddingRight: "35px", // leave space for the icon
      boxSizing: "border-box"
    }}
  />
  <span
    onClick={() => navigator.clipboard.writeText(roomCode)}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)", // centers vertically
      cursor: "pointer",
      color: "white",
      fontSize: "18px",
      userSelect: "none"
    }}
  >
    🗐
  </span>
</div>


          <div className="button-group">
            <button onClick={createRoom} className="create-button">
              Create Room
            </button>
            <button onClick={joinRoom} className="join-button">
              Join Room
            </button>
          </div>
        </div>
      </div>
      
      <div className="welcome-screen">
        <div className="welcome-content">
          <div className="whatsapp-icon-large">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 9.550000190734863 105.3499984741211 30.049999237060547" data-asc="0.78125" width="105.3499984741211" height="30.049999237060547"><defs/><g fill="#ffffff"><g transform="translate(0, 0)"><path d="M21.51 9.55Q22.51 9.55 22.92 9.91Q23.34 10.28 23.34 11.13L23.34 19.19Q23.34 20.04 22.92 20.41Q22.51 20.78 21.51 20.78Q20.51 20.78 20.09 20.41Q19.68 20.04 19.68 19.19Q19.68 17.53 18.93 16.16Q18.19 14.79 16.65 13.98Q15.11 13.16 12.84 13.16Q10.21 13.16 8.17 14.55Q6.13 15.94 4.99 18.53Q3.86 21.12 3.86 24.58Q3.86 28.05 4.93 30.63Q6.01 33.20 7.98 34.59Q9.96 35.99 12.60 35.99Q15.01 35.99 17.21 35.28Q19.41 34.57 21.17 33.23Q21.58 32.89 22.07 32.89Q22.80 32.89 23.36 33.84Q23.80 34.57 23.80 35.13Q23.80 35.86 23.05 36.40Q20.78 37.99 18.10 38.79Q15.43 39.60 12.60 39.60Q8.79 39.60 5.94 37.73Q3.10 35.86 1.55 32.47Q0 29.08 0 24.58Q0 20.12 1.59 16.71Q3.17 13.31 6.04 11.43Q8.91 9.55 12.60 9.55Q14.89 9.55 16.67 10.33Q18.46 11.11 19.68 12.55L19.68 11.13Q19.68 10.28 20.09 9.91Q20.51 9.55 21.51 9.55ZM50.12 9.55Q51.12 9.55 51.54 9.91Q51.95 10.28 51.95 11.13L51.95 16.75Q51.95 17.60 51.54 17.97Q51.12 18.33 50.12 18.33Q49.19 18.33 48.85 17.70Q47.68 15.48 45.56 14.32Q43.43 13.16 40.72 13.16Q38.04 13.16 36.56 14.40Q35.08 15.65 35.08 17.75Q35.08 18.75 35.60 19.43Q36.11 20.12 37.06 20.61Q37.92 21.04 39.06 21.33Q40.21 21.61 42.14 21.97Q44.24 22.39 45.47 22.67Q46.70 22.95 47.90 23.44Q50.34 24.44 51.72 26.23Q53.10 28.03 53.10 31.08Q53.10 33.62 51.90 35.53Q50.71 37.45 48.38 38.53Q46.04 39.60 42.77 39.60Q40.33 39.60 38.24 38.71Q36.16 37.82 34.62 36.11L34.62 38.01Q34.62 38.87 34.20 39.23Q33.79 39.60 32.79 39.60Q31.79 39.60 31.37 39.23Q30.96 38.87 30.96 38.01L30.96 30.69Q30.96 29.83 31.37 29.47Q31.79 29.10 32.79 29.10Q33.84 29.10 34.20 30.13Q35.21 32.96 37.39 34.47Q39.58 35.99 42.77 35.99Q45.90 35.99 47.57 34.64Q49.24 33.30 49.24 31.08Q49.24 29.54 48.47 28.58Q47.71 27.61 46.24 26.98Q45.31 26.56 44.21 26.31Q43.12 26.05 41.21 25.66Q39.21 25.27 37.85 24.93Q36.50 24.58 35.35 24.07Q33.40 23.19 32.31 21.69Q31.23 20.19 31.23 17.75Q31.23 15.23 32.43 13.38Q33.64 11.52 35.80 10.53Q37.96 9.55 40.72 9.55Q42.87 9.55 44.87 10.38Q46.88 11.21 48.29 12.62L48.29 11.13Q48.29 10.28 48.71 9.91Q49.12 9.55 50.12 9.55ZM83.81 10.08Q84.64 10.08 85.00 10.46Q85.35 10.84 85.35 11.74Q85.35 12.65 85.00 13.02Q84.64 13.40 83.81 13.40L82.42 13.40L82.42 38.16Q82.42 38.82 81.97 39.21Q81.52 39.60 80.59 39.60Q79.30 39.60 78.54 38.26L65.87 15.63L65.77 15.63L65.77 35.74L69.21 35.74Q70.04 35.74 70.40 36.12Q70.75 36.50 70.75 37.40Q70.75 38.31 70.40 38.68Q70.04 39.06 69.21 39.06L60.57 39.06Q59.74 39.06 59.39 38.68Q59.03 38.31 59.03 37.40Q59.03 36.50 59.39 36.12Q59.74 35.74 60.57 35.74L62.21 35.74L62.21 13.40L60.33 13.40Q59.50 13.40 59.14 13.02Q58.79 12.65 58.79 11.74Q58.79 10.84 59.14 10.46Q59.50 10.08 60.33 10.08L65.80 10.08Q66.33 10.08 66.66 10.25Q66.99 10.42 67.19 10.77L78.76 31.47L78.86 31.47L78.86 13.40L75.90 13.40Q75.07 13.40 74.72 13.02Q74.37 12.65 74.37 11.74Q74.37 10.84 74.72 10.46Q75.07 10.08 75.90 10.08L83.81 10.08ZM102.05 31.74Q103.81 31.74 104.58 32.09Q105.35 32.45 105.35 33.28L105.35 37.77Q105.35 38.60 104.58 38.95Q103.81 39.31 102.05 39.31Q100.29 39.31 99.52 38.95Q98.75 38.60 98.75 37.77L98.75 33.28Q98.75 32.45 99.52 32.09Q100.29 31.74 102.05 31.74Z"/></g></g></svg>          

          </div>
          <h1>CSN Web</h1>
          <p>Send and receive messages without keeping your phone online.</p>
          <p>Join or create a room to start messaging.</p>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;