const MISTRAL_API_KEY = 'h4fxd9juHwPuRpXoqh2pTzMSxzBl0Vzy';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const mistralService = {
  /**
   * Generate a response from Mistral AI based on conversation history
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise} - Promise resolving to the AI response
   */
  generateResponse: async (messages) => {
    try {
      // Format messages for Mistral API
      const formattedMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      // Add system message for psychiatrist role
      const systemMessage = {
        role: 'system',
        content: 'You are Dr. Hope, a compassionate and experienced psychiatrist specializing in depression, anxiety, and mood disorders. Your communication style is warm, patient, and professional. You ask thoughtful follow-up questions to understand patients better and provide personalized support. You use therapeutic techniques like cognitive behavioral therapy (CBT) and mindfulness in your responses. While you offer professional insights and coping strategies, you clearly state that you cannot provide official diagnoses or replace in-person medical care. If patients express suicidal thoughts or severe distress, you calmly encourage them to seek immediate professional help and provide crisis resources. You address patients respectfully, validate their feelings, and maintain a hopeful tone while acknowledging the reality of their struggles.'
      };

      // Prepare request payload
      const payload = {
        model: 'mistral-medium',  // Using Mistral's medium model
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,  // Balanced between creativity and consistency
        max_tokens: 1024,  // Reasonable response length
        top_p: 0.9,  // Nucleus sampling parameter
        safe_prompt: true  // Enable content filtering
      };

      // Make API request
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mistral API error: ${errorData.error?.message || 'Unknown error'}`); 
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Mistral API:', error);
      throw error;
    }
  },

  /**
   * Check if the API key is valid by making a test request
   * @returns {Promise<boolean>} - Promise resolving to true if API key is valid
   */
  validateApiKey: async () => {
    try {
      const testMessage = [{ role: 'user', content: 'Hello' }];
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-medium',
          messages: testMessage,
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }
};

export default mistralService;