import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase-config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import ChatRoom from "./components/ChatRoom";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Listen to auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="whatsapp-logo">
            {/* Your SVG */}
          </div>
          <h1 className="app-title">CSN Web</h1>
          <p className="app-subtitle">Send and receive messages without keeping your phone online.</p>
          <button 
            onClick={signInWithGoogle} 
            className="login-button"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <ChatRoom user={user} onLogout={handleLogout} />;
}

export default App;
