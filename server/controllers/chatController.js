const chatModel = require('../models/chatModel');

/**
 * Handle chat message requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.processChatMessage = async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format. Messages array is required.'
      });
    }
    
    // Process message through the model
    const result = await chatModel.sendChatMessage(messages);
    
    if (result.success) {
      // Add metadata to the response if available
      if (result.needsMoreInfo) {
        result.data.needsMoreInfo = true;
      }
      
      if (result.emotion) {
        result.data.emotion = result.emotion;
      }
      
      // Return successful response
      return res.json(result.data);
    } else {
      // Return error response
      return res.status(500).json({
        error: 'Failed to process your request',
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error in chat controller:', error.message);
    res.status(500).json({
      error: 'Failed to process your request',
      message: error.message
    });
  }
};

/**
 * Health check endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.healthCheck = (req, res) => {
  res.send('Depression Support Chatbot API is running');
};