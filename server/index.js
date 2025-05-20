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
    const { messages, section, user_preferences } = req.body;
    
    // Define system prompts for different sections
    const sectionPrompts = {
      'default': 'You are a supportive and empathetic mental health companion. Provide compassionate, helpful responses to users who may be experiencing depression or mental health challenges. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.',
      'relationship': 'You are a supportive and empathetic mental health companion specializing in relationship advice. Provide compassionate, helpful responses to users who may be experiencing relationship challenges. Focus on healthy communication strategies, boundary setting, and emotional well-being in relationships. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.',
      'anxiety': 'You are a supportive and empathetic mental health companion specializing in anxiety support. Provide compassionate, helpful responses to users who may be experiencing anxiety. Focus on grounding techniques, breathing exercises, and cognitive strategies for managing anxious thoughts. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.',
      'loneliness': 'You are a supportive and empathetic mental health companion specializing in loneliness support. Provide compassionate, helpful responses to users who may be experiencing feelings of isolation and loneliness. Focus on connection strategies, self-compassion, and meaningful engagement with others. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.',
      'trauma': 'You are a supportive and empathetic mental health companion specializing in past mental trauma support. Provide compassionate, helpful responses to users who may be dealing with family or financial trauma. Focus on validation, safety, and gentle coping strategies. Never provide medical advice, but offer support, grounding techniques, and encouragement. Keep responses concise and conversational.',
      'gossip': 'You are a supportive and empathetic mental health companion specializing in social support. Provide compassionate, helpful responses to users who may feel they have no one to talk to or are dealing with gossip. Focus on building trust, finding safe connections, and healthy communication. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.',
      'self-care': 'You are a supportive and empathetic mental health companion specializing in self-care. Provide compassionate, helpful responses to users who may need guidance on taking care of their mental and physical wellbeing. Focus on practical self-care routines, mindfulness, and healthy habits. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.',
      'motivation': 'You are a supportive and empathetic mental health companion specializing in motivation and goal-setting. Provide compassionate, helpful responses to users who may be struggling with motivation or achieving their goals. Focus on practical strategies, positive reinforcement, and breaking tasks into manageable steps. Never provide medical advice, but offer support, coping strategies, and encouragement. Keep responses concise and conversational.'
    };
    
    // Select the appropriate system prompt based on the section
    let systemPrompt = sectionPrompts[section] || sectionPrompts['default'];
    
    // Personalize the system prompt based on user preferences if available
    if (user_preferences) {
      // Add personalization instructions based on communication style
      let styleInstruction = '';
      
      if (user_preferences.communication_style === 'direct') {
        styleInstruction = 'Use a direct and straightforward communication style. Be clear, concise, and to the point while maintaining empathy. Avoid excessive emotional language or flowery expressions.';
      } else if (user_preferences.communication_style === 'empathetic') {
        styleInstruction = 'Use a warm and empathetic communication style. Show deep understanding and validation of emotions. Use supportive and nurturing language that conveys genuine care.';
      } else if (user_preferences.communication_style === 'analytical') {
        styleInstruction = 'Use an analytical and detailed communication style. Provide structured insights and logical approaches to problems. Include more detailed explanations while maintaining a supportive tone.';
      } else if (user_preferences.communication_style === 'encouraging') {
        styleInstruction = 'Use an encouraging and positive communication style. Focus on strengths, progress, and possibilities. Use motivational language and highlight potential for growth and improvement.';
      } else {
        styleInstruction = 'Use a balanced communication style that combines empathy with practical guidance.';
      }
      
      // Add user context to the system prompt
      let userContext = 'Additional context about the user:';
      
      if (user_preferences.name) {
        userContext += ` Their name is ${user_preferences.name}.`;
      }
      
      if (user_preferences.age) {
        userContext += ` They are ${user_preferences.age} years old.`;
      }
      
      if (user_preferences.gender) {
        userContext += ` Their gender is ${user_preferences.gender}.`;
      }
      
      if (user_preferences.preferred_topics && user_preferences.preferred_topics.length > 0) {
        userContext += ` They have expressed interest in these topics: ${user_preferences.preferred_topics.join(', ')}.`;
      }
      
      // Combine everything into the enhanced system prompt
      systemPrompt = `${systemPrompt}\n\n${styleInstruction}\n\n${userContext}\n\nMake your responses personalized to the user based on this information, but do not explicitly mention that you know their personal details unless they bring it up first.`;
    }
    
    // Call Mistral AI API
    const response = await axios.post(
      process.env.MISTRAL_API_URL,
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: systemPrompt
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