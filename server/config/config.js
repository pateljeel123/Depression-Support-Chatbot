require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mistralApiUrl: process.env.MISTRAL_API_URL,
  mistralApiKey: process.env.MISTRAL_API_KEY,
  mistralModel: 'mistral-medium',
  temperature: 0.7,
  maxTokens: 500
};