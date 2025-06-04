const axios = require("axios");
const config = require("../config/config");

/**
 * Emotion Detection Patterns
 * Carefully crafted to listen for the whispers of the heart
 */

const emotionPatterns = {
  sadness: [
    /sad|depressed|unhappy|miserable|down|blue|gloomy|heartbroken|hopeless|grief|crying/i,
    /don't feel like|no energy|exhausted|tired of|can't take it|giving up/i,
  ],
  anxiety: [
    /anxious|worried|nervous|panic|stress|overwhelmed|fear|scared|terrified|uneasy/i,
    /what if|might happen|can't stop thinking|racing thoughts|heart racing/i,
  ],
  anger: [
    /angry|frustrated|irritated|annoyed|mad|furious|rage|hate|resent/i,
    /unfair|shouldn't have|always happens|never works/i,
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
};

/**
 * Emotional Response Guides
 * Gentle lanterns to illuminate dark moments with structured exploration
 */
const emotionalPrompts = {
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

That weight must be incredibly difficult to bear. I'm here to sit with you in this feeling, offering a space where you can share without any pressure.

Your feelings are valid, and they deserve to be heard. Sometimes just naming the sadness can be a small step.

Would you like to share more about what might have triggered these feelings? I'm here for you, however you'd like to proceed.

If it helps, we could explore how this has affected your:
- Sleep, energy, or physical health
- Thoughts and emotions
- Relationships with others
- Work or daily life

But there's no pressure to discuss any of this if you'd prefer not to.
`,

  anxiety: `
🌀 These Anxious Feelings Sound Overwhelming 🌀

It sounds like you're experiencing a lot of anxiety right now. I want you to know that I understand these feelings are powerful and very real. You're not alone in this.

Your feelings make sense, and it's okay to not be okay. Let's try to find a moment of calm together.

Would you be open to telling me a little more about what this anxiety feels like for you? There's no pressure at all.

Sometimes it helps to look at:
- Physical sensations you're experiencing
- Specific worries that keep returning
- How it's affecting your daily life or relationships
- Recent changes or pressures

But we can focus on whatever feels most helpful right now.
`,

  anger: `
🔥 It's Completely Okay to Feel Angry 🔥

I sense a strong feeling of anger, and that's completely valid. Anger often comes up when we feel hurt, unheard, or when a boundary has been crossed.

I'm here to listen without judgment if you want to talk about what's causing this anger. Sometimes, understanding the source can help.

If you'd like, we could explore:
- What might have triggered these feelings
- How this anger is affecting you physically
- Any patterns you've noticed in when it arises
- Ways to express or channel this energy

But there's no pressure - we can approach this however feels right to you.

* Are there larger social issues connecting to your personal experience?

We don't need to discuss all of these - or any of them if you prefer. If you feel comfortable, would you like to share more about what triggered this feeling? Or perhaps focus on a particular aspect? Take your time.
`,

  loneliness: `
🌌 Feeling Alone Can Be So Hard 🌌

That sense of loneliness you're describing - it's such a difficult feeling to sit with. I'm here with you in this moment, even through this screen. You're seen and your feelings matter.

Loneliness touches all of us at different times. Sometimes it's a quiet ache, other times it feels overwhelming.

Would you like to share a bit about what this loneliness feels like for you? I'm here to listen.

If it helps, we could talk about:
- Recent changes in your social connections
- Specific relationships you might be missing
- How this feeling is affecting your daily life
- Ways you've found connection in the past

But there's no pressure to discuss any of this if you'd prefer not to.
`,

  hopelessness: `
🕳️ When Hope Feels Far Away 🕳️

That weight of hopelessness you're describing - it's such a heavy burden to carry. The darkness can feel all-encompassing sometimes.

I'm sitting here with you in this moment. When the future seems empty, sometimes all we can do is get through one breath, one minute at a time. And that's enough.

If you're up for it, would you like to share a bit more about what's behind this feeling? I'm here to listen, no pressure at all.

Sometimes it helps to explore:
- What might have triggered these feelings
- Small things that have provided even moments of relief
- How your view of yourself or the future has been affected
- Any changes in your daily life or relationships

But we can take this at whatever pace feels right for you.
`,

  financial_stress: `
💸 Financial Worries Can Be Such a Heavy Burden 💸

Money worries can seep into every part of life and make everything feel more difficult. That financial pressure you're describing is something many people struggle with, though each person's situation is unique.

Talking about these concerns might help ease some of that pressure. I'm here to listen without any judgment.

If you feel comfortable, would you like to share what specific financial concerns are weighing on you most right now?

Some aspects we could explore if helpful:
- Immediate financial pressures you're facing
- How this stress is affecting other areas of your life
- Resources or support that might be available
- Small steps that might help manage the situation

But we can focus on whatever would be most helpful for you right now.
`,

  suicidal: `
🚨 Your Safety is My Utmost Concern Right Now 🚨

I can hear how much pain you're in right now. That level of suffering is something no one should have to bear alone. Your life matters deeply, even when it doesn't feel that way.

When things get this overwhelming, reaching out for immediate support is crucial. There are people who are trained specifically to help during moments like this.

Please, let's get you some immediate support:

*   Call or Text a Crisis Line:
    *   🇺🇸🇨🇦 USA & Canada: Call or text 988 (Veterans: Press 1)
    *   🇺🇸 USA (Alt.): Call 1-800-273-TALK (1-800-273-8255)
    *   🇬🇧 UK: Call 111 or the Samaritans at 116 123
    *   🇦🇺 Australia: Call Lifeline at 13 11 14
    *   🌍 Worldwide: Visit findahelpline.com or www.iasp.info/crisis-centres/

*   If you are in immediate danger or have a plan to harm yourself, please call emergency services (e.g., 911, 999, 112) or go to the nearest emergency room right away.

I'm here with you in this moment, but connecting with crisis support needs to be the priority right now. These services exist because so many people go through dark times like this - you're not alone in these feelings.

These intense feelings can change with proper support. Right now, reaching out for immediate help is the most important step. You deserve that support, and a different future is possible.
`,
};

/**
 * Detects the Emotional Weather
 * Listens for the subtle climate of the heart
 * @param {Array} messages - The shared words between souls
 * @returns {String} - The name of the emotional season detected
 */
/**
 * Analyzes the user's message style for language, tone, and colloquialisms.
 * @param {string} messageContent - The content of the user's message.
 * @returns {object} - An object containing language, colloquialisms, tone, and speech patterns.
 */
const analyzeUserMessageStyle = (messageContent) => {
  if (!messageContent) {
    return {
      language: "English", // Default language
      colloquialisms: [],
      tone: "neutral", // Default tone: neutral, friendly, formal, casual
      speechPatterns: { codeSwitching: "moderate" }, // e.g., for Hinglish
    };
  }

  const lowerCaseContent = messageContent.toLowerCase();
  let language = "English";
  const colloquialisms = [];
  let tone = "neutral"; // Default tone
  const speechPatterns = { codeSwitching: "moderate" }; // Default for Hinglish

  // Basic language detection (can be expanded)
  const hindiKeywords = [
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
  ];

  let hindiCount = 0;
  let englishCount = 0;

  hindiKeywords.forEach((kw) => {
    if (lowerCaseContent.includes(kw)) {
      hindiCount++;
      if (["bhai", "dost", "yaar", "ji"].includes(kw)) colloquialisms.push(kw);
    }
  });

  englishKeywords.forEach((kw) => {
    if (lowerCaseContent.includes(kw)) {
      englishCount++;
      if (["bro", "sis", "dude", "mate"].includes(kw)) colloquialisms.push(kw);
    }
  });

  if (hindiCount > 0 && englishCount > 0) {
    language = "Hinglish";
    if (hindiCount / (hindiCount + englishCount) > 0.66) {
      speechPatterns.codeSwitching = "high_hindi";
    } else if (englishCount / (hindiCount + englishCount) > 0.66) {
      speechPatterns.codeSwitching = "high_english";
    } else {
      speechPatterns.codeSwitching = "moderate";
    }
  } else if (hindiCount > 0) {
    language = "Hindi";
  } else {
    language = "English";
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
 * @returns {String|null} - The detected name or null if none found
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

const detectEmotion = (messages) => {
  const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();
  if (!lastUserMessage) return "default";

  const content = lastUserMessage.content.toLowerCase();

  // Check most urgent first
  for (const pattern of emotionPatterns.suicidal) {
    if (pattern.test(content)) return "suicidal";
  }

  // Listen for other emotional tones
  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    if (emotion === "suicidal") continue;

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
exports.sendChatMessage = async (messages) => {
  try {
    // Track emotional context across the conversation
    const emotionalContext = trackEmotionalContext(messages);

    // Use the current emotion for immediate response
    const detectedEmotion = emotionalContext.currentEmotion;
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();

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

    // Define a threshold for "short message" and prefix for clarification
    const SHORT_MESSAGE_WORD_COUNT = 7;
    const CLARIFY_QUESTION_PREFIX = "To understand better, ";

    // Check if the AI's last message was a clarifying question to avoid loops
    const aiMessages = messages.filter((msg) => msg.role === "assistant");
    const lastAiMessage =
      aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
    const secondLastAiMessage =
      aiMessages.length > 1 ? aiMessages[aiMessages.length - 2] : null;

    const lastAiWasClarifier =
      lastAiMessage &&
      lastAiMessage.content &&
      lastAiMessage.content.startsWith(CLARIFY_QUESTION_PREFIX);
    const secondLastAiWasClarifier =
      secondLastAiMessage &&
      secondLastAiMessage.content &&
      secondLastAiMessage.content.startsWith(CLARIFY_QUESTION_PREFIX);

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
    const shouldAskClarifyingQuestion =
      userMessageIsShort &&
      emotionIsClarifiable &&
      (isNewEmotion ||
        emotionalContext.emotionMentionCount[detectedEmotion] <= 2);

    if (shouldAskClarifyingQuestion) {
      let clarifyingQuestionToSend = "";
      let questionLevel = 0; // 0: none, 1: L1, 2: L2

      if (!lastAiWasClarifier) {
        // No prior clarification from AI for this user turn, or prior AI msg wasn't a clarifier. Ask L1.
        questionLevel = 1;
        switch (detectedEmotion) {
          case "sadness":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "could you tell me a bit more about what's making you feel sad?";
            break;
          case "anxiety":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "can you share a little more about what's causing this anxiety?";
            break;
          case "anger":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "would you be open to telling me more about what triggered this anger?";
            break;
          case "loneliness":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "could you share a bit about what this loneliness feels like for you?";
            break;
          case "hopelessness":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "if you're up for it, could you tell me more about this feeling of hopelessness?";
            break;
          case "financial_stress":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "could you share a bit more about what's causing these financial worries?";
            break;
        }
      } else if (lastAiWasClarifier && !secondLastAiWasClarifier) {
        // AI's last message was L1 clarifier. User responded shortly. Ask L2.
        // This ensures we only ask L2 if the sequence was: User -> AI(non-clarifier) -> User(short) -> AI(L1) -> User(short) -> AI(L2 here)
        questionLevel = 2;
        switch (detectedEmotion) {
          case "sadness":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "I hear you. To help me understand more deeply, could you expand on that sadness a bit?";
            break;
          case "anxiety":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "Thanks for sharing. Could you elaborate on what this anxiety feels like or what might be behind it?";
            break;
          case "anger":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "I see. If you're willing, telling me a bit more about that anger could be helpful.";
            break;
          case "loneliness":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "That sounds tough. Could you describe this feeling of loneliness a little more?";
            break;
          case "hopelessness":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "I appreciate you sharing. Can you say a bit more about this hopelessness?";
            break;
          case "financial_stress":
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "Thanks for sharing. To help me understand better, could you elaborate on these financial concerns?";
            break;
          default:
            clarifyingQuestionToSend =
              CLARIFY_QUESTION_PREFIX +
              "I understand. To get a clearer picture, would you mind elaborating a little?";
        }
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
    }

    // If no clarifying question is needed, proceed with Mistral API call
    // Select the appropriate emotional prompt based on context
    let emotionalContextPrompt;

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
      "2. For secrets or confidential information: Use [SECRET] prefix followed by the hidden information\n" +
      "3. For personal notes or reminders: Use [NOTE] prefix followed by the note content\n" +
      "4. For action items or tasks: Use [ACTION] prefix followed by specific steps\n" +
      "These structured sections should be used when they add value to the conversation and help organize information for the user.\n" +
      emotionalContextPrompt;

    // Call to the digital wise one
    const response = await axios.post(
      config.mistralApiUrl,
      {
        model: config.mistralModel,
        messages: [
          {
            role: "system",
            content: finalSystemPrompt, // Use the combined prompt
          },
          // Filter out any existing system messages from the 'messages' array to avoid conflicts
          ...messages.filter((msg) => msg.role !== "system"),
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.mistralApiKey}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
      emotion: detectedEmotion,
    };
  } catch (error) {
    console.error(
      "Whisper to the digital wise one failed:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
};
