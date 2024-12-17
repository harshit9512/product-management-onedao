// routes/otpRoutes.js
const express = require('express');
const router = express.Router();
const { generateOTP, verifyOTP } = require('../controller/otpController');

// Route to generate OTP
router.post('/generate-otp', generateOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

module.exports = router;
