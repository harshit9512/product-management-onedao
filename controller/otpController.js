const { createResponse } = require('../utils/responseUtils');
const { generateOTP, verifyOTP } = require('./otpHelper'); // Importing the helper methods

// Generate OTP API
exports.generateOTP = async (req, res) => {
  const { email } = req.body; // Get email from request body

  if (!email) {
    return res.status(400).json(createResponse(false, "Email Id is required"));
  }

  try {
    // Call the helper method to generate the OTP
    const otp = generateOTP(email);

    // Send OTP to user (you can modify this to send the OTP via email, etc.)
    console.log(`OTP for ${email}: ${otp}`); // For demonstration purposes

    // Return OTP in response (You can adjust this to send email, etc.)
    return res.status(200).json(createResponse(true, 'OTP generated successfully', { otp }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, 'Error generating OTP', null, { code: 500, message: err.message }));
  }
};

// Verify OTP API
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json(createResponse(false, 'Email and OTP are required'));
  }

  try {
    // Call the helper method to verify the OTP
    verifyOTP(email, otp);

    // OTP verified successfully
    return res.status(200).json(createResponse(true, 'OTP verified successfully'));
  } catch (err) {
    console.error(err);
    return res.status(400).json(createResponse(false, err.message, null, { code: 400, message: err.message }));
  }
};