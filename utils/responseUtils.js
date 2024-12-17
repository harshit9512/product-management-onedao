exports.createResponse = (success, message, data = null, error = null) => {
    return {
      success,
      message,
      data,
      error,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: generateUniqueRequestId() // Optional: Generate unique IDs
      }
    };
  };
  
  function generateUniqueRequestId() {
    return Math.random().toString(36).substring(2, 15) + Date.now();
  }
  