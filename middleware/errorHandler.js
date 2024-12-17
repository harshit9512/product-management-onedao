const { createResponse } = require('../utils/responseUtils');

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';
  
  res.status(statusCode).json(createResponse(false, errorMessage, null, { code: statusCode, message: errorMessage }));
};
