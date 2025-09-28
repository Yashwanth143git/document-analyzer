import React, { useState } from "react";
import "./Components.css";

const LoginModal = ({ onLoginSuccess, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:5000/api";
  
  // These numbers work for testing (update as you verify more)
  const TEST_NUMBERS = [
    '+918810991245',
    '+919100401942', 
    '+917899219881'
  ];

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setMessage("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    setMessage("Sending OTP...");

    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber })
      });

      const result = await response.json();

      if (result.success) {
        setStep("otp");
        setMessage(" OTP sent successfully! Check your SMS.");
      } else {
        setMessage(` ${result.error}`);
      }
    } catch (error) {
      setMessage(" Network error. Please check your connection.");
      console.error("OTP Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP from your SMS");
      return;
    }

    setIsLoading(true);
    setMessage("Verifying...");

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp })
      });

      const result = await response.json();

      if (result.success) {
        setMessage(" Login successful! Redirecting...");
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        setMessage(` ${result.error}`);
      }
    } catch (error) {
      setMessage(" Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickFillNumber = (number) => {
    setPhoneNumber(number);
  };

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <div className="modal-header">
          <h2>Welcome to DocuAnalyzer! </h2>
          <p>Secure login with real SMS OTP</p>
          <button className="close-btn" onClick={onClose}></button>
        </div>

        <div className="modal-body">
          {step === "phone" && (
            <div className="form-step">
              <div className="input-group">
                <label> Indian Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="glass-input"
                />
                <small>Format: +91 followed by 10-digit number</small>
                <div className="quick-numbers">
                  <small>Test with these verified numbers:</small>
                  {TEST_NUMBERS.map(number => (
                    <button 
                      key={number}
                      type="button"
                      onClick={() => quickFillNumber(number)}
                      className="quick-number-btn"
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleSendOTP}
                disabled={isLoading}
                className="primary-btn"
              >
                {isLoading ? "Sending OTP via SMS..." : "Send OTP via SMS"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="form-step">
              <div className="input-group">
                <label> Enter OTP from SMS</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="glass-input"
                  maxLength={6}
                />
                <small>Check your SMS messages for the OTP</small>
              </div>
              
              <button 
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="primary-btn"
              >
                {isLoading ? "Verifying..." : "Verify OTP & Login"}
              </button>
            </div>
          )}

          {message && (
            <div className={`message ${message.includes("") ? "error" : "success"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <p> Real SMS OTP  Indian Numbers Only</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
