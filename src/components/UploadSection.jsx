import React, { useState, useRef } from "react";
import "./Components.css";

const UploadSection = ({ onDocumentUpload, apiKey, setApiKey }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const API_BASE = "http://localhost:5000/api";

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
      await uploadToBackend(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const uploadToBackend = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("document", file);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        headers: {
          'x-openai-api-key': apiKey,
        },
        body: formData,
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (result.success) {
        setUploadProgress(100);
        setTimeout(() => {
          onDocumentUpload(result.data);
          setIsUploading(false);
        }, 500);
      } else {
        alert(`Upload failed: ${result.error}`);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please check if backend is running.");
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <div className="upload-container">
        <div className="upload-header">
          <div className="upload-icon"></div>
          <h2>Upload Your Document</h2>
          <p>AI-powered analysis with OpenAI</p>
        </div>

        <div className="api-key-input-container">
          <input
            type="password"
            placeholder="Enter your OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-key-input"
          />
        </div>

        <div 
          className={`upload-area ${isDragging ? "dragging" : ""} ${isUploading ? "uploading" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            style={{ display: "none" }}
          />
          
          {isUploading ? (
            <div className="uploading-state">
              <div className="progress-ring">
                <div className="progress-fill" style={{ transform: `rotate(${uploadProgress * 3.6}deg)` }}></div>
              </div>
              <h3>AI Analysis in Progress...</h3>
              <p>{uploadProgress}% complete</p>
              <div className="processing-steps">
                <span> Reading PDF</span>
                <span> AI Processing</span>
                <span> Generating Insights</span>
              </div>
            </div>
          ) : (
            <div className="upload-ready">
              <div className="upload-graphic">
                <div className="cloud-icon"></div>
                <div className="arrow-icon"></div>
              </div>
              <h3>Drop your PDF here or click to browse</h3>
              <p>AI will analyze and summarize your document</p>
              <div className="upload-features">
                <span> Text Extraction</span>
                <span> AI Summary</span>
                <span> Smart Q&A</span>
              </div>
            </div>
          )}
        </div>

        <div className="upload-tips">
          <h4> AI-Powered Features:</h4>
          <ul>
            <li>Automatic text extraction from PDF</li>
            <li>Intelligent document summarization</li>
            <li>Ask questions about your document</li>
            <li>Powered by OpenAI GPT technology</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
