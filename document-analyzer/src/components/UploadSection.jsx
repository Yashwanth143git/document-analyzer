import React, { useState, useRef } from 'react';
import './Components.css';

const UploadSection = ({ onDocumentUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

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

  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      simulateUpload(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          processDocument(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processDocument = (file) => {
    setTimeout(() => {
      // Simulate AI processing
      const mockData = {
        fileName: file.name,
        summary: `# Document Analysis Complete!\n\n**File:** ${file.name}\n**Pages:** 12\n**Key Topics:** Artificial Intelligence, Machine Learning, Neural Networks\n\n## 📊 Executive Summary\nThis document provides a comprehensive overview of modern AI technologies, focusing on machine learning applications in various industries. The analysis reveals significant growth potential in AI-driven solutions.\n\n## 🔍 Key Findings\n- 15% annual growth in AI adoption\n- 3 main application areas identified\n- Risk assessment: Moderate market volatility\n\n## 💡 Recommendations\n- Invest in AI research and development\n- Focus on ethical AI implementation\n- Monitor regulatory developments`,
        content: "This is a simulated document content that would be extracted and analyzed by AI..."
      };
      
      onDocumentUpload(mockData);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <div className="upload-section">
      <div className="upload-container">
        <div className="upload-header">
          <div className="upload-icon">📄</div>
          <h2>Upload Your Document</h2>
          <p>AI-powered analysis for PDF documents</p>
        </div>

        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
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
            style={{ display: 'none' }}
          />
          
          {isUploading ? (
            <div className="uploading-state">
              <div className="progress-ring">
                <div className="progress-fill" style={{ transform: `rotate(${uploadProgress * 3.6}deg)` }}></div>
              </div>
              <h3>Analyzing with AI...</h3>
              <p>{uploadProgress}% complete</p>
              <div className="processing-animation">
                <span>🤖</span>
                <span>🔍</span>
                <span>💡</span>
              </div>
            </div>
          ) : (
            <div className="upload-ready">
              <div className="upload-graphic">
                <div className="cloud-icon">☁️</div>
                <div className="arrow-icon">⬆️</div>
              </div>
              <h3>Drop your PDF here or click to browse</h3>
              <p>Supports: PDF documents up to 10MB</p>
              <div className="upload-features">
                <span>🔒 Secure Upload</span>
                <span>🤖 AI Analysis</span>
                <span>⚡ Fast Processing</span>
              </div>
            </div>
          )}
        </div>

        <div className="upload-tips">
          <h4>💡 Pro Tips:</h4>
          <ul>
            <li>Use high-quality PDFs for better analysis</li>
            <li>Documents with text (not scanned images) work best</li>
            <li>Average processing time: 15-30 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;