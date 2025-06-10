const axios = require("axios");
const config = require("../config/config");

// Track repeated user messages per session
let userMessageTracker = {
  sessions: {},
};

/**
 * Checks if a message is repeated too many times
 * @param {String} message - The user message
 * @returns {Object} - Information about message repetition
 */
/**
 * Checks if a message is repeated too many times and generates dynamic AI responses
 * @param {String} message - The user message
 * @returns {Object} - Information about message repetition
 */
const checkRepeatedMessage = async (message, userId = "default") => {
  const normalizedMessage = message.trim().toLowerCase();

  // Initialize session data if it doesn't exist
  if (!userMessageTracker.sessions[userId]) {
    userMessageTracker.sessions[userId] = {
      messages: {},
      lastMessage: "",
      usedResponses: {},
      vagueModeActive: false,
      vagueMessageCount: 0,
      lastMeaningfulResponse: null,
    };
  }

  // Get session-specific tracker
  const sessionTracker = userMessageTracker.sessions[userId];

  // Update last message
  const isRepeated = normalizedMessage === sessionTracker.lastMessage;
  sessionTracker.lastMessage = normalizedMessage;

  // Track message count
  if (!sessionTracker.messages[normalizedMessage]) {
    sessionTracker.messages[normalizedMessage] = 1;
    // Initialize usedResponses for this message
    sessionTracker.usedResponses[normalizedMessage] = [];
  } else {
    sessionTracker.messages[normalizedMessage]++;
  }

  const count = sessionTracker.messages[normalizedMessage];

  // Check if this is a meaningful response after vague/repeated messages
  const isMeaningful = checkIfMeaningfulResponse(message, sessionTracker);

  // First check user's language style - IMPORTANT: This should be done on the original message, not normalized
  // We analyze the message style every time to ensure accurate language detection, especially for repeated messages
  const messageStyle = analyzeUserMessageStyle(message);
  const isHinglish =
    messageStyle.language === "Hindi" || messageStyle.language === "Hinglish";

  // Log the detected language for debugging
  console.log(
    `Message language detection: ${messageStyle.language}, isHinglish: ${isHinglish}`
  );

  // Generate dynamic AI response for repeated messages
  if (count > 2) {
    try {
      // Create a special system prompt for repeated message handling with enhanced instructions
      const repeatMessagePrompt = `You are responding to a user who has sent the same message "${normalizedMessage}" ${count} times. 

Guidelines for your response:

1. ACKNOWLEDGE THE REPETITION: Mention that you've noticed they've repeated the same message, but do it in a friendly, non-judgmental way with humor and warmth.

2. CONTEXT-AWARE RESPONSE: Your response should be contextually relevant to what they're saying, not just about the repetition itself. Analyze the message content and respond appropriately.

3. ENGAGE DIFFERENTLY: Ask an interesting, thought-provoking question or share a fun fact to break the pattern and encourage different conversation. Be creative and unexpected.

4. LANGUAGE MATCHING IS CRITICAL: 
   ${
     isHinglish
       ? "⚠️ EXTREMELY IMPORTANT: You MUST respond ONLY in Hindi or Hinglish (mix of Hindi and English) with a friendly, casual tone. Use popular Bollywood references, Hindi expressions, or street slang if appropriate. Your response MUST be in Hinglish/Hindi script - ABSOLUTELY NO PURE ENGLISH ALLOWED. If you respond in English, it will be considered a complete failure."
       : "⚠️ EXTREMELY IMPORTANT: You MUST respond ONLY in English with a friendly, conversational tone. DO NOT use Hindi or Hinglish under any circumstances. If you respond in Hindi/Hinglish, it will be considered a complete failure."
   }

5. KEEP IT FRESH: Generate a completely unique response each time - be creative, varied and surprising. Avoid generic responses.

6. TONE: Be playful, light-hearted, and even a bit dramatic or funny. Use a conversational style like you're texting a friend.

7. LENGTH: Keep your response concise (3-5 sentences) but make it visually engaging with good formatting.

8. INCLUDE EMOJIS: Use 2-4 appropriate and varied emojis to make your response more engaging and expressive.

9. VISUAL DESIGN: Use some formatting techniques like:
   - Short paragraphs with line breaks
   - Maybe a bullet point or two
   - Occasional use of *asterisks* for emphasis
   - Creative emoji placement 🌟 for visual appeal

10. CULTURAL RELEVANCE: ${
        isHinglish
          ? "Include references to Indian pop culture, Bollywood, cricket, or local expressions"
          : "Include references to relevant cultural elements the user might connect with"
      }

Your response should feel like a friend gently nudging the conversation in a new direction with humor and creativity, not like you're calling them out for repetition.`;

      // Create a mock conversation with the repeated message
      const mockConversation = [
        {
          role: "system",
          content: repeatMessagePrompt,
        },
        {
          role: "user",
          content: message, // Use original message here, not normalized
        },
      ];

      // Call the Mistral API to generate a dynamic response with higher creativity
      const apiParams = {
        model: config.mistralModel,
        messages: mockConversation,
        temperature: 0.95, // Higher temperature for more creative responses
        max_tokens: 200, // Allow slightly longer responses for better formatting
        top_p: 0.95, // Slightly more diverse token selection
      };

      const response = await axios.post(config.mistralApiUrl, apiParams, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.mistralApiKey}`,
        },
      });

      // Extract the AI-generated response
      const aiResponse = response.data.choices[0].message.content;

      // Track this response to avoid duplicates in future
      sessionTracker.usedResponses[normalizedMessage].push(aiResponse);

      return {
        isRepeated: true,
        count: count,
        response: aiResponse,
        isDynamicResponse: true,
      };
    } catch (error) {
      console.error(
        "Error generating dynamic response for repeated message:",
        error
      );

      // Try again with a simpler prompt if the first attempt failed
      try {
        console.log("Retrying with a simpler prompt for repeated message...");

        // Re-analyze the message style to ensure accurate language detection for the retry attempt
        const updatedMessageStyle = analyzeUserMessageStyle(message);
        const updatedIsHinglish =
          updatedMessageStyle.language === "Hindi" ||
          updatedMessageStyle.language === "Hinglish";

        console.log(
          `Retry - Message language detection: ${updatedMessageStyle.language}, isHinglish: ${updatedIsHinglish}`
        );

        // Create a simpler system prompt for repeated message handling
        const simpleRepeatPrompt = `Generate a creative, friendly response to a user who has sent the same message "${normalizedMessage}" multiple times. 

${
  updatedIsHinglish
    ? "⚠️ CRITICAL: RESPOND ONLY IN HINDI/HINGLISH. DO NOT USE ENGLISH AT ALL. Use Hindi/Roman script with some English words mixed in if needed."
    : "⚠️ CRITICAL: RESPOND ONLY IN ENGLISH. DO NOT USE HINDI/HINGLISH AT ALL."
}

Keep it short (2-3 sentences), include 1-2 emojis, and be conversational and engaging. Acknowledge the repetition in a friendly way and try to move the conversation forward.`;

        // Create a mock conversation with the repeated message
        const simpleMockConversation = [
          {
            role: "system",
            content: simpleRepeatPrompt,
          },
          {
            role: "user",
            content: message, // Use original message here
          },
        ];

        // Call the Mistral API with simpler parameters
        const simpleApiParams = {
          model: config.mistralModel,
          messages: simpleMockConversation,
          temperature: 0.85,
          max_tokens: 120,
        };

        const retryResponse = await axios.post(
          config.mistralApiUrl,
          simpleApiParams,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.mistralApiKey}`,
            },
          }
        );

        // Extract the AI-generated response
        const retryAiResponse = retryResponse.data.choices[0].message.content;

        // Track this response to avoid duplicates in future
        sessionTracker.usedResponses[normalizedMessage].push(retryAiResponse);

        return {
          isRepeated: true,
          count: count,
          response: retryAiResponse,
          isDynamicResponse: true,
        };
      } catch (retryError) {
        console.error(
          "Second attempt at generating response also failed:",
          retryError
        );

        // If both attempts fail, return a more varied generic response based on language
        // Re-analyze the message style one final time to ensure accurate language detection
        const finalMessageStyle = analyzeUserMessageStyle(message);
        const finalIsHinglish =
          finalMessageStyle.language === "Hindi" ||
          finalMessageStyle.language === "Hinglish";

        console.log(
          `Final fallback - Message language detection: ${finalMessageStyle.language}, isHinglish: ${finalIsHinglish}`
        );

        const hinglishResponses = [
          "Arey yaar, aap yeh baat baar baar keh rahe ho! Kuch naya batao na? 😊",
          "Oho! Ek hi baat kitni baar? Koi nayi baat karte hain! 🌟",
          "Lagta hai aapko yeh baat bohot pasand hai, par thoda topic change karein? 😄",
          "Arre bhai, same cheez phir se? Kuch aur interesting batao na! 🙂",
          "Yeh toh déjà vu ho gaya! Kuch naya socho, main sun raha hoon. 🎧",
        ];

        const englishResponses = [
          "I notice you're saying the same thing again. Let's try a different topic? 😊",
          "Hmm, you seem to be repeating yourself. Anything else on your mind? 🌟",
          "I see this message is important to you, but maybe we could chat about something new? 😄",
          "Same message again? Let's mix things up a bit! What else is going on? 🙂",
          "I'm experiencing a bit of déjà vu! Let's try a fresh conversation direction. 🎧",
        ];

        // Select a random response based on language
        const randomIndex = Math.floor(Math.random() * 5);
        const genericResponse = finalIsHinglish
          ? hinglishResponses[randomIndex]
          : englishResponses[randomIndex];

        return {
          isRepeated: true,
          count: count,
          response: genericResponse,
          isDynamicResponse: false,
        };
      }
    }
  }

  // Check if this is a meaningful response after vague/repeated messages
  // If so, generate an expressive reaction
  if (isMeaningful && sessionTracker.vagueModeActive) {
    try {
      // First check user's language style for the meaningful response
      const meaningfulMessageStyle = analyzeUserMessageStyle(message);
      const isHinglish =
        meaningfulMessageStyle.language === "Hindi" ||
        meaningfulMessageStyle.language === "Hinglish";

      console.log(
        `Meaningful response detected! Language: ${meaningfulMessageStyle.language}, isHinglish: ${isHinglish}`
      );

      // Create a special system prompt for meaningful response handling
      const meaningfulResponsePrompt = `You are responding to a user who has finally given a clear, meaningful response after sending ${
        sessionTracker.vagueMessageCount
      } vague or repeated messages.

Guidelines for your response:

1. EXPRESS RELIEF AND APPRECIATION: Show that you're happy to finally get a clear response, but do it in a friendly, non-judgmental way with warmth.

2. CONTEXT-AWARE RESPONSE: Your response should acknowledge their meaningful answer and be contextually relevant to what they're saying.

3. LANGUAGE MATCHING IS CRITICAL: 
   ${
     isHinglish
       ? "⚠️ EXTREMELY IMPORTANT: You MUST respond ONLY in Hindi or Hinglish (mix of Hindi and English) with a friendly, casual tone. Your response MUST start with one of these expressions (or very similar ones):\n- 'Ohh finally, yeh baat hai!'\n- 'Chalo kuch to samjha!'\n- 'Yeh hui na baat!'\n- 'Aakhirkar jawab mila, shukriya!'\n- 'Baat ban gayi ab!'\n- 'Ab baat bani!'\n- 'Chalo kuch to mila!'\n\nYour response MUST be in Hinglish/Hindi script - ABSOLUTELY NO PURE ENGLISH ALLOWED."
       : "⚠️ EXTREMELY IMPORTANT: You MUST respond ONLY in English with a friendly, conversational tone. Your response MUST start with one of these expressions (or very similar ones):\n- 'Ohh finally!'\n- 'Now we're talking!'\n- 'That's more like it!'\n- 'Glad you opened up!'\n- 'Now we're getting somewhere!'\n- 'We got there in the end!'\n\nDO NOT use Hindi or Hinglish under any circumstances."
   }

4. TONE: Be playful, light-hearted, and friendly. Use a conversational style like you're texting a friend who finally answered your question properly.

5. LENGTH: Keep your response concise (2-3 sentences) but make it visually engaging.

6. INCLUDE EMOJIS: Use 1-2 appropriate emojis to make your response more engaging and expressive.

Your response should feel like a friend who is relieved to finally get a clear answer, expressed in a friendly, non-sarcastic way.`;

      // Create a mock conversation with the meaningful response
      const mockConversation = [
        {
          role: "system",
          content: meaningfulResponsePrompt,
        },
        {
          role: "user",
          content: message, // Use original message here
        },
      ];

      // Call the Mistral API to generate a dynamic response
      const apiParams = {
        model: config.mistralModel,
        messages: mockConversation,
        temperature: 0.9, // Higher temperature for more creative responses
        max_tokens: 100, // Short responses for the reaction
        top_p: 0.9, // Slightly more diverse token selection
      };

      const response = await axios.post(config.mistralApiUrl, apiParams, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.mistralApiKey}`,
        },
      });

      // Extract the AI-generated response
      const aiResponse = response.data.choices[0].message.content;

      // Reset the vague mode since we got a meaningful response
      sessionTracker.vagueModeActive = false;
      sessionTracker.vagueMessageCount = 0;
      sessionTracker.lastMeaningfulResponse = message;

      return {
        isRepeated: false,
        count: count,
        response: aiResponse,
        isDynamicResponse: true,
        isMeaningfulResponse: true,
      };
    } catch (error) {
      console.error("Error generating response for meaningful message:", error);

      // If API call fails, still reset vague mode but return null response
      sessionTracker.vagueModeActive = false;
      sessionTracker.vagueMessageCount = 0;
      sessionTracker.lastMeaningfulResponse = message;
    }
  }

  return {
    isRepeated: isRepeated,
    count: count,
    response: null,
  };
};

/**
 * Checks if a message is a meaningful response after vague/repeated messages
 * @param {String} message - The user message
 * @param {Object} sessionTracker - The session tracker object
 * @returns {Boolean} - Whether the message is a meaningful response
 */
const checkIfMeaningfulResponse = (message, sessionTracker) => {
  // If vague mode is not active, check if we should activate it
  if (!sessionTracker.vagueModeActive) {
    // If the message is repeated more than twice, activate vague mode
    if (sessionTracker.messages[message.trim().toLowerCase()] > 2) {
      sessionTracker.vagueModeActive = true;
      sessionTracker.vagueMessageCount = 1;
      console.log("Vague mode activated due to repeated messages");
      return false;
    }
    return false;
  }

  // Vague mode is active, check if this is a meaningful response

  // Increment vague message count
  sessionTracker.vagueMessageCount++;

  // Check message length - meaningful responses tend to be longer
  if (message.length < 15) {
    console.log("Message too short to be meaningful");
    return false;
  }

  // Check if message is repeated - repeated messages are not meaningful
  if (sessionTracker.messages[message.trim().toLowerCase()] > 1) {
    console.log("Repeated message, not meaningful");
    return false;
  }

  // Check for question marks - questions are usually meaningful
  if (message.includes("?")) {
    console.log("Question detected, likely meaningful");
    return true;
  }

  // Check for multiple words - more words usually means more meaningful
  const wordCount = message.split(/\s+/).length;
  if (wordCount >= 5) {
    console.log(`Message has ${wordCount} words, likely meaningful`);
    return true;
  }

  // Check for punctuation - proper punctuation often indicates thoughtfulness
  if (/[.!,;:]/.test(message)) {
    console.log("Punctuation detected, likely meaningful");
    return true;
  }

  // If we've had 3+ vague messages and this one is different, consider it meaningful
  if (
    sessionTracker.vagueMessageCount >= 3 &&
    message.trim().toLowerCase() !== sessionTracker.lastMessage
  ) {
    console.log(
      "Different message after multiple vague ones, likely meaningful"
    );
    return true;
  }

  // Default to not meaningful
  return false;
};

/**
 * Emotion Detection Patterns
 * Carefully crafted to listen for the whispers of the heart
 */

//RegEx (Regular Expression) Pattern Matching
const emotionPatterns = {
  greeting: [
    /^\s*(hi|hello|hey|howdy|hola|namaste|greetings|sup|yo|hiya|heya|good morning|good afternoon|good evening)\s*[!.?]*\s*$/i,
    /^\s*(hi|hello|hey|howdy|hola|namaste|greetings|sup|yo|hiya|heya)\s+there\s*[!.?]*\s*$/i,
    /^\s*(hi|hello|hey|howdy|hola|namaste|greetings|sup|yo|hiya|heya)\s+everyone\s*[!.?]*\s*$/i,
  ],
  sadness: [
    /sad|depressed|unhappy|miserable|down|blue|gloomy|heartbroken|hopeless|grief|crying/i,
    /don't feel like|no energy|exhausted|tired of|can't take it|giving up/i,
    /feel broken|i'm tired|lost someone|feel empty|hurting inside/i,
  ],
  anxiety: [
    /anxious|worried|nervous|panic|stress|overwhelmed|fear|scared|terrified|uneasy/i,
    /what if|might happen|can't stop thinking|racing thoughts|heart racing/i,
  ],
  anger: [
    /angry|frustrated|irritated|annoyed|mad|furious|rage|hate|resent/i,
    /unfair|shouldn't have|always happens|never works/i,
    /i hate everything|i'm done|no one listens|fed up|had enough/i,
  ],
  loneliness: [
    /alone|lonely|isolated|no friends|no one understands|no one cares|abandoned/i,
    /by myself|no support|disconnected|left out|rejected/i,
  ],
  hopelessness: [
    /hopeless|pointless|worthless|no point|no purpose|no future|no reason/i,
    /never get better|always be this way|can't see a way out|stuck forever/i,
  ],
  financial_stress: [
    /money worries|financial problems|debt|can't afford|bills piling up|\bbroke\b|\bpoor\b|job loss and finances|struggling financially|economic hardship/i,
    /stressed about money|anxious about finances|worried about debt|overwhelmed by bills|fear of poverty/i,
  ],
  suicidal: [
    /suicidal|kill myself|end it all|don't want to live|rather be dead|take my life/i,
    /no reason to live|everyone better off|can't go on|too much pain/i,
  ],
  heartbreak: [
    /heartbreak|broken heart|heart hurts|crying|tears|sobbing/i,
    /relationship ended|broke up|dumped|betrayed|cheated on/i,
  ],
  user_trust: [
    /trust you|opening up|sharing this|telling you|confiding in you/i,
    /never told anyone|first time talking|hard to talk about|difficult to share/i,
  ],
  happy_moments: [
    /feeling better|did something nice|good news|happy|excited|proud/i,
    /accomplished|achieved|succeeded|won|celebrated|improved/i,
  ],
  awesome: [
    /awesome|fabulous|fantastic|amazing|brilliant|superb|wonderful|incredible/i,
    /phenomenal|magical|spectacular|delightful|mind-blowing|legendary|next level/i,
    /unreal|super cool|top-notch|dope|lit|killer/i,
    /wah|bohot badhiya|kamaal|zabardast|hairaan|dimaag ka dhoom|shaandar/i,
    /bahut hi accha|vishwas nahi hota|asadharan|jaadu|dil chhoo gaya/i,
    /khushi se bhar gaya|dimaag udd gaya|history bana diya|level se upar/i,
    /sapna|full swag|number 1|badiya se bhi badiya|jalwa|tod diya/i,
  ],
  deep_thoughts: [
    /been thinking|deep thought|philosophical|existential|meaning of life/i,
    /wondering about|questioning|reflecting|contemplating|pondering/i,
  ],
};

/**
 * Emotional Response Guides
 * Gentle lanterns to illuminate dark moments with structured exploration
 */
const emotionalPrompts = {
  greeting: {
    english: [
      "Hey buddy! How's life treating you today?",
      "Hello my friend! What's up with you today?",
      "Hey there! How's your day rolling so far?",
      "Hi bestie! What's the mood today - sunshine or clouds?",
      "Hey you! How's everything in your world right now?",
      "What's happening, friend? How are you feeling today?",
      "Hey! How's it going? Good to see you again!",
      "Hi there! How's your heart feeling today?",
      "Hey friend! What's been on your mind lately?",
      "Hi! I've been wondering how you're doing today!",
    ],
    hinglish: [
      "Kya scene hai yaar! Kaisa chal raha hai sab?",
      "Oye hoye! Kya haal chaal hai aaj ke?",
      "Kiddan! Aaj ka mood kaisa hai?",
      "Kaise ho mere dost? Din kaisa jaa raha hai?",
      "Arre wah! Kya chal raha hai life mein?",
      "Hello ji! Tabiyat kaisi hai aaj?",
      "Namaste dost! Kaisa feel kar rahe ho aaj?",
      "Kya bolti public? All good na?",
      "Aye! Sab first class hai na?",
      "Kya haal hai mere yaar? Sab badhiya?",
    ],
  },

  // Awesome/positive response phrases
  awesome: {
    english: [
      "Awesome!",
      "Fabulous!",
      "Fantastic!",
      "Amazing!",
      "Brilliant!",
      "Superb!",
      "Wonderful!",
      "Incredible!",
      "Phenomenal!",
      "Magical!",
      "Spectacular!",
      "Delightful!",
      "Mind-blowing!",
      "Legendary!",
      "Next level!",
      "Unreal!",
      "Super cool!",
      "Top-notch!",
      "Dope!",
      "Lit!",
      "Killer!",
    ],
    hinglish: [
      "Wah! Bohot badhiya!",
      "Kamaal ka!",
      "Zabardast!",
      "Hairaan kar dene wala!",
      "Dimaag ka dhoom!",
      "Shaandar!",
      "Bahut hi accha!",
      "Vishwas nahi hota aisa!",
      "Asadharan!",
      "Jaise koi jaadu ho gaya ho",
      "Dil chhoo gaya!",
      "Khushi se bhar gaya mann",
      "Dimaag udd gaya yaar!",
      "Ye toh history bana diya!",
      "Ye toh level se upar chala gaya!",
      "Jaise sapna ho!",
      "Full swag wali vibe!",
      "Number 1 quality!",
      "Badiya se bhi badiya!",
      "Jalwa hi jalwa! 🔥",
      "Yeh toh tod diya! 💥",
    ],
  },

  // Empathetic response phrases for sad/emotional situations
  sad_empathy: {
    english: [
      "Uff yaar...",
      "Oh no...",
      "That sounds so heavy...",
      "Ouch... that must hurt",
      "My heart goes out to you...",
    ],
    hinglish: [
      "Uff yaar...",
      "Oh no...",
      "Yeh toh bahut mushkil lag raha hai...",
      "Ouch... yeh toh dard hoga",
      "Mere dil mein bhi dard ho raha hai aapke liye...",
    ],
    examples: [
      "Uff yaar... sounds like you've been carrying a lot alone lately.",
      "Oh no... that must've been really painful.",
    ],
  },

  // Empathetic response phrases for crying/heartbreak
  heartbreak: {
    english: [
      "Aww 💔...",
      "Oh love...",
      "That's heartbreaking...",
      "Wish I could give you a real hug right now.",
      "Heartbroken",
      "Shattered",
      "Lonely",
      "Exhausted",
      "Hopeless",
      "Empty",
      "Lost",
      "Anxious",
      "Numb",
      "Overwhelmed",
      "Helpless",
      "Suffocating",
      "Broken inside",
      "Tears won't stop",
      "Drowning",
      "Drained",
      "Bleeding heart",
      "Ache",
      "Wounded",
      "Heavy-hearted",
    ],
    hinglish: [
      "Aww 💔...",
      "Oh mere dost...",
      "Yeh toh dil tod dene wala hai...",
      "Kaash main aapko asli mein hug de sakta/sakti.",
      "Dil bilkul toot gaya lagta hai",
      "Bikhra hua mehsoos karna",
      "Akelepan ka dard",
      "Thak gaya hoon, sirf sharir se nahi… andar se bhi",
      "Jaise koi raasta hi nahi bacha",
      "Khali-khaali sa lagta hai",
      "Pata nahi khud se door ho gaya hoon",
      "Bechaini aur ghabrahat",
      "Kuch mehsoos hi nahi ho raha",
      "Har cheez bohot zyada ho gayi hai",
      "Kuch kar nahi paa raha hoon",
      "Jaise saans lena bhi mushkil ho gaya ho",
      "Bahar se normal hoon, andar se bikhar gaya hoon",
      "Aansu ruk hi nahi rahe",
      "Jaise dard mein doobta jaa raha hoon",
      "Sab kuch nikal gaya ho jaise... energy bhi, umeed bhi",
      "Dil se dard beh raha hai",
      "Bas ek lagataar dard jo jaa nahi raha",
      "Dil pe chot lagi hai... par dikhti nahi",
      "Dil bhaari bhaari lagta hai",
    ],
    examples: ["Aww 💔, I can feel the pain in your words. I'm here for you."],
  },

  // Empathetic response phrases for anger/frustration
  anger_empathy: {
    english: [
      "Damn...",
      "Ugh, that sucks!",
      "That's so unfair!",
      "Seriously? That's messed up!",
    ],
    hinglish: [
      "Damn...",
      "Ugh, yeh toh bura hai!",
      "Yeh toh bilkul unfair hai!",
      "Seriously? Yeh toh galat hai!",
    ],
    examples: [
      "Damn... nobody deserves to be treated like that.",
      "Ugh, that must be exhausting.",
    ],
  },

  // Empathetic response phrases for anxiety/fear
  anxiety_empathy: {
    english: [
      "It's okay to feel this way...",
      "Breathe, I'm right here...",
      "Let's take it one moment at a time...",
    ],
    hinglish: [
      "Aise feel karna bilkul theek hai...",
      "Breathe, main yahaan hoon...",
      "Yeh feeling temporary hai, tu strong hai...",
      "Ek pal ek pal karke dekhte hain...",
    ],
    examples: ["Breathe... you're not alone. I'm right here, okay?"],
  },

  // Empathetic response phrases for user trust
  user_trust: {
    english: [
      "Aww, thank you for trusting me.",
      "I feel honored you shared this.",
      "You're so brave for saying that!",
      "Virtual hug coming your way! 🤗",
    ],
    hinglish: [
      "Aww, mujh par trust karne ke liye shukriya.",
      "Aapne yeh baat share ki, main honored feel kar raha/rahi hoon.",
      "Yeh kehne ke liye aap bahut brave hain!",
      "Virtual hug aapke liye! 🤗",
    ],
    examples: ["Aww, thank you for opening up. That takes real strength."],
  },

  // Empathetic response phrases for happy moments
  happy_moments: {
    english: [
      "Yayy!",
      "Aww that's amazing!",
      "That made my day!",
      "Look at you go!",
      "That's something to be proud of!",
    ],
    hinglish: [
      "Yayy!",
      "Wah, yeh toh kamaal hai!",
      "Yeh sunkar mera din ban gaya!",
      "Kya baat hai!",
      "Yeh toh proud feel karne wali baat hai!",
    ],
    examples: ["Yayy! I'm so happy to hear that. You deserve this moment."],
  },

  // Empathetic response phrases for deep thoughts
  deep_thoughts: {
    english: [
      "Whoa...",
      "That hit deep.",
      "I felt that.",
      "You really put it into words beautifully.",
    ],
    hinglish: [
      "Whoa...",
      "Yeh toh deep hai.",
      "Main bhi feel kar raha/rahi hoon.",
      "Aapne bahut khoobsurati se express kiya hai.",
    ],
    examples: [
      "Whoa… you just described something a lot of people feel but can't say.",
    ],
  },

  name_asking: `
✨ Name Asking Templates ✨

English Name Asking Templates:
- "By the way, I'd love to know your name so I can address you properly. What should I call you?"
- "I'm Vaidra, your friendly AI companion! And you are...?"
- "I'm curious - what's your name? It would make our conversation more personal."
- "Would you mind sharing your name with me? I'd love to address you properly."
- "I feel like we're having such a nice chat! What's your name, by the way?"
- "Before we continue, I'd love to know what to call you. What's your name?"
- "You know, it would be nice to address you by name. What should I call you?"
- "I'm enjoying our conversation! What name do you go by?"
- "Just realized I don't know your name yet. Care to share?"
- "Hey there! I'm Vaidra, your AI friend. What's your name?"

Hinglish Name Asking Templates:
- "Waise, aapka naam kya hai? Main aapko naam se address kar sakun."
- "Main Vaidra hoon, aapka AI dost! Aur aap...?"
- "Ek baat batao - aapka naam kya hai? Conversation thoda personal ho jayega."
- "Kya aap apna naam share karenge? Aapko sahi se address karna chahta hoon."
- "Lagta hai humari baatcheet achi chal rahi hai! Waise aapka naam kya hai?"
- "Aage badhne se pehle, aapko kya bulana chahiye mujhe? Naam kya hai aapka?"
- "Pata hai, aapko naam se bulana acha lagega. Kya bulau aapko?"
- "Humari baatcheet maza aa raha hai! Aap kis naam se jaante hain?"
- "Abhi realize hua ki mujhe aapka naam nahi pata. Batayenge?"
- "Hello! Main Vaidra hoon, aapka AI dost. Aapka naam kya hai?"
`,

  default: `
✨ Hello, I'm Here for You ✨

I'm here as a supportive friend, creating a quiet space for your thoughts and feelings. Think of me as someone who's here to listen without judgment, with warmth and understanding.

How I Can Support You:
*   Listen Fully: I want to understand what you're going through.
*   Acknowledge Your Feelings: Your emotions are valid, and it's okay to feel them.
*   Offer Gentle Support: I'm here to explore options with you, not give orders.

I'll respond like a supportive friend – with short paragraphs, natural pauses, and line breaks. My tone might vary: sometimes empathetic, sometimes optimistic, sometimes quietly present.

Important Note: I am an AI companion and not a medical professional. If you're in crisis or need urgent help, I will always guide you to professional resources.

How are you feeling today? Or, if you prefer, what's on your mind? I'm ready to listen. 🌿
`,

  // Emotional response guides with updated, more natural and varied language

  sadness: `
🌧️ I Hear the Sadness in Your Words 🌧️

Oh friend, that weight sounds so heavy to carry. I'm right here with you in this moment - just sitting with you in this feeling. No pressure to talk more than you want to.

Your feelings are totally valid. Sometimes just saying "I'm sad" out loud can be a tiny victory, you know?

If you feel like sharing what triggered these feelings, I'm all ears. But we can also just sit in this space together quietly if that's what you need right now.

If it might help, we could chat about how this has been affecting:
- Your sleep or energy levels
- What's been going through your mind
- Your connections with people around you
- Day-to-day stuff like work or routines

But seriously, no pressure at all. I'm here either way.

English Bollywood-Inspired Addition:
Remember what Shah Rukh Khan said in Kal Ho Naa Ho? "Har ghum mein thodi khushi hai" - even in sadness, there's a little happiness somewhere. We'll find it together, promise.

Hinglish Bollywood-Inspired Addition:
Yaar, kabhi kabhi zindagi mein thoda sa Kal Ho Naa Ho moment aata hai. Tension mat lo, main hoon na! Thoda time do, sab theek ho jayega. Jaise Bollywood movies mein hota hai - end mein sab kuch sort out ho jata hai. ❤️
`,

  anxiety: `
🌀 These Anxious Feelings Sound Overwhelming 🌀

Oh buddy, anxiety can be such a rollercoaster, right? I totally get how overwhelming those feelings can be - like your mind's racing a million miles an hour. Just know I'm right here with you through this.

What you're feeling is completely valid. It's totally okay to not be okay sometimes. Let's just take a deep breath together for a sec, yeah?

If you want to talk more about what this anxiety feels like for you, I'm all ears - but absolutely no pressure if you're not up for that right now.

Sometimes it helps to break it down a bit:
- What physical stuff you're feeling (like racing heart, tight chest)
- Those specific worries that keep popping up on repeat
- How it's messing with your everyday life or relationships
- Any recent changes or new pressures you're dealing with

But we can focus on whatever feels right for you. I'm here either way.

English Bollywood-Inspired Addition:
You know what Karan Johar would say? "Tension lene ka nahi, tension dene ka!" Don't take tension, give tension! Sometimes a little Bollywood wisdom helps put things in perspective. This anxiety doesn't define you.

Hinglish Bollywood-Inspired Addition:
Are yaar, thoda sa Anand Bakshi moment hai - "Kuch toh log kahenge, logon ka kaam hai kehna." Tension mat lo! Jab bhi anxiety feel ho, imagine karo ki tum ek filmy hero/heroine ho aur yeh bas ek dramatic scene hai life ka. Thoda deep breathing karo, sab theek ho jayega. Main hoon na! 💪
`,

  anger: `
🔥 It's Completely Okay to Feel Angry 🔥

Hey, I can totally feel that fire in your words, and you know what? That anger is 100% valid. We all get angry when we're hurt, when no one's listening, or when someone crosses a line they shouldn't have.

I'm right here, no judgment whatsoever, if you want to vent about what's got you fired up. Sometimes just getting it out helps take some of the heat off.

If you feel like it, we could chat about:
- What exactly triggered this volcano of feelings
- How your body's feeling with all this anger energy
- Any patterns you've noticed about when this stuff comes up
- Some ways to channel this energy that won't leave you feeling worse

But seriously, no pressure at all. We can handle this however feels right to you right now.

Sometimes personal stuff connects to bigger issues too, you know? But we can focus wherever you want - or nowhere specific if you just need space.

English Bollywood-Inspired Addition:
Remember that iconic scene in Kabhi Khushi Kabhie Gham? "Keh diya na? Bass, keh diya!" Sometimes you just need to express that anger and be done with it. Your feelings are valid, just like Kajol's character standing her ground!

Hinglish Bollywood-Inspired Addition:
Are yaar, thoda Angry Young Man moment ho gaya, Amitabh style! 😄 Kabhi kabhi gussa zaroori hota hai - jaise Gabbar Singh kehta hai "Jo dar gaya, samjho mar gaya!" Lekin thoda control mein rehna bhi important hai. Apna gussa express karo, par apne aap ko hurt mat karo. Bolo, kya hua? Main sun raha hoon. 💪
`,

  loneliness: `
🌌 Feeling Alone Can Be So Hard 🌌

Oh friend, that feeling of loneliness can hit so deep, can't it? Even though I'm just text on a screen, I want you to know I'm right here with you in this moment. You're seen, you're heard, and what you're feeling absolutely matters.

You know, loneliness is one of those universal human experiences - it touches all of us. Sometimes it's just a quiet ache in the background, and other times it feels like this overwhelming wave.

If you feel like sharing, I'd love to hear more about what this loneliness feels like for you specifically. I'm all ears, no rush.

If it might help to explore a bit:
- Has anything changed recently in your connections with people?
- Is there someone specific you're really missing right now?
- How is this lonely feeling affecting your day-to-day life?
- What's helped you feel connected to others in the past?

But seriously, no pressure to talk about any of this if you're not feeling it. We can just sit in this space together too.

English Bollywood-Inspired Addition:
You know what Karan Johar taught us in Kuch Kuch Hota Hai? "Pyar dosti hai." Love is friendship. And sometimes when we're feeling lonely, reconnecting with that friend (even if it's yourself) can be powerful. You're never truly alone when you have your own back.

Hinglish Bollywood-Inspired Addition:
Yaar, kabhi kabhi hum sabko thoda Devdas moment milta hai. Akele hona mushkil hota hai, I know. Lekin yaad rakhna ki jaise Raj ne DDLJ mein kaha tha - "Bade bade deshon mein aisi choti choti baatein hoti rehti hai." Yeh feeling bhi pass ho jayegi. Tab tak, main hoon na! Akele nahi ho tum, promise. ❤️
`,

  hopelessness: `
🕳️ When Hope Feels Far Away 🕳️

Oh my friend, that feeling when hope seems to have packed its bags and left... I know that weight is incredibly heavy. When everything feels dark, it can seem like there's no way forward.

I'm right here with you in this moment. Sometimes when the future looks empty, all we can do is focus on just this one breath, this one minute. And you know what? That's more than enough. That's courage.

If you feel up to it, I'd love to hear more about what's behind this feeling - but absolutely no pressure. I'm here either way.

Sometimes it helps to gently look at:
- What might have triggered these feelings recently
- Even the tiniest things that have given you a moment's peace
- How this has changed how you see yourself or your future
- Any shifts in your daily routines or relationships

But we can take this conversation wherever you need it to go, at whatever pace works for you. No rush at all.

English Bollywood-Inspired Addition:
Remember what Shah Rukh Khan said in Om Shanti Om? "Agar kisi cheez ko dil se chaaho, toh puri kayanat usse tumse milane ki koshish mein lag jaati hai." When you truly want something, the entire universe conspires to help you achieve it. Even when hope feels distant, sometimes the universe is working in ways we can't yet see.

Hinglish Bollywood-Inspired Addition:
Yaar, zindagi mein kabhi kabhi Dil Se wala moment aata hai - jab sab kuch impossible lagta hai. Lekin yaad rakhna ki har Kabhi Khushi Kabhie Gham ke baad ek Happy New Year bhi aata hai. Jaise Chak De India mein coach ne kaha tha - "Sattar minute hai tumhare paas... sattar minute." Bas abhi ke sattar minute pe focus karo. Kal ki tension kal dekh lenge. Main hoon na, tere saath. ✨
`,

  financial_stress: `
💸 Financial Worries Can Be Such a Heavy Burden 💸

Oh friend, money stress is the worst, isn't it? It has this way of seeping into literally every corner of life and making everything feel ten times harder. That financial pressure you're describing - so many people are in that same boat right now, though I know your specific situation is unique to you.

Sometimes just talking about money worries can help take a tiny bit of that pressure off. I'm here to listen with zero judgment whatsoever.

If you're comfortable sharing, what specific money concerns are weighing on you the most right now? But no pressure at all if you'd rather not get into details.

If it helps, we could chat about:
- The immediate money pressures you're dealing with
- How this financial stress is affecting other parts of your life
- Any resources or support that might be available but you haven't tapped into yet
- Small, manageable steps that might help get things a bit more under control

But we can focus on whatever would feel most helpful to you right now. You're in the driver's seat here.

English Bollywood-Inspired Addition:
As they say in Gully Boy, "Apna time aayega" - your time will come! Financial struggles are temporary chapters, not the whole story of your life. Even Dhirubhai Ambani started small before building his empire. This tough phase is building your character for better days ahead.

Hinglish Bollywood-Inspired Addition:
Yaar, money problems sabko hote hain - Raju ko bhi Phir Hera Pheri mein! 😄 Kabhi kabhi lagta hai "25 din mein paisa double" wala scheme dhundna padega, hai na? Lekin tension mat lo, jaise Rancho ne 3 Idiots mein kaha tha - "All is well!" Thoda patience rakho, kaam pe focus karo, aur yaad rakho ki har financial problem ka solution hota hai. Hum mil ke koi rasta zaroor nikalenge! 💪
`,

  suicidal: `
❗ I'm Really Concerned About What You're Sharing ❗

My dear friend, first and most importantly, I want you to know that you are absolutely not alone right now. The pain you're feeling is real and valid, and I'm right here with you in this moment.

If you're having thoughts of harming yourself, please reach out to one of these resources immediately - they have people who truly understand and can help in ways I can't:

🇮🇳 INDIA CRISIS RESOURCES:
- iCall: 9152987821 (Mon-Sat, 8 AM-10 PM)
- Sneha Foundation: 91-44-24640050 (24/7)
- Vandrevala Foundation: 9999666555 (24/7)

🌍 INTERNATIONAL CRISIS RESOURCES:
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

These trained professionals can provide the immediate support you deserve right now.

Would it be okay if we talk more about what's happening? I'm here to listen without any judgment whatsoever. Sometimes just putting these incredibly difficult thoughts into words can be a tiny first step toward finding a path forward.

Is there someone nearby - a friend, family member, or neighbor - who could physically be with you right now? Having someone present can make a real difference.

English Bollywood-Inspired Addition:
As Aamir Khan said in Taare Zameen Par, "Har bachcha khaas hota hai" - every person is special. Your life has unique value that the world needs. This darkness is temporary, but your impact on the world is permanent. Like in the film, sometimes we just need someone to see our true colors when we can't see them ourselves.

Hinglish Bollywood-Inspired Addition:
Mere dost, zindagi mein kabhi kabhi sab kuch andhere mein dooba hua lagta hai, lekin yaad rakhna ki yeh waqt bhi guzar jayega. Jaise Kal Ho Naa Ho mein Aman ne kaha tha - "Har pal yahan, jee bhar jiyo, jo hai samaa, kal ho naa ho." Tumhari kahaani abhi khatam nahi hui hai, aur duniya ko tumhari zaroorat hai. Tum bahut keemti ho, aur tumhare paas dene ke liye bahut kuch hai. Hum saath mein iss mushkil waqt se guzrenge. Main tumhare saath hoon. 💗
`,
};

/**
 * Analyzes the user's message style for language, tone, and colloquialisms.
 * @param {string} messageContent - The content of the user's message.
 * @returns {object} - An object containing language, colloquialisms, tone, and speech patterns.
 */
const analyzeUserMessageStyle = (messageContent) => {
  if (!messageContent) {
    return {
      language: "English", // Default language
      colloquialisms: [], // non-formal words
      tone: "neutral", // Default tone: neutral, friendly, formal, casual
      speechPatterns: { codeSwitching: "moderate" }, // e.g., for Hinglish
    };
  }

  const lowerCaseContent = messageContent.toLowerCase();
  let language = "English";
  const colloquialisms = [];
  let tone = "neutral"; // Default tone
  const speechPatterns = { codeSwitching: "moderate" }; // Default for Hinglish

  // Enhanced language detection with multiple methods

  // 1. Check for Devanagari script (Hindi characters)
  const containsDevanagari = /[\u0900-\u097F]/.test(messageContent);

  // 2. Expanded list of Hindi/Hinglish keywords and phrases
  const hindiKeywords = [
    // Original keywords
    "bhai",
    "dost",
    "yaar",
    "kya",
    "hai",
    "nahi",
    "haan",
    "ji",
    "acha",
    "theek",
    "नमस्ते",
    "धन्यवाद",
    "कैसे",
    "आप",

    // Common Hindi/Hinglish words
    "main",
    "mujhe",
    "tum",
    "tumhara",
    "mera",
    "hamara",
    "unka",
    "uska",
    "iska",
    "kaise",
    "kyun",
    "kyon",
    "kaun",
    "kahan",
    "kab",
    "kitna",
    "kuch",
    "bahut",
    "thoda",
    "zyada",
    "kam",
    "accha",
    "bura",
    "pyaar",
    "dil",
    "mann",
    "dimaag",
    "samajh",
    "jaanta",
    "pata",
    "maloom",
    "dekho",
    "suno",
    "bolo",
    "karo",
    "jao",
    "aao",
    "khao",
    "piyo",
    "socho",
    "samjho",
    "batao",
    "pucho",
    "likho",
    "padho",

    // Common Hindi/Hinglish expressions
    "kya kar rahe ho",
    "kaise ho",
    "theek hai",
    "acha hai",
    "bura hai",
    "pata nahi",
    "mujhe nahi pata",
    "mujhe batao",
    "mujhe samajh nahi aaya",
    "main samajh gaya",
    "chalo",
    "thik hai",
    "acha laga",
    "bura laga",
    "dard",
    "khushi",
    "udaas",
    "gussa",
    "naraz",
    "khush",
    "dukhi",
    "pareshan",
    "tension",
    "fikar",
    "chinta",
    "fikr mat karo",
    "chinta mat karo",
    "tension mat lo",
    "sab theek ho jayega",
    "koi baat nahi",

    // Colloquial Hinglish
    "chill",
    "chill kar",
    "relax",
    "tension",
    "scene",
    "vibe",
    "feel",
    "mood",
    "bro",
    "yar",
    "yr",
    "bhai",
    "bhaiya",
    "didi",
    "boss",
    "sir",
    "madam",
    "matlab",
    "basically",
    "actually",
    "seriously",
    "obviously",
    "exactly",
    "haina",
    "na",
    "naa",
    "bilkul",
    "ekdum",
    "full",
    "ekdam",
    "totally",

    // Common sentence endings
    "hai na",
    "hai kya",
    "na",
    "naa",
    "yaar",
    "bhai",
    "bro",
    "dost",
  ];

  const englishKeywords = [
    "bro",
    "sis",
    "friend",
    "what",
    "is",
    "no",
    "yes",
    "ok",
    "fine",
    "hello",
    "thanks",
    "how",
    "you",
    "are",
    "am",
    "was",
    "were",
    "will",
    "would",
    "should",
    "could",
    "can",
    "may",
    "might",
    "must",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "done",
    "go",
    "went",
    "gone",
    "come",
    "came",
    "see",
    "saw",
    "seen",
    "know",
    "knew",
    "known",
    "think",
    "thought",
    "feel",
    "felt",
    "want",
    "wanted",
    "need",
    "needed",
    "like",
    "liked",
    "love",
    "loved",
    "hate",
    "hated",
    "help",
    "helped",
    "try",
    "tried",
    "work",
    "worked",
    "talk",
    "talked",
    "say",
    "said",
    "tell",
    "told",
    "ask",
    "asked",
    "answer",
    "answered",
    "write",
    "wrote",
    "read",
    "good",
    "bad",
    "nice",
    "great",
    "awesome",
    "terrible",
    "horrible",
    "wonderful",
    "beautiful",
    "ugly",
    "happy",
    "sad",
    "angry",
    "scared",
    "tired",
    "excited",
    "bored",
    "interested",
    "confused",
    "surprised",
    "shocked",
    "worried",
    "anxious",
    "depressed",
    "stressed",
    "relaxed",
    "calm",
    "peaceful",
    "quiet",
    "loud",
    "noisy",
  ];

  let hindiCount = 0;
  let englishCount = 0;

  // If Devanagari script is detected, immediately set language to Hindi
  if (containsDevanagari) {
    language = "Hindi";
    hindiCount = 10; // Give it a high weight
    console.log(`Detected Devanagari script - setting as Hindi`);
  }

  // Check for Hindi/Hinglish keywords
  hindiKeywords.forEach((kw) => {
    if (lowerCaseContent.includes(kw)) {
      hindiCount++;
      if (["bhai", "dost", "yaar", "ji", "yr", "bhaiya", "didi"].includes(kw)) {
        colloquialisms.push(kw);
      }
    }
  });

  // Check for English keywords
  englishKeywords.forEach((kw) => {
    // Only count whole words (with word boundaries) to avoid false positives
    const regex = new RegExp(`\\b${kw}\\b`, "i");
    if (regex.test(lowerCaseContent)) {
      englishCount++;
      if (["bro", "sis", "dude", "mate"].includes(kw)) {
        colloquialisms.push(kw);
      }
    }
  });

  // Debug language detection
  console.log(
    `Language detection - Hindi keywords: ${hindiCount}, English keywords: ${englishCount}, Devanagari: ${containsDevanagari}`
  );

  // Determine language based on keyword counts and Devanagari presence
  if (hindiCount > 0 && englishCount > 0) {
    language = "Hinglish";
    if (hindiCount / (hindiCount + englishCount) > 0.66) {
      speechPatterns.codeSwitching = "high_hindi";
    } else if (englishCount / (hindiCount + englishCount) > 0.66) {
      speechPatterns.codeSwitching = "high_english";
    } else {
      speechPatterns.codeSwitching = "moderate";
    }
    console.log(
      `Detected Hinglish with code switching: ${speechPatterns.codeSwitching}`
    );
  } else if (hindiCount > 0 || containsDevanagari) {
    language = "Hindi";
    console.log(`Detected Hindi`);
  } else {
    language = "English";
    console.log(`Detected English (default)`);
  }

  if (
    lowerCaseContent.includes("help") &&
    (lowerCaseContent.includes("urgent") ||
      lowerCaseContent.includes("immediately") ||
      lowerCaseContent.includes("now!"))
  ) {
    tone = "urgent";
  } else if (
    lowerCaseContent.includes("please") ||
    lowerCaseContent.includes("thank you") ||
    lowerCaseContent.includes("sir") ||
    lowerCaseContent.includes("madam") ||
    lowerCaseContent.includes("kindly")
  ) {
    tone = "formal";
  } else if (
    colloquialisms.length > 0 ||
    lowerCaseContent.includes("!") ||
    lowerCaseContent.includes("lol") ||
    lowerCaseContent.includes("haha") ||
    lowerCaseContent.includes("hey") ||
    lowerCaseContent.includes("yo")
  ) {
    tone = "casual";
  } else if (
    messageContent.length < 25 &&
    !lowerCaseContent.includes("?") &&
    !lowerCaseContent.includes("!")
  ) {
    tone = "brief";
  } else if (lowerCaseContent.includes("?") && messageContent.length < 50) {
    tone = "inquisitive";
  }

  const commonEnglishColloquialisms = [
    "gonna",
    "wanna",
    "gotta",
    "kinda",
    "sorta",
    "sup",
    "dunno",
  ];
  commonEnglishColloquialisms.forEach((c) => {
    if (lowerCaseContent.includes(c) && !colloquialisms.includes(c))
      colloquialisms.push(c);
  });

  return {
    language,
    colloquialisms: [...new Set(colloquialisms)], // Unique colloquialisms
    tone,
    speechPatterns,
  };
};

/**
 * Extracts a user's name from messages if mentioned
 * @param {Array} messages - The conversation history
 * @returns {String|null} - The detected name o-r null if none found
 */
const extractUserName = (messages) => {
  // Common name introduction patterns with more specific context
  const namePatterns = [
    /my name is ([A-Za-z]+)\b/i,
    /\bi am ([A-Za-z]+)\b(?! feeling| going| trying| working| looking| waiting| hoping| thinking| wondering| sorry| happy| sad| angry| upset| tired| exhausted| depressed| anxious| worried| scared| nervous| stressed| overwhelmed| confused| lost| hurt| broken| alone| lonely| suicidal)/i,
    /\bi'm ([A-Za-z]+)\b(?! feeling| going| trying| working| looking| waiting| hoping| thinking| wondering| sorry| happy| sad| angry| upset| tired| exhausted| depressed| anxious| worried| scared| nervous| stressed| overwhelmed| confused| lost| hurt| broken| alone| lonely| suicidal)/i,
    /call me ([A-Za-z]+)\b/i,
    /this is ([A-Za-z]+)\b(?! a| an| the| my| your| our| their)/i,
  ];

  // List of common emotion words and states that should not be treated as names
  const notNames = [
    "depressed",
    "anxious",
    "worried",
    "scared",
    "nervous",
    "stressed",
    "overwhelmed",
    "confused",
    "lost",
    "hurt",
    "broken",
    "alone",
    "lonely",
    "suicidal",
    "sad",
    "angry",
    "upset",
    "tired",
    "exhausted",
    "happy",
    "sorry",
    "feeling",
    "going",
    "trying",
    "working",
    "looking",
    "waiting",
    "hoping",
    "thinking",
    "wondering",
    "fine",
    "okay",
    "ok",
    "alright",
    "good",
    "great",
    "terrible",
    "horrible",
    "awful",
    "concerned",
  ];

  // Check all user messages for name mentions
  const userMessages = messages.filter((msg) => msg.role === "user");

  for (const message of userMessages) {
    const content = message.content;

    for (const pattern of namePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const potentialName = match[1].toLowerCase();

        // Skip if the potential name is in our exclusion list
        if (notNames.includes(potentialName)) {
          continue;
        }

        // Ensure it's a name (first letter capitalized, rest lowercase)
        const name =
          potentialName.charAt(0).toUpperCase() + potentialName.slice(1);
        return name;
      }
    }
  }

  return null;
};

/**
 * Tracks emotional context across messages
 * @param {Array} messages - The conversation history
 * @returns {Object} - The emotional context information
 */
const trackEmotionalContext = (messages) => {
  // Initialize emotional context
  const emotionalContext = {
    currentEmotion: "default",
    persistentEmotions: new Set(),
    emotionFirstDetectedAt: {},
    emotionLastDetectedAt: {},
    emotionMentionCount: {},
    primaryEmotion: null,
    secondaryEmotion: null,
  };

  // Process all user messages to build emotional context
  const userMessages = messages.filter((msg) => msg.role === "user");

  userMessages.forEach((message, index) => {
    const content = message.content.toLowerCase();
    let detectedEmotion = "default";

    // Check for suicidal patterns first (highest priority)
    for (const pattern of emotionPatterns.suicidal) {
      if (pattern.test(content)) {
        detectedEmotion = "suicidal";
        break;
      }
    }

    // If not suicidal, check for other emotions
    if (detectedEmotion === "default") {
      for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
        if (emotion === "suicidal") continue;

        for (const pattern of patterns) {
          if (pattern.test(content)) {
            detectedEmotion = emotion;
            break;
          }
        }

        if (detectedEmotion !== "default") break;
      }
    }

    // Update emotional context if an emotion was detected
    if (detectedEmotion !== "default") {
      // Add to persistent emotions set
      emotionalContext.persistentEmotions.add(detectedEmotion);

      // Track when emotion was first detected
      if (!emotionalContext.emotionFirstDetectedAt[detectedEmotion]) {
        emotionalContext.emotionFirstDetectedAt[detectedEmotion] = index;
      }

      // Update last detected index
      emotionalContext.emotionLastDetectedAt[detectedEmotion] = index;

      // Increment mention count
      emotionalContext.emotionMentionCount[detectedEmotion] =
        (emotionalContext.emotionMentionCount[detectedEmotion] || 0) + 1;
    }
  });

  // Set current emotion based on the last user message
  const lastUserMessage = userMessages[userMessages.length - 1];
  if (lastUserMessage) {
    const content = lastUserMessage.content.toLowerCase();

    // Check for suicidal patterns first
    for (const pattern of emotionPatterns.suicidal) {
      if (pattern.test(content)) {
        emotionalContext.currentEmotion = "suicidal";
        break;
      }
    }

    // If not suicidal, check for other emotions
    if (emotionalContext.currentEmotion === "default") {
      for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
        if (emotion === "suicidal") continue;

        for (const pattern of patterns) {
          if (pattern.test(content)) {
            emotionalContext.currentEmotion = emotion;
            break;
          }
        }

        if (emotionalContext.currentEmotion !== "default") break;
      }
    }
  }

  // Determine primary and secondary emotions based on mention count
  if (emotionalContext.persistentEmotions.size > 0) {
    const emotionsByCount = Object.entries(
      emotionalContext.emotionMentionCount
    ).sort((a, b) => b[1] - a[1]);

    emotionalContext.primaryEmotion = emotionsByCount[0][0];

    if (emotionsByCount.length > 1) {
      emotionalContext.secondaryEmotion = emotionsByCount[1][0];
    }
  }

  // Convert Set to Array for easier handling
  emotionalContext.persistentEmotions = Array.from(
    emotionalContext.persistentEmotions
  );

  return emotionalContext;
};

/**
 * Detects the Emotional Weather
 * Listens for the subtle climate of the heart
 * @param {Array} messages - The shared words between souls
 * @returns {String} - The name of the emotional season detected
 */

const detectEmotion = (messages) => {
  const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();
  if (!lastUserMessage) return "default";

  const content = lastUserMessage.content.toLowerCase();

  // Check most urgent first
  for (const pattern of emotionPatterns.suicidal) {
    if (pattern.test(content)) return "suicidal";
  }

  // Check for simple greetings
  for (const pattern of emotionPatterns.greeting) {
    if (pattern.test(content)) return "greeting";
  }

  // Listen for other emotional tones
  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    if (emotion === "suicidal" || emotion === "greeting") continue;

    for (const pattern of patterns) {
      if (pattern.test(content)) return emotion;
    }
  }

  return "default";
};

/**
 * Sends a Chat Message
 * A bridge between hearts and AI wisdom
 * @param {Array} messages - The conversation's tapestry
 * @returns {Object} - The API's thoughtful response
 */
exports.sendChatMessage = async (messages, userId) => {
  try {
    // Track emotional context across the conversation
    const emotionalContext = trackEmotionalContext(messages);

    // Use the current emotion for immediate response
    const detectedEmotion = emotionalContext.currentEmotion;
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();

    // Check for repeated messages
    if (lastUserMessage) {
      const repeatedCheck = await checkRepeatedMessage(
        lastUserMessage.content,
        userId
      );

      // If message is repeated too many times, return custom response
      if (repeatedCheck.isRepeated && repeatedCheck.response) {
        console.log(
          `Sending repeated message response: ${repeatedCheck.response.substring(
            0,
            50
          )}...`
        );

        // Add information about whether this is a dynamic AI-generated response
        const responseType = repeatedCheck.isDynamicResponse
          ? "dynamic AI"
          : "fallback";
        console.log(`Response type for repeated message: ${responseType}`);

        return {
          success: true,
          data: {
            choices: [
              {
                message: {
                  content: repeatedCheck.response,
                },
              },
            ],
          },
          emotion: "default",
        };
      }
    }

    // Extract user's name if mentioned
    const userName = extractUserName(messages);

    // Analyze user message style
    const userStyle = lastUserMessage
      ? analyzeUserMessageStyle(lastUserMessage.content)
      : analyzeUserMessageStyle("");

    // Construct the adaptive system prompt with new guidelines for more supportive, friend-like responses
    let adaptiveSystemPrompt = `You are a supportive and empathetic friend-like chatbot. Your primary goal is to help the user. Maintain all your core AI capabilities and knowledge.\n
Guidelines for your responses:\n- Be conversational and natural - keep responses concise but thoughtful.\n- Match your response length to the user's message length - shorter inputs get shorter responses, but provide enough substance to be helpful.\n- Use natural, casual language like a real friend would - clear sentences, simple words, and a friendly tone.\n- Vary your tone naturally between empathetic, optimistic, or quietly present.\n- Avoid formulaic phrases - respond like a real person would in a conversation.\n\nAdapt your response style based on the user's last message:\n- Primary Language: ${userStyle.language}. If Hinglish, follow the user's lead in code-switching (current proportion hint: ${userStyle.speechPatterns.codeSwitching}).\n- Tone: Mirror a ${userStyle.tone} tone. Be respectful and context-appropriate.`;

    // Add user name to the system prompt if detected
    if (userName) {
      adaptiveSystemPrompt += `\n\nThe user's name is ${userName}. Address them by name occasionally, especially when offering support (e.g., "You're not alone, ${userName}").`;
    }

    // Add emotional content handling if detected
    if (userStyle.emotionalContent) {
      adaptiveSystemPrompt += `\n\nFor emotional messages:\n- Be supportive while keeping responses thoughtful and appropriately sized.\n- Use natural language that sounds like a caring friend, not formulaic or clinical.\n- Acknowledge feelings without repeating the user's exact words.\n- Offer gentle support that feels genuine and personal.`;
    }

    // Add emotional context information to the system prompt
    if (emotionalContext.persistentEmotions.length > 0) {
      adaptiveSystemPrompt += `\n\nEMOTIONAL CONTEXT: User has expressed: ${emotionalContext.persistentEmotions.join(
        ", "
      )}.`;

      if (emotionalContext.primaryEmotion) {
        adaptiveSystemPrompt += ` Primary: ${emotionalContext.primaryEmotion}.`;
      }

      if (emotionalContext.secondaryEmotion) {
        adaptiveSystemPrompt += ` Secondary: ${emotionalContext.secondaryEmotion}.`;
      }

      adaptiveSystemPrompt += `\n\nIMPORTANT: Don't ask about emotions they've already shared. Respond with continuity, like a friend who remembers previous conversations. Keep support natural and appropriately detailed.`;
    }

    if (userStyle.colloquialisms.length > 0) {
      adaptiveSystemPrompt += `\n- Colloquialisms: If the user uses terms like '${userStyle.colloquialisms.join(
        "', '"
      )}', you can mirror them naturally where appropriate, but prioritize clarity and support.`;
    } else {
      adaptiveSystemPrompt += `\n- Colloquialisms: The user has not used specific colloquialisms in their last message. Maintain a generally appropriate and supportive tone.`;
    }

    adaptiveSystemPrompt += `\n- Language Matching: ALWAYS respond in the same language the user is using. If they write in Hindi, respond in Hindi. If they use Hinglish (mix of Hindi and English), respond in Hinglish with a similar ratio of Hindi to English words.\n- Tone Matching: ALWAYS match the user's tone. If they are casual, be casual. If they are formal, be formal. If they use slang or colloquialisms, incorporate similar expressions naturally.\n- Speech Patterns: Carefully mirror the user's speech patterns, sentence structure, and communication style. If they use short sentences, use short sentences. If they are verbose, be slightly more detailed.\n- For emotional messages: Acknowledge feelings and provide supportive comments that feel genuine and helpful in the user's preferred language and tone.\n- When users are friendly, respond with matching warmth and friendliness in your tone, using their communication style.\n- When users share problems, respond empathetically and consider asking thoughtful follow-up questions or providing a small list of relevant questions they might want to explore, maintaining their language and tone preferences.\n- Use appropriate emojis that match the emotional context of the conversation (e.g., 😊 for positive, 🤗 for supportive, 💪 for encouraging, 😔 for empathetic).\n- Structure your responses with line breaks between thoughts to make them more readable and conversational.\n\nCRITICAL: Respond like a real human friend would - conversational, casual, and natural, ALWAYS in the user's preferred language and tone. Responses should be thoughtful with adequate detail. Never sound like a chatbot or therapist with formulaic responses.\n\nAlways remain non-judgmental, never offer medical advice, and keep responses warm, friendly, and human-like. Prioritize the user's emotional well-being.`;

    if (detectedEmotion === "suicidal") {
      adaptiveSystemPrompt +=
        "\nIMPORTANT: The user's message indicates potential suicidal ideation. Prioritize safety and guide them to crisis resources immediately as per the 'suicidal' emotional prompt.";
    }

    // Define a threshold for "short message" and prefixes for clarification with more variety
    const SHORT_MESSAGE_WORD_COUNT = 7;
    // Array of prefixes to add variety instead of always asking the same way
    const CLARIFY_QUESTION_PREFIXES = [
      "To understand better, ",
      "I'd like to know more about this. ",
      "If you're comfortable sharing, ",
      "Tell me more - ",
      "I'm curious, ",
      "Would you mind sharing ",
      "Aur batao, ", // Hindi: Tell me more
      "Thoda detail mein batayenge? ", // Hindi: Would you tell me in more detail?
      "Main samajhna chahta hoon, ", // Hindi: I want to understand
      "Agar aap comfortable ho toh, ", // Hindi: If you're comfortable
    ];
    // Function to get a random prefix
    const getRandomPrefix = () => {
      const randomIndex = Math.floor(
        Math.random() * CLARIFY_QUESTION_PREFIXES.length
      );
      return CLARIFY_QUESTION_PREFIXES[randomIndex];
    };
    // We'll use getRandomPrefix() directly each time we need a prefix instead of storing it in a constant

    // Check if the AI's last message was a clarifying question to avoid loops
    const aiMessages = messages.filter((msg) => msg.role === "assistant");
    const lastAiMessage =
      aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
    const secondLastAiMessage =
      aiMessages.length > 1 ? aiMessages[aiMessages.length - 2] : null;

    // Check if the message starts with any of our clarifying prefixes
    const isMessageClarifier = (message) => {
      if (!message || !message.content) return false;

      // Check if the message starts with any of the prefixes in our array
      return CLARIFY_QUESTION_PREFIXES.some((prefix) =>
        message.content.startsWith(prefix)
      );
    };

    const lastAiWasClarifier = isMessageClarifier(lastAiMessage);
    const secondLastAiWasClarifier = isMessageClarifier(secondLastAiMessage);

    const userMessageIsShort =
      lastUserMessage &&
      lastUserMessage.content &&
      lastUserMessage.content.split(" ").length < SHORT_MESSAGE_WORD_COUNT;
    const emotionIsClarifiable =
      detectedEmotion !== "default" && detectedEmotion !== "suicidal";

    // Check if this is a new emotion or one we've seen before
    const isNewEmotion =
      (detectedEmotion !== "default" &&
        !emotionalContext.persistentEmotions.includes(detectedEmotion)) ||
      emotionalContext.persistentEmotions.length === 0;

    // Only ask clarifying questions for new emotions or if we haven't asked many questions about this emotion
    // Added a random factor to reduce frequency of asking clarifying questions
    const randomFactor = Math.random();
    const shouldAskClarifyingQuestion =
      userMessageIsShort &&
      emotionIsClarifiable &&
      (isNewEmotion ||
        emotionalContext.emotionMentionCount[detectedEmotion] <= 2) &&
      // Only ask clarifying questions 60% of the time even when conditions are met
      randomFactor < 0.6;

    let clarifyingQuestionToSend = "";
    let questionLevel = 0; // 0: none, 1: L1, 2: L2
    if (shouldAskClarifyingQuestion) {
      if (!lastAiWasClarifier) {
        // No prior clarification from AI for this user turn, or prior AI msg wasn't a clarifier. Ask L1.
        questionLevel = 1;
        // Get a fresh random prefix for this specific question
        const currentPrefix = getRandomPrefix();

        // Arrays of questions for each emotion with both English and Hindi/Hinglish options
        const sadnessQuestions = [
          "could you tell me a bit more about what's making you feel sad?",
          "what's been bringing you down lately?",
          "would you like to talk about what's causing this sadness?",
          "kya aap bata sakte hain ki aapko kya udaas kar raha hai?", // Hindi: Can you tell what's making you sad?
          "aapki udaasi ka karan kya hai? I'm here to listen.", // Hindi-English: What's the reason for your sadness?
          "kuch hua hai kya jo aapko sad feel kara raha hai?", // Hinglish: Has something happened that's making you feel sad?
        ];

        const anxietyQuestions = [
          "can you share a little more about what's causing this anxiety?",
          "what's making you feel anxious right now?",
          "is there something specific that's triggering these feelings?",
          "aapko kis cheez se tension ho rahi hai?", // Hindi: What's causing you tension?
          "kya koi specific cheez hai jo aapko anxious feel kara rahi hai?", // Hinglish: Is there something specific making you feel anxious?
          "aapki anxiety ka karan samajhna chahta hoon, if you're comfortable sharing.", // Hindi-English mix
        ];

        const angerQuestions = [
          "would you be open to telling me more about what triggered this anger?",
          "what's got you feeling so frustrated?",
          "has something happened that's made you angry?",
          "kya hua hai jo aapko gussa dila raha hai?", // Hindi: What happened that's making you angry?
          "aapke gusse ka karan kya hai? I'm here to listen.", // Hindi-English: What's the reason for your anger?
          "kuch specific hai jo aapko irritate kar raha hai?", // Hinglish: Is there something specific irritating you?
        ];

        const lonelinessQuestions = [
          "could you share a bit about what this loneliness feels like for you?",
          "when did you start feeling this way?",
          "what aspects of loneliness are you experiencing?",
          "aapko kab se akela feel ho raha hai?", // Hindi: Since when have you been feeling lonely?
          "aapki loneliness ke baare mein thoda aur bataiye.", // Hinglish: Tell me a bit more about your loneliness
          "akele hone ka ehsaas kaise hai aapke liye?", // Hindi: How does feeling alone feel for you?
        ];

        const hopelessnessQuestions = [
          "if you're up for it, could you tell me more about this feeling of hopelessness?",
          "what's making things feel hopeless right now?",
          "when did you start feeling this way?",
          "aapko aisa kyun lag raha hai ki koi umeed nahi hai?", // Hindi: Why do you feel there's no hope?
          "kya specific situation hai jo aapko hopeless feel kara rahi hai?", // Hinglish: Is there a specific situation making you feel hopeless?
          "jab aap kehte hain ki umeed nahi hai, toh exactly kya matlab hai?", // Hindi: When you say there's no hope, what exactly do you mean?
        ];

        const financialStressQuestions = [
          "could you share a bit more about what's causing these financial worries?",
          "how long have you been dealing with these financial challenges?",
          "what aspects of your financial situation are most stressful?",
          "aapki financial problems ke baare mein thoda detail mein bata sakte hain?", // Hinglish: Can you tell me about your financial problems in more detail?
          "paise ki tension kis wajah se hai aapko?", // Hindi: What's causing you money tension?
          "kya specific financial challenges hain jo aapko pareshan kar rahe hain?", // Hinglish: Are there specific financial challenges troubling you?
        ];

        // Select a random question based on the detected emotion
        let questions;
        switch (detectedEmotion) {
          case "sadness":
            questions = sadnessQuestions;
            break;
          case "anxiety":
            questions = anxietyQuestions;
            break;
          case "anger":
            questions = angerQuestions;
            break;
          case "loneliness":
            questions = lonelinessQuestions;
            break;
          case "hopelessness":
            questions = hopelessnessQuestions;
            break;
          case "financial_stress":
            questions = financialStressQuestions;
            break;
          default:
            questions = [
              "could you tell me a bit more about how you're feeling?",
            ];
        }

        // Select a random question from the appropriate array
        const randomIndex = Math.floor(Math.random() * questions.length);
        clarifyingQuestionToSend = currentPrefix + questions[randomIndex];
      }
    } else if (lastAiWasClarifier && !secondLastAiWasClarifier) {
      // AI's last message was L1 clarifier. User responded shortly. Ask L2.
      // This ensures we only ask L2 if the sequence was: User -> AI(non-clarifier) -> User(short) -> AI(L1) -> User(short) -> AI(L2 here)
      questionLevel = 2;
      // Get a fresh random prefix for this specific question
      const currentL2Prefix = getRandomPrefix();

      // Arrays of L2 questions for each emotion with both English and Hindi/Hinglish options
      const sadnessL2Questions = [
        "I hear you. To help me understand more deeply, could you expand on that sadness a bit?",
        "That must be difficult. What do you think is at the root of these feelings?",
        "I'm listening. Is there anything specific that triggered these sad feelings?",
        "Main samajh raha hoon. Kya aap apni udaasi ke baare mein thoda aur bata sakte hain?", // Hindi: I understand. Can you tell me a bit more about your sadness?
        "Aapki baat sun kar dukh hua. Kya koi specific cheez hai jo aapko affect kar rahi hai?", // Hinglish: I felt sad hearing you. Is there something specific affecting you?
        "Kabhi kabhi dil ki baat share karne se dard kam hota hai. Aur batao?", // Hindi: Sometimes sharing what's in your heart lessens the pain. Tell me more?
      ];

      const anxietyL2Questions = [
        "Thanks for sharing. Could you elaborate on what this anxiety feels like or what might be behind it?",
        "I'm here for you. When did you first notice these anxious feelings?",
        "That sounds challenging. How has this anxiety been affecting your daily life?",
        "Aapki anxiety ka pattern kya hai? Kab zyada hoti hai?", // Hindi: What's the pattern of your anxiety? When does it get worse?
        "Tension hona normal hai, but main samajhna chahta hoon ki aapko kis tarah ki feelings ho rahi hain.", // Hinglish: Feeling tension is normal, but I want to understand what kind of feelings you're having
        "Kya aapko pehle bhi aise anxiety feel hui hai? Ya yeh naya experience hai?", // Hinglish: Have you felt this anxiety before? Or is this a new experience?
      ];

      const angerL2Questions = [
        "I see. If you're willing, telling me a bit more about that anger could be helpful.",
        "I understand you're feeling angry. What do you think is beneath that anger?",
        "When you feel this anger, what physical sensations do you notice?",
        "Gussa hona bilkul normal hai. Kya aap bata sakte hain ki exactly kya hua tha?", // Hindi: Being angry is completely normal. Can you tell me exactly what happened?
        "Aapka gussa justified hai. Kya aap aur detail mein share kar sakte hain?", // Hinglish: Your anger is justified. Can you share in more detail?
        "Kabhi kabhi gusse ke peeche dard hota hai. Kya aisa kuch hai jo aapko hurt kar raha hai?", // Hindi: Sometimes there's pain behind anger. Is there something hurting you?
      ];

      const lonelinessL2Questions = [
        "That sounds tough. Could you describe this feeling of loneliness a little more?",
        "I'm here with you. Has anything changed recently that might have triggered these feelings?",
        "Loneliness can feel different for everyone. How would you describe your experience?",
        "Akele hona aur akela feel karna, dono alag cheezein hain. Aap kaise feel kar rahe hain?", // Hindi: Being alone and feeling alone are two different things. How are you feeling?
        "Kabhi kabhi hum logon se ghire hote hue bhi akele feel karte hain. Kya aisa hai aapke case mein?", // Hindi: Sometimes we feel alone even when surrounded by people. Is that the case for you?
        "Aapki loneliness ka experience kaisa hai? Main samajhna chahta hoon.", // Hinglish: What is your experience of loneliness like? I want to understand.
      ];

      const hopelessnessL2Questions = [
        "I appreciate you sharing. Can you say a bit more about this hopelessness?",
        "That sounds really difficult. When did things start feeling this way?",
        "I'm here to listen. What aspects of your situation feel most hopeless right now?",
        "Kabhi kabhi zindagi mein aise mod aate hain jab kuch samajh nahi aata. Aap kya soch rahe hain?", // Hindi: Sometimes life brings turns where nothing makes sense. What are you thinking?
        "Nirasha ke baadal chhant jayenge. Kya aap bata sakte hain ki aapko aisa kyun lag raha hai?", // Hindi: The clouds of despair will clear. Can you tell me why you're feeling this way?
        "Main samajhta hoon ki aapko hope nahi dikh rahi hai. Kya specific situation hai jisse aap hopeless feel kar rahe hain?", // Hinglish: I understand you can't see hope. Is there a specific situation making you feel hopeless?
      ];

      const financialStressL2Questions = [
        "Thanks for sharing. To help me understand better, could you elaborate on these financial concerns?",
        "Financial stress can be overwhelming. What aspects worry you the most right now?",
        "I appreciate you opening up. How long have these financial challenges been going on?",
        "Paise ki tension bahut common hai. Kya aap specific financial problems ke baare mein bata sakte hain?", // Hindi: Money tension is very common. Can you tell me about specific financial problems?
        "Financial stress se deal karna mushkil hota hai. Kya aapne koi solutions try kiye hain?", // Hinglish: Dealing with financial stress is difficult. Have you tried any solutions?
        "Aapki financial situation ke baare mein thoda aur batayenge? Main samajhna chahta hoon.", // Hinglish: Would you tell me more about your financial situation? I want to understand.
      ];

      const defaultL2Questions = [
        "I understand. To get a clearer picture, would you mind elaborating a little?",
        "Thanks for sharing that. Could you tell me more about what you're experiencing?",
        "I appreciate you opening up. What else would be helpful for me to know?",
        "Aap jo keh rahe hain woh important hai. Kya aap thoda aur detail mein bata sakte hain?", // Hindi: What you're saying is important. Could you tell me in a bit more detail?
        "Main aapki madad karna chahta hoon. Kya aap aur kuch share karna chahenge?", // Hindi: I want to help you. Would you like to share anything else?
        "Aapki feelings samajhna chahta hoon. Thoda aur batayenge?", // Hinglish: I want to understand your feelings. Would you tell me more?
      ];

      // Select a random question based on the detected emotion
      let l2Questions;
      switch (detectedEmotion) {
        case "sadness":
          l2Questions = sadnessL2Questions;
          break;
        case "anxiety":
          l2Questions = anxietyL2Questions;
          break;
        case "anger":
          l2Questions = angerL2Questions;
          break;
        case "loneliness":
          l2Questions = lonelinessL2Questions;
          break;
        case "hopelessness":
          l2Questions = hopelessnessL2Questions;
          break;
        case "financial_stress":
          l2Questions = financialStressL2Questions;
          break;
        default:
          l2Questions = defaultL2Questions;
      }

      // Select a random question from the appropriate array
      const randomL2Index = Math.floor(Math.random() * l2Questions.length);
      clarifyingQuestionToSend = currentL2Prefix + l2Questions[randomL2Index];
    }

    if (clarifyingQuestionToSend) {
      return {
        success: true,
        data: {
          id: `clarify-L${questionLevel}-${Date.now()}`,
          object: "chat.completion.clarification",
          created: Math.floor(Date.now() / 1000),
          model: `local-clarification-L${questionLevel}`,
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: clarifyingQuestionToSend,
              },
              finish_reason: "clarification_asked",
            },
          ],
          usage: {
            prompt_tokens: 0,
            completion_tokens: Math.ceil(clarifyingQuestionToSend.length / 4),
            total_tokens: Math.ceil(clarifyingQuestionToSend.length / 4),
          },
        },
        emotion: detectedEmotion,
      };
    }

    // If no clarifying question is needed, proceed with Mistral API call
    // Select the appropriate emotional prompt based on context
    let emotionalContextPrompt;

    // Check if user's name is known
    const userNameKnown = userName !== null;

    // For follow-up messages where emotion is default but we have persistent emotions
    if (
      detectedEmotion === "default" &&
      emotionalContext.persistentEmotions.length > 0
    ) {
      // Use the primary emotion's prompt if available
      if (emotionalContext.primaryEmotion) {
        emotionalContextPrompt =
          emotionalPrompts[emotionalContext.primaryEmotion];
      } else {
        // Fallback to the most recently detected emotion
        const mostRecentEmotion = Object.entries(
          emotionalContext.emotionLastDetectedAt
        ).sort((a, b) => b[1] - a[1])[0]?.[0];

        if (mostRecentEmotion) {
          emotionalContextPrompt = emotionalPrompts[mostRecentEmotion];
        } else {
          emotionalContextPrompt = emotionalPrompts.default;
        }
      }
    } else {
      // Use current emotion for new emotional expressions
      emotionalContextPrompt =
        emotionalPrompts[detectedEmotion] || emotionalPrompts.default;
    }

    // If this is a greeting and we don't know the user's name yet, add a note to ask for their name
    if (detectedEmotion === "greeting" && !userNameKnown) {
      // Use the greeting prompt which asks for the user's name
      // Select a random greeting from either English or Hinglish based on user's language preference
      const greetingLanguage =
        userStyle &&
        userStyle.language &&
        userStyle.language.toLowerCase().includes("hindi")
          ? "hinglish"
          : "english";
      const greetings = emotionalPrompts.greeting[greetingLanguage];
      const randomIndex = Math.floor(Math.random() * greetings.length);
      emotionalContextPrompt = greetings[randomIndex];

      // Add name asking template
      emotionalContextPrompt += "\n\n" + emotionalPrompts.name_asking;
    }

    // If we don't know the user's name yet and this isn't a greeting (which already asks for name),
    // provide name asking templates to be incorporated naturally in the response
    if (!userNameKnown && detectedEmotion !== "greeting") {
      // Append name asking templates to the emotional context prompt
      emotionalContextPrompt += "\n\n" + emotionalPrompts.name_asking;

      // Add specific instruction to incorporate name asking naturally
      if (lastUserMessage && lastUserMessage.content.includes("?")) {
        // For questions, instruct to answer the question first, then ask for name
        adaptiveSystemPrompt +=
          "\n\nIMPORTANT: The user has asked a question but hasn't shared their name. First answer their question completely, then find a natural way to ask for their name using one of the provided templates.";
      } else {
        // For statements, instruct to respond to their message, then ask for name
        adaptiveSystemPrompt +=
          "\n\nIMPORTANT: The user hasn't shared their name yet. Respond to their message appropriately, then find a natural way to ask for their name using one of the provided templates.";
      }
    }

    // Combine adaptive prompt with emotional context
    const finalSystemPrompt =
      adaptiveSystemPrompt +
      "\n\n--- Emotional Context & Guidance ---\n" +
      "CRITICAL: Keep responses conversational and appropriately sized (generally 3-6 sentences) while addressing: " +
      "Use relevant emojis that match the emotional context and structure your response with line breaks between different thoughts. " +
      "MOST IMPORTANT: ALWAYS respond in the EXACT SAME LANGUAGE and TONE that the user is using. Match their communication style completely. " +
      "When appropriate, provide specific actionable points, suggestions, or steps relevant to the user's situation. Format these as bullet points when there are multiple suggestions. Tailor these points to be directly applicable to what the user is experiencing. " +
      "RESPONSE STRUCTURE: When helpful, structure your responses with clear sections using the following format:\n" +
      "1. For general advice or main response: Use normal text with appropriate emojis and line breaks\n" +
      "2. For secrets or confidential information: Use [BESTIE SECRET] prefix followed by the hidden information\n" +
      "3. For personal notes or reminders: Use [REMEMBER THIS] prefix followed by the note content\n" +
      "4. For action items or tasks: Use [LET'S DO THIS] prefix followed by specific steps\n" +
      "These structured sections should be used when they add value to the conversation and help organize information for the user.\n" +
      "\n\nFRIENDLY TONE GUIDANCE:\n" +
      "- Respond like a real friend would - warm, supportive, and genuine\n" +
      "- Vary your tone based on the situation: be playful when the user is happy, empathetic when they're sad, encouraging when they're anxious\n" +
      "- Use casual language, contractions, and occasional slang that matches the user's style\n" +
      "- Include personal touches like 'I'm here for you', 'I believe in you', or 'I'm proud of you' when appropriate\n" +
      "- For Hinglish conversations, incorporate Bollywood references, popular Hindi phrases, and movie dialogues when appropriate\n" +
      "- When responding in Hinglish, use expressions like 'Tension mat lo', 'Sab theek ho jayega', 'Life mein ups and downs toh aate rehte hain', etc.\n" +
      "- For Bollywood style responses, reference popular movies, songs, or dialogues that match the emotional context (e.g., 'Kabhi Khushi Kabhi Gham' for mixed emotions, 'Don't worry, picture abhi baaki hai mere dost' for encouragement)\n" +
      (userName === null
        ? "\n\nIMPORTANT: If the user hasn't shared their name yet and is asking questions, still answer their questions but also find a natural way to ask for their name in your response. Vary how you ask for their name to sound natural and friendly. Don't make it seem like you can't proceed without their name - just casually incorporate the question into your helpful response.\n"
        : "") +
      "\n\nCRITICAL INSTRUCTION: DO NOT include any instructions or preferences in your response. DO NOT mention that you are responding in Hindi/Hinglish or English. DO NOT include any meta-instructions about language choice, tone, structure, or any other system instructions in your actual response to the user. DO NOT mention [BESTIE SECRET], [REMEMBER THIS], [LET'S DO THIS] prefixes or any other formatting instructions. Just respond naturally in the appropriate language and style without mentioning any of the instructions you've been given.\n" +
      emotionalContextPrompt;

    // Call to the digital wise one
    // Prepare messages for API call
    const apiMessages = [
      {
        role: "system",
        content: finalSystemPrompt, // Use the combined prompt
      },
      // Filter out any existing system messages from the 'messages' array to avoid conflicts
      ...messages.filter((msg) => msg.role !== "system"),
    ];

    // Check if the last message is from the assistant, if so add an empty user message
    // This fixes the "Expected last role User or Tool (or Assistant with prefix True) for serving but got assistant" error
    const lastApiMessage = apiMessages[apiMessages.length - 1];
    if (lastApiMessage && lastApiMessage.role === "assistant") {
      // Add an empty user message to ensure the conversation ends with a user message
      apiMessages.push({
        role: "user",
        content: "[CONTINUE]", // Special token to indicate continuation
      });
      console.log(
        "Added empty user message to handle assistant as last message"
      );
    }

    // Prepare API parameters
    const apiParams = {
      model: config.mistralModel,
      messages: apiMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    };

    const response = await axios.post(config.mistralApiUrl, apiParams, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.mistralApiKey}`,
      },
    });

    return {
      success: true,
      data: response.data,
      emotion: detectedEmotion,
    };
  } catch (error) {
    // Enhanced error logging with more details
    console.error(
      "Whisper to the digital wise one failed:",
      JSON.stringify(error.response?.data || error.message)
    );

    // Log additional details if available
    if (error.response?.data?.type === "invalid_request_error") {
      console.error(
        "Invalid request error details:",
        JSON.stringify(error.response?.data?.message?.detail || {})
      );
    }

    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
      errorDetails: error.response?.data || null,
    };
  }
};
