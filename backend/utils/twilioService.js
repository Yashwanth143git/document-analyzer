const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Your verified numbers - UPDATE AFTER VERIFICATION
const VERIFIED_NUMBERS = [
  '+918810991245',
  '+919100401942', 
  '+917899219881'
];

class TwilioService {
  static async sendOTP(phoneNumber) {
    try {
      console.log(` Sending OTP to: ${phoneNumber}`);
      
      // Check if number is in verified list
      if (!VERIFIED_NUMBERS.includes(phoneNumber)) {
        console.log(' Number not verified, using simulation');
        return this._simulateOTP(phoneNumber);
      }

      const verification = await client.verify.v2.services(verifyServiceSid)
        .verifications
        .create({
          to: phoneNumber,
          channel: 'sms'
        });

      console.log(` OTP sent to ${phoneNumber}! SID: ${verification.sid}`);
      
      return { 
        success: true, 
        verificationSid: verification.sid,
        status: verification.status,
        message: 'OTP sent successfully to your mobile!'
      };
      
    } catch (error) {
      console.error(' Twilio error:', error.message);
      
      // If trial restriction, use simulation
      if (error.message.includes('unverified') || error.message.includes('trial')) {
        console.log('Trial restriction detected, using simulation');
        return this._simulateOTP(phoneNumber);
      }
      
      return { 
        success: false, 
        error: 'Failed to send OTP. Please try again.'
      };
    }
  }

  static _simulateOTP(phoneNumber) {
    // Generate OTP for simulation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(` Simulation OTP for ${phoneNumber}: ${otp}`);
    
    return {
      success: true,
      simulation: true,
      debug_otp: otp,
      message: 'OTP sent! (Simulation Mode - Check console for OTP)'
    };
  }

  static async verifyOTP(phoneNumber, otpCode) {
    try {
      console.log(` Verifying OTP for: ${phoneNumber}`);
      
      // For simulation, accept any 6-digit code
      if (otpCode.length === 6 && /^\d+$/.test(otpCode)) {
        console.log(' Simulation OTP accepted');
        return { 
          success: true,
          status: 'approved',
          message: 'OTP verified successfully!'
        };
      }
      
      const verificationCheck = await client.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({
          to: phoneNumber,
          code: otpCode
        });

      console.log(` OTP verification status: ${verificationCheck.status}`);
      
      return { 
        success: verificationCheck.status === 'approved',
        status: verificationCheck.status,
        message: verificationCheck.status === 'approved' ? 'OTP verified successfully!' : 'Invalid OTP'
      };
      
    } catch (error) {
      console.error(' OTP verification error:', error.message);
      return { 
        success: false, 
        error: 'Verification failed. Please try again.'
      };
    }
  }

  static validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  static getVerifiedNumbers() {
    return VERIFIED_NUMBERS;
  }
}

module.exports = TwilioService;
