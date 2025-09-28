const express = require('express');
const router = express.Router();

// Store OTPs temporarily
const otpStore = new Map();

// Send OTP endpoint
router.post('/send-otp', (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10 minutes expiry
    otpStore.set(phoneNumber, {
      otp: otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    console.log(` OTP ${otp} generated for ${phoneNumber} (Simulation Mode)`);

    // For now, we'll simulate OTP sending
    // In next steps, we'll integrate Twilio here
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully!',
      debug_otp: otp, // Remove this in production
      note: 'Currently in simulation mode - real SMS will be added with Twilio'
    });
    
  } catch (error) {
    console.error('OTP send error:', error);
    res.json({ 
      success: false, 
      error: 'Failed to send OTP' 
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.json({ 
        success: false, 
        error: 'Phone number and OTP are required' 
      });
    }

    const storedData = otpStore.get(phoneNumber);

    if (!storedData) {
      return res.json({ 
        success: false, 
        error: 'OTP not found. Please request a new one.' 
      });
    }

    if (storedData.expires < Date.now()) {
      otpStore.delete(phoneNumber);
      return res.json({ 
        success: false, 
        error: 'OTP expired. Please request a new one.' 
      });
    }

    if (storedData.otp === otp) {
      otpStore.delete(phoneNumber);
      res.json({ 
        success: true, 
        message: 'Login successful!',
        user: { 
          phoneNumber,
          id: 'user_' + Date.now()
        }
      });
    } else {
      res.json({ 
        success: false, 
        error: 'Invalid OTP. Please try again.' 
      });
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    res.json({ 
      success: false, 
      error: 'Verification failed' 
    });
  }
});

module.exports = router;
