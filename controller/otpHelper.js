const crypto = require('crypto');

const otpStorage = {};

// OTP generation method (can be used directly or called in API)
exports.generateOTP = (email) => {
    if (!email) {
        throw new Error('Email is required');
    }

    const OTP_EXPIRY_DURATION = 5 * 60 * 1000; // OTP expiry duration (5 minutes)
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    // Hash the OTP for secure storage
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiryTime = Date.now() + OTP_EXPIRY_DURATION;

    // Store the hashed OTP in memory with email as the key
    otpStorage[email] = { hashedOtp, expiryTime };

    // Clean up the OTP storage after expiry
    setTimeout(() => {
        delete otpStorage[email];
    }, OTP_EXPIRY_DURATION);

    // Return the OTP for use in the API
    return otp;
};

// OTP verification method (to be used directly or in API)
exports.verifyOTP = (email, otp) => {
    if (!email || !otp) {
        throw new Error('Email and OTP are required');
    }

    const otpDetails = otpStorage[email];
    if (!otpDetails) {
        throw new Error('Invalid or expired OTP');
    }

    const { hashedOtp, expiryTime } = otpDetails;

    if (Date.now() > expiryTime) {
        delete otpStorage[email]; // Clean up expired OTP
        throw new Error('OTP has expired');
    }

    // Hash the provided OTP and compare with the stored hash
    const hashedInputOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOtp !== hashedInputOtp) {
        throw new Error('Invalid OTP');
    }

    // OTP is valid, remove it from memory
    delete otpStorage[email];
    return true; // OTP verified successfully
};
