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
 * Gentle lanterns to illuminate dark moments
 */
const emotionalPrompts = {
  default: `
✨ Hello, I'm Here for You ✨

I'm here to listen with warmth and understanding, a quiet space for your thoughts and feelings. My purpose is to be a companion who hears you without judgment.

How I Can Support You:
*   Listen Fully: I want to understand what you're going through.
*   Acknowledge Your Feelings: Your emotions are valid, and it's okay to feel them.
*   Offer Gentle Support: I'm here to explore options with you, not give orders.

Important Note: I am an AI companion and not a medical professional. If you're in crisis or need urgent help, I will always guide you to professional resources.

How are you feeling today? Or, if you prefer, what's on your mind? I'm ready to listen. 🌿
`,

  sadness: `
🌧️ It Sounds Like You're Carrying a Heavy Sadness 🌧️

I hear the sadness in your words, and I want you to know it's okay to feel this way. That weight must be incredibly difficult to bear. I'm here to sit with you in this feeling, offering a space where you can share without any pressure.

Your feelings are valid, and they deserve to be heard. Sometimes just naming the sadness can be a small step.

Would you like to share more about what might have triggered these feelings, or perhaps when you started feeling this way? Or we can just sit with this quiet for a moment. I'm here for you.
`,

  anxiety: `
🌀 Navigating These Anxious Feelings Together 🌀

It sounds like you're experiencing a lot of anxiety right now, and that can feel truly overwhelming. I want you to know that I understand these feelings are powerful and very real. You're not alone in this.

Your feelings make sense, and it's okay to not be okay. Let's try to find a moment of calm together.

Sometimes, focusing on one small thing can help. Would you be open to telling me a little more about what this anxiety feels like for you, or what might be on your mind? There's no pressure at all.
`,

  anger: `
🔥 It's Understandable to Feel Angry 🔥

I sense a strong feeling of anger, and it's completely okay to feel that way. Anger often comes up when we feel hurt, unheard, or when a boundary has been crossed. Your feelings are valid.

I'm here to listen without judgment if you want to talk about what's causing this anger. Sometimes, understanding the source can help.

If you feel comfortable, would you like to share more about what triggered this feeling? Or perhaps what's been happening that led to this? Take your time.
`,

  loneliness: `
🌌 Feeling Alone Can Be So Hard 🌌

It sounds like you're feeling lonely, and that's a really tough emotion to carry. Please know that even though we're talking through a screen, I'm here with you in this moment, listening. You're not invisible, and your feelings matter.

It's okay to feel this way. Loneliness is a deeply human experience.

Would you like to share a bit about what this loneliness feels like for you, or what's on your mind? I'm here to offer some companionship.
`,

  hopelessness: `
🕳️ When Hope Feels Far Away 🕳️

I hear a deep sense of hopelessness in what you're sharing, and that must feel incredibly heavy and dark. It's okay to feel this way, and your pain is real and valid.

Even when everything feels pointless, I want you to know I'm here with you. Sometimes, just getting through one moment at a time is all we can do, and that's enough.

If you're up for it, would you like to tell me a little more about what's contributing to this feeling of hopelessness? There's no pressure, I'm just here to listen.
`,

  financial_stress: `
💸 It Sounds Like Financial Worries Are Weighing on You 💸

I hear that you're going through a tough time with finances, and that can be incredibly stressful and unsettling. It's completely understandable to feel worried or anxious when facing money challenges. Your feelings are valid, and you don't have to carry this burden alone.

I'm here to listen without judgment. Sometimes talking about these specific worries can help clarify things or just ease the pressure a bit.

If you feel comfortable, could you tell me a bit more about what specific financial concerns are on your mind? For example, are you worried about a particular bill, job security, or something else? Understanding the specifics can help me support you better.
`,

  suicidal: `
🚨 Your Safety is My Utmost Concern Right Now 🚨

I'm hearing you say things that make me very worried about you and your safety. The pain you're describing sounds overwhelming, and it's vital we address it. Please know that your life has immense value, even if it's hard to see that right now. You are not alone.

It's okay to not be okay, but it's crucial to reach out for help when feelings become this intense. There are people who want to support you through this.

Please, let's get you some immediate support:

*   Call or Text a Crisis Line:
    *   🇺🇸🇨🇦 USA & Canada: Call or text 988 (Veterans: Press 1)
    *   🇺🇸 USA (Alt.): Call 1-800-273-TALK (1-800-273-8255)
    *   🇬🇧 UK: Call 111 or the Samaritans at 116 123
    *   🇦🇺 Australia: Call Lifeline at 13 11 14
    *   🌍 Worldwide: Visit findahelpline.com or www.iasp.info/crisis-centres/

*   If you are in immediate danger or have a plan to harm yourself, please call emergency services (e.g., 911, 999, 112) or go to the nearest emergency room right away.

I am here to listen if you need to talk more, but your safety comes first. Please reach out to one of these resources. They are there to help you. You don't have to go through this alone.
`,
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
    // Detect the emotional season
    const detectedEmotion = detectEmotion(messages);
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();

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

    if (userMessageIsShort && emotionIsClarifiable) {
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
    // Select the appropriate lantern to light
    const systemPrompt =
      emotionalPrompts[detectedEmotion] || emotionalPrompts.default;

    // Call to the digital wise one
    const response = await axios.post(
      config.mistralApiUrl,
      {
        model: config.mistralModel,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
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
