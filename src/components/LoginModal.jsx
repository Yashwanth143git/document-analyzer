import React, { useState } from "react";
import "./Components.css";

const LoginModal = ({ onLoginSuccess, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setMessage("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    setMessage("Sending OTP...");

    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      setMessage(" OTP sent! Use 123456 for demo");
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setMessage("Verifying...");

    setTimeout(() => {
      if (otp === "123456") {
        setMessage(" Login successful!");
        setTimeout(() => onLoginSuccess(), 1000);
      } else {
        setMessage(" Invalid OTP. Try 123456");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <div className="modal-header">
          <h2>Welcome Back! </h2>
          <p>Secure login with OTP verification</p>
          <button className="close-btn" onClick={onClose}></button>
        </div>

        <div className="modal-body">
          {step === "phone" && (
            <div className="form-step">
              <div className="input-group">
                <label> Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <button 
                onClick={handleSendOTP}
                disabled={isLoading}
                className="primary-btn"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="form-step">
              <div className="input-group">
                <label> Enter OTP</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="glass-input"
                  maxLength={6}
                />
                <small>Demo OTP: <strong>123456</strong></small>
              </div>
              
              <button 
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="primary-btn"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
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
          <p> Your data is securely encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
