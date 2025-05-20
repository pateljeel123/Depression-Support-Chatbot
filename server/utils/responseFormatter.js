/**
 * Utility functions for formatting chatbot responses and detecting when follow-up questions are needed
 */

/**
 * Determines if the AI needs more information from the user based on their message
 * @param {string} userMessage - The user's message content
 * @param {string} context - The conversation context
 * @returns {Object} - Contains needsMoreInfo flag and suggested follow-up questions
 */
const needsMoreInformation = (userMessage, context) => {
  // Check for vague or general statements that need clarification
  const vaguePatterns = [
    /^(i feel|i am|i'm) (bad|sad|depressed|anxious|worried|stressed)$/i,
    /^(help|help me|i need help)$/i,
    /^(i don't know what to do)$/i,
    /^(i can't|i cannot)$/i,
    /^(not (feeling|doing) (well|good))$/i
  ];

  // Check for statements that lack specific details
  const lackingDetailsPatterns = [
    /^(this happened|something happened)$/i,
    /^(i have a problem)$/i,
    /^(it's not working)$/i
  ];

  // Check if the message is too short (less than 10 characters)
  const isTooShort = userMessage.trim().length < 10;

  // Check if any vague patterns match
  const isVague = vaguePatterns.some(pattern => pattern.test(userMessage));

  // Check if any lacking details patterns match
  const lacksDetails = lackingDetailsPatterns.some(pattern => pattern.test(userMessage));

  // If any conditions are met, generate appropriate follow-up questions
  if (isTooShort || isVague || lacksDetails) {
    return {
      needsMoreInfo: true,
      followUpQuestions: generateFollowUpQuestions(userMessage, context)
    };
  }

  return { needsMoreInfo: false };
};

/**
 * Generates appropriate follow-up questions based on the user's message
 * @param {string} userMessage - The user's message content
 * @param {string} context - The conversation context
 * @returns {Array} - Array of follow-up questions
 */
const generateFollowUpQuestions = (userMessage, context) => {
  // Default follow-up questions for vague statements
  const defaultQuestions = [
    "Could you tell me more about what you're experiencing?",
    "When did you start feeling this way?",
    "Is there anything specific that triggered these feelings?"
  ];

  // Emotion-specific follow-up questions
  const emotionQuestions = {
    sad: [
      "What specifically is making you feel sad?",
      "How long have you been feeling this way?",
      "Is there anything that has helped you feel better in the past?"
    ],
    anxious: [
      "What are you feeling anxious about?",
      "Are you experiencing any physical symptoms like rapid heartbeat or shortness of breath?",
      "What usually helps when you're feeling anxious?"
    ],
    stressed: [
      "What's causing you stress right now?",
      "How is this stress affecting your daily life?",
      "What strategies have you tried to manage your stress?"
    ]
  };

  // Check for specific emotions in the message
  if (/sad|depressed|down/i.test(userMessage)) {
    return emotionQuestions.sad;
  } else if (/anxious|worried|nervous/i.test(userMessage)) {
    return emotionQuestions.anxious;
  } else if (/stressed|overwhelmed/i.test(userMessage)) {
    return emotionQuestions.stressed;
  }

  // Return default questions if no specific emotion is detected
  return defaultQuestions;
};

/**
 * Formats the AI response into a structured format
 * @param {string} response - The raw AI response
 * @returns {Object} - Structured response with sections
 */
const formatStructuredResponse = (response) => {
  // Default structure
  const structured = {
    acknowledgment: "",
    insights: "",
    suggestions: "",
    resources: "",
    followUp: ""
  };

  // Enhanced pattern matching for more conversational, human-like responses
  // Acknowledgment patterns with more casual, varied expressions
  const acknowledgmentPatterns = [
    /(?:^|\n)(?:I (?:really )?(?:understand|hear|get|see|know)|That (?:sounds|seems|feels|must be)|I'm (?:sorry|here)|Hey,? I (?:get|understand)|Oh,? (?:that's|that)|Hmm,? (?:that|I)|Well,? (?:that|I))([^\n.]+[.?!]?)/i,
    /(?:^|\n)(?:It's (?:okay|alright|normal)|I've (?:been there|felt)|You're (?:not alone|going through))([^\n.]+[.?!]?)/i
  ];

  // Try each acknowledgment pattern until we find a match
  for (const pattern of acknowledgmentPatterns) {
    const match = response.match(pattern);
    if (match) {
      structured.acknowledgment = match[0].trim();
      break;
    }
  }

  // Insights patterns with more conversational language
  const insightsPatterns = [
    /(?:^|\n)(?:It (?:sounds|seems|looks|feels) like|This (?:suggests|might mean|could be)|You (?:might be|could be|seem to be|appear to be)|Sometimes,? (?:we|people|it)|When (?:we|you|people)|Many (?:people|of us|times))([^\n]+(?:\n[^\n•]+)*)/i,
    /(?:^|\n)(?:I (?:think|believe|feel)|From what you're saying|What I'm hearing|You know,|The thing is,|Here's the thing)([^\n]+(?:\n[^\n•]+)*)/i
  ];

  for (const pattern of insightsPatterns) {
    const match = response.match(pattern);
    if (match) {
      structured.insights = match[0].trim();
      break;
    }
  }

  // Suggestions with more conversational and Notion-like bullet points
  const suggestionsPatterns = [
    /(?:^|\n)(?:You (?:could|might|may) (?:try|consider|want to|think about)|Maybe (?:try|consider)|Some (?:things|ideas|options) (?:to try|that might help)|Here (?:are|'s) (?:some|a few) (?:ideas|things|suggestions)|What (?:about|if you)|Have you (?:tried|considered))([^\n]+(?:\n[^\n]+)*)/i,
    /(?:^|\n)(?:• [^\n]+(?:\n• [^\n]+)*)/
  ];

  for (const pattern of suggestionsPatterns) {
    const match = response.match(pattern);
    if (match) {
      structured.suggestions = match[0].trim();
      break;
    }
  }

  // Resources with more conversational tone
  const resourcesPatterns = [
    /(?:^|\n)(?:Resources|Here (?:are|'s) some resources|You might find|If you're interested|Some (?:helpful|useful) (?:resources|links|places)|By the way)([^\n]+(?:\n[^\n]+)*)/i,
    /(?:^|\n)(?:• [^\n]*resource[^\n]*(?:\n• [^\n]+)*)/i
  ];

  for (const pattern of resourcesPatterns) {
    const match = response.match(pattern);
    if (match) {
      structured.resources = match[0].trim();
      break;
    }
  }

  // Follow-up questions with more conversational tone
  const followUpPatterns = [
    /(?:^|\n)(?:Can I ask|I'm wondering|What do you think|How do you feel|Would you like|Have you|Do you|Could you|By the way)([^\n]+\?)/i,
    /(?:^|\n)(?:I'd love to hear more about|Tell me more about|I'm curious about|What else|Anything else)([^\n]+\??)/i
  ];

  for (const pattern of followUpPatterns) {
    const match = response.match(pattern);
    if (match) {
      structured.followUp = match[0].trim();
      break;
    }
  }

  // If we couldn't extract structured sections, use the whole response as insights
  if (!structured.acknowledgment && !structured.insights && !structured.suggestions) {
    structured.insights = response.trim();
  }

  return structured;
};

module.exports = {
  needsMoreInformation,
  formatStructuredResponse
};