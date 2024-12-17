const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' }; // Token expires in 1 hour
  return jwt.sign(payload, secret, options);
};
