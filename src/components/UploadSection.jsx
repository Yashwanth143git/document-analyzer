import React, { useState, useRef } from "react";
import "./Components.css";

const UploadSection = ({ onDocumentUpload }) => {
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
      const response = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadProgress(100);
        setTimeout(() => {
          onDocumentUpload(result.data);
          setIsUploading(false);
        }, 1000);
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
          <p>AI-powered analysis for PDF documents</p>
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
              <h3>Uploading to Backend...</h3>
              <p>{uploadProgress}% complete</p>
              <div className="processing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div className="upload-ready">
              <div className="upload-graphic">
                <div className="cloud-icon"></div>
                <div className="arrow-icon"></div>
              </div>
              <h3>Drop your PDF here or click to browse</h3>
              <p>Supports: PDF documents up to 10MB</p>
              <div className="upload-features">
                <span> Secure Upload</span>
                <span> AI Analysis</span>
                <span> Fast Processing</span>
              </div>
            </div>
          )}
        </div>

        <div className="upload-tips">
          <h4> Connected to Backend:</h4>
          <ul>
            <li>Real file upload to server</li>
            <li>File validation and processing</li>
            <li>Ready for OpenAI integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
