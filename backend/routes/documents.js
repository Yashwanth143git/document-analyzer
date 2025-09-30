const express = require('express');
const multer = require('multer');
const fs = require('fs');
const OpenAIService = require('../utils/openaiService');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Upload and analyze document with AI
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    console.log(` Processing document: ${req.file.originalname}`);

    // Validate OpenAI API key
    const isOpenAIValid = await OpenAIService.validateAPIKey();
    if (!isOpenAIValid) {
      return res.json({
        success: false,
        error: 'OpenAI API key is invalid or not configured'
      });
    }

    // Read file and extract text
    const fileBuffer = fs.readFileSync(req.file.path);
    const documentText = await OpenAIService.extractTextFromPDF(fileBuffer);

    if (!documentText || documentText.trim().length < 50) {
      return res.json({
        success: false,
        error: 'Could not extract sufficient text from the PDF. Please ensure it contains readable text.'
      });
    }

    console.log(` Extracted ${documentText.length} characters from PDF`);

    // Generate AI summary
    const summary = await OpenAIService.generateSummary(documentText);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    const analysisResult = {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      textLength: documentText.length,
      summary: summary,
      processedAt: new Date().toISOString(),
      pages: Math.ceil(documentText.length / 2000) // Estimate pages
    };

    res.json({ 
      success: true, 
      message: 'Document analyzed successfully with AI!',
      data: analysisResult
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({ 
      success: false, 
      error: error.message || 'Document processing failed'
    });
  }
});

// Chat with document using AI
router.post('/chat', async (req, res) => {
  try {
    const { message, documentText } = req.body;

    if (!message) {
      return res.json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    if (!documentText) {
      return res.json({ 
        success: false, 
        error: 'Document text is required for chatting' 
      });
    }

    console.log(` Processing chat question: ${message}`);

    const answer = await OpenAIService.answerQuestion(documentText, message);

    res.json({ 
      success: true, 
      response: answer,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.json({ 
      success: false, 
      error: error.message || 'Failed to process question'
    });
  }
});

module.exports = router;
