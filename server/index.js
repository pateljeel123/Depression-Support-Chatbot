require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Depression Support Chatbot API is running');
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Call Mistral AI API
    const response = await axios.post(
      process.env.MISTRAL_API_URL,
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive and empathetic mental health companion. Provide compassionate, helpful responses to users who may be experiencing depression or mental health challenges. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
        }
      }
    );
    
    // Return the response from Mistral API
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Mistral API:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to process your request',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});