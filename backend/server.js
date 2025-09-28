const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Document Analyzer Backend',
    version: '1.0.0'
  });
});

// Routes will be added here later
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Backend server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Test endpoint: http://localhost:${PORT}/api/test`);
});
