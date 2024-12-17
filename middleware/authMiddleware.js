const jwt = require('jsonwebtoken');
const { createResponse } = require('../utils/responseUtils');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json(createResponse(false, 'Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json(createResponse(false, 'Invalid or expired token.', null, { code: 401, message: err.message }));
  }
};
