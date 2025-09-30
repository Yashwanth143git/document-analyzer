import React, { useState, useRef, useEffect } from "react";
import "./Components.css";

const ChatBot = ({ documentData, isOpen, onClose, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (documentData && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 1,
          type: "summary",
          content: documentData.summary,
          timestamp: new Date(),
          isBot: true
        }]);
      }, 500);
    }
  }, [documentData, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const API_BASE = "http://localhost:5000/api";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "text",
      content: inputMessage,
      timestamp: new Date(),
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/documents/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-openai-api-key": apiKey,
        },
        body: JSON.stringify({
          message: inputMessage,
          documentText: documentData.summary, // Or the full text if available
        }),
      });

      const result = await response.json();

      if (result.success) {
        const botMessage = {
          id: messages.length + 2,
          type: "text",
          content: result.response,
          timestamp: new Date(),
          isBot: true
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: messages.length + 2,
          type: "text",
          content: `Error: ${result.error}`,
          timestamp: new Date(),
          isBot: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: "text",
        content: "Error: Could not connect to the server.",
        timestamp: new Date(),
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-info">
          <div className="chatbot-avatar"></div>
          <div>
            <h3>DocuAssistant AI</h3>
            <span className="status">Online  Analyzing your document</span>
          </div>
        </div>
        <button className="close-chat" onClick={onClose}></button>
      </div>

      <div className="chatbot-messages">
        <div className="welcome-message">
          <p>Hello! I have analyzed your document and I am ready to answer your questions. </p>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.isBot ? "bot" : "user"}`}>
            {message.isBot && <div className="bot-avatar"></div>}
            <div className="message-content">
              {message.type === "summary" ? (
                <div className="summary-message">
                  <h4> Document Summary</h4>
                  <div className="summary-content">
                    {message.content.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {!message.isBot && <div className="user-avatar"></div>}
          </div>
        ))}

        {isTyping && (
          <div className="message bot typing">
            <div className="bot-avatar"></div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your document..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            <span></span>
          </button>
        </div>
        <div className="suggestions">
          <span>Try asking:</span>
          <button onClick={() => setInputMessage("What are the main points?")}>Main points</button>
          <button onClick={() => setInputMessage("Summarize the recommendations")}>Recommendations</button>
          <button onClick={() => setInputMessage("Key findings?")}>Key findings</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
