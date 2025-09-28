const express = require('express');
const multer = require('multer');
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

// Upload document endpoint
router.post('/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    console.log(` File uploaded: ${req.file.originalname}`);

    // Simulate document processing
    // In next steps, we'll add PDF text extraction and OpenAI integration here
    
    const mockAnalysis = {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      summary: `# Document Analysis Complete!\n\n**File:** ${req.file.originalname}\n**Size:** ${(req.file.size / 1024 / 1024).toFixed(2)} MB\n\n##  AI Analysis Summary\nThis is a simulated analysis. In the next phase, we will integrate OpenAI API for real document analysis.\n\n##  Next Steps\n- Extract text from PDF\n- Send to OpenAI for analysis\n- Generate intelligent summary\n- Enable Q&A functionality`,
      pages: Math.ceil(Math.random() * 50) + 5, // Random page count for simulation
      processedAt: new Date().toISOString()
    };

    res.json({ 
      success: true, 
      message: 'Document uploaded successfully!',
      data: mockAnalysis,
      note: 'Currently in simulation mode - OpenAI integration will be added next'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.json({ 
      success: false, 
      error: 'File upload failed' 
    });
  }
});

// Chat with document endpoint (simulated)
router.post('/chat', (req, res) => {
  try {
    const { message, documentId } = req.body;

    if (!message) {
      return res.json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Simulate AI response
    // In next steps, we'll integrate OpenAI here
    const responses = [
      "Based on the document analysis, this appears to be covered in the executive summary section.",
      "The document mentions this topic in the context of strategic recommendations.",
      "This is addressed in the methodology section of the analyzed document.",
      "The data suggests this aspect requires further investigation as per the findings."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    res.json({ 
      success: true, 
      response: randomResponse,
      note: 'Simulated response - OpenAI integration coming next'
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.json({ 
      success: false, 
      error: 'Chat processing failed' 
    });
  }
});

module.exports = router;
