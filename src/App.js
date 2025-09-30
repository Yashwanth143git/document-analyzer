import React, { useState, useEffect } from "react";
import LoginModal from "./components/LoginModal";
import UploadSection from "./components/UploadSection";
import ChatBot from "./components/ChatBot";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setShowLogin(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleDocumentUpload = (data) => {
    setDocumentData(data);
    setDocumentUploaded(true);
    setShowChatBot(true);
  };

  return (
    <div className="app">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="main-container">
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">DocuAnalyzer</span> AI
            </h1>
            <p className="hero-subtitle">
              Smart Document Analysis & Intelligent Chat Assistant
            </p>
            <div className="feature-tags">
              <span className="tag"> AI-Powered Analysis</span>
              <span className="tag"> Smart Chat</span>
              <span className="tag"> Secure</span>
            </div>
          </div>
        </header>

        {showLogin && (
          <LoginModal 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
          />
        )}

        {isLoggedIn && !documentUploaded && (
          <UploadSection
            onDocumentUpload={handleDocumentUpload}
            apiKey={apiKey}
            setApiKey={setApiKey}
          />
        )}

        {showChatBot && (
          <ChatBot 
            documentData={documentData}
            isOpen={showChatBot}
            onClose={() => setShowChatBot(false)}
            apiKey={apiKey}
          />
        )}

        <footer className="app-footer">
          <p>Powered by Advanced AI Technology  Secure & Private</p>
        </footer>
      </div>
    </div>
  );
}

export default App;