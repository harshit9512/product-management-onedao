const { generateOTP, verifyOTP } = require('./otpHelper'); // Importing the helper methods

// Generate OTP API
exports.generateOTP = async (req, res) => {
    const { email } = req.body; // Get email from request body

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Call the helper method to generate the OTP
        const otp = generateOTP(email);

        // Send OTP to user (you can modify this to send the OTP via email, etc.)
        console.log(`OTP for ${email}: ${otp}`); // For demonstration purposes

        // Return OTP in response (You can adjust this to send email, etc.)
        return res.status(200).json({ otp, message: 'OTP generated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error generating OTP' });
    }
};

// Verify OTP API
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        // Call the helper method to verify the OTP
        verifyOTP(email, otp);

        // OTP verified successfully
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
    }
};
