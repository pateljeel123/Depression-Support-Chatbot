const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Health check endpoint
router.get('/', chatController.healthCheck);

// Chat endpoint
router.post('/api/chat', chatController.processChatMessage);

module.exports = router;