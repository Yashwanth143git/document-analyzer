const express = require('express');
const TwilioService = require('../utils/twilioService');
const router = express.Router();

// Store verification sessions temporarily
const verificationSessions = new Map();

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }

    // Validate phone number format
    if (!TwilioService.validatePhoneNumber(phoneNumber)) {
      return res.json({ 
        success: false, 
        error: 'Invalid phone number format. Use international format: +1234567890' 
      });
    }

    console.log(` Sending OTP to: ${phoneNumber}`);

    // Send OTP via Twilio Verify API
    const twilioResult = await TwilioService.sendOTP(phoneNumber);

    if (twilioResult.success) {
      // Store verification session
      verificationSessions.set(phoneNumber, {
        verificationSid: twilioResult.verificationSid,
        expires: Date.now() + 10 * 60 * 1000 // 10 minutes
      });

      res.json({ 
        success: true, 
        message: twilioResult.message || 'OTP sent successfully to your mobile!',
        verificationSid: twilioResult.verificationSid
      });
    } else {
      res.json({ 
        success: false, 
        error: twilioResult.error 
      });
    }
    
  } catch (error) {
    console.error('OTP send error:', error);
    res.json({ 
      success: false, 
      error: 'Failed to send OTP. Please try again.' 
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.json({ 
        success: false, 
        error: 'Phone number and OTP are required' 
      });
    }

    // Verify OTP via Twilio Verify API
    const verificationResult = await TwilioService.verifyOTP(phoneNumber, otp);

    if (verificationResult.success) {
      // Clear verification session
      verificationSessions.delete(phoneNumber);
      
      res.json({ 
        success: true, 
        message: verificationResult.message || 'Login successful!',
        user: { 
          phoneNumber,
          id: 'user_' + Date.now()
        }
      });
    } else {
      res.json({ 
        success: false, 
        error: verificationResult.error || 'Invalid OTP. Please try again.' 
      });
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    res.json({ 
      success: false, 
      error: 'Verification failed. Please try again.' 
    });
  }
});

module.exports = router;
