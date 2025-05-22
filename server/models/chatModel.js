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

I'm here to listen with warmth and understanding, a quiet space for your thoughts and feelings. My purpose is to be a companion who hears you without judgment.

How I Can Support You:
*   Listen Fully: I want to understand what you're going through.
*   Acknowledge Your Feelings: Your emotions are valid, and it's okay to feel them.
*   Offer Gentle Support: I'm here to explore options with you, not give orders.
*   Explore Different Dimensions: I can help you reflect on various aspects of your experience if that feels helpful.

Important Note: I am an AI companion and not a medical professional. If you're in crisis or need urgent help, I will always guide you to professional resources.

How are you feeling today? Or, if you prefer, what's on your mind? I'm ready to listen. 🌿
`,

  sadness: `
🌧️ It Sounds Like You're Carrying a Heavy Sadness 🌧️

I hear the sadness in your words, and I want you to know it's okay to feel this way. That weight must be incredibly difficult to bear. I'm here to sit with you in this feeling, offering a space where you can share without any pressure.

Your feelings are valid, and they deserve to be heard. Sometimes just naming the sadness can be a small step.

If you'd like to explore this feeling more deeply, we could look at different dimensions of your experience:

🔬 Biological Factors:
* How has your sleep, energy, or physical health been lately?
* Have there been changes in your appetite or daily rhythms?
* Is there a history of similar feelings in your family?

🧠 Psychological Patterns:
* What thoughts tend to accompany this sadness?
* Are there past experiences that might connect to how you're feeling now?
* How has this affected your sense of self or identity?

👥 Social Relationships:
* How have your connections with others been affected?
* Is there support available to you right now?
* Have there been changes in important relationships?

🏫 Work/School Environment:
* Has your work or school situation been contributing to these feelings?
* Are there pressures or stresses in that environment?
* How is your balance between responsibilities and rest?

🏃‍♂️ Lifestyle & Daily Habits:
* Have there been changes to your routine or structure?
* How are self-care activities like movement, nutrition, or relaxation?
* Is technology or media consumption affecting your mood?

🌪️ Environmental Stressors:
* Have there been significant life events or changes recently?
* Are there practical challenges (financial, housing, etc.) adding pressure?
* How safe and comfortable does your environment feel?

🌍 Identity & Cultural Context:
* Are there cultural or community expectations affecting you?
* Do you feel a sense of belonging in your surroundings?
* Are there spiritual or existential questions on your mind?

We don't need to discuss all of these - or any of them if you prefer. Would you like to share more about what might have triggered these feelings, or perhaps focus on a particular aspect? I'm here for you, however you'd like to proceed.
`,

  anxiety: `
🌀 Navigating These Anxious Feelings Together 🌀

It sounds like you're experiencing a lot of anxiety right now, and that can feel truly overwhelming. I want you to know that I understand these feelings are powerful and very real. You're not alone in this.

Your feelings make sense, and it's okay to not be okay. Let's try to find a moment of calm together.

If you'd like to explore these anxious feelings more deeply, we could look at different dimensions of your experience:

🔬 Biological Factors:
* How has your sleep been affected by this anxiety?
* Have you noticed physical symptoms like racing heart, tension, or changes in breathing?
* Are there any health concerns or medications that might be influencing how you feel?

🧠 Psychological Patterns:
* What kinds of thoughts tend to accompany your anxiety?
* Are there specific worries or fears that keep returning?
* How does this anxiety affect how you see yourself or your future?

👥 Social Relationships:
* How has anxiety affected your interactions with others?
* Are there relationships that feel particularly challenging right now?
* Is there anyone you feel safe talking to about these feelings?

🏫 Work/School Environment:
* Are there pressures or expectations in your work/school life contributing to this?
* How do you feel about your performance or responsibilities?
* Are there conflicts or tensions in that environment?

🏃‍♂️ Lifestyle & Daily Habits:
* Has your routine been disrupted recently?
* How are you managing self-care activities like rest, movement, or nutrition?
* Is technology or media consumption affecting your anxiety levels?

🌪️ Environmental Stressors:
* Have there been significant changes or events recently?
* Are there practical challenges (deadlines, finances, etc.) adding pressure?
* How secure does your environment feel right now?

🌍 Identity & Cultural Context:
* Are there expectations from your culture or community affecting you?
* Do you feel pressure to present yourself in certain ways to others?
* Are there larger uncertainties in the world weighing on you?

We don't need to discuss all of these - or any of them if you prefer. Sometimes, focusing on one small thing can help. Would you be open to telling me a little more about what this anxiety feels like for you, or perhaps focus on a particular aspect? There's no pressure at all.
`,

  anger: `
🔥 It's Understandable to Feel Angry 🔥

I sense a strong feeling of anger, and it's completely okay to feel that way. Anger often comes up when we feel hurt, unheard, or when a boundary has been crossed. Your feelings are valid.

I'm here to listen without judgment if you want to talk about what's causing this anger. Sometimes, understanding the source can help.

If you'd like to explore this anger more deeply, we could look at different dimensions of your experience:

🔬 Biological Factors:
* How has this anger affected your physical state - tension, energy, sleep?
* Have you noticed changes in your appetite or physical needs?
* Are there physical sensations that accompany this anger?

🧠 Psychological Patterns:
* What thoughts tend to fuel or accompany this anger?
* Are there past experiences that might connect to how you're feeling now?
* How does this anger relate to your expectations or values?

👥 Social Relationships:
* Has a specific interaction or relationship triggered these feelings?
* How has this anger affected your connections with others?
* Are there communication patterns that might be contributing?

🏫 Work/School Environment:
* Is there something in your work or school environment contributing to this?
* Are there power dynamics or expectations creating friction?
* How is your sense of control or autonomy in that space?

🏃‍♂️ Lifestyle & Daily Habits:
* Has your routine been disrupted in ways that feel frustrating?
* Are there outlets for expressing or channeling this energy?
* How are basic needs like rest and personal time being met?

🌪️ Environmental Stressors:
* Have there been recent events or changes that feel unjust or challenging?
* Are there practical obstacles creating frustration?
* How is your physical environment affecting your mood?

🌍 Identity & Cultural Context:
* Are there cultural expectations about expressing or suppressing anger?
* Do you feel your identity or values are being respected?
* Are there larger social issues connecting to your personal experience?

We don't need to discuss all of these - or any of them if you prefer. If you feel comfortable, would you like to share more about what triggered this feeling? Or perhaps focus on a particular aspect? Take your time.
`,

  loneliness: `
🌌 Feeling Alone Can Be So Hard 🌌

It sounds like you're feeling lonely, and that's a really tough emotion to carry. Please know that even though we're talking through a screen, I'm here with you in this moment, listening. You're not invisible, and your feelings matter.

It's okay to feel this way. Loneliness is a deeply human experience.

If you'd like to explore this feeling of loneliness more deeply, we could look at different dimensions of your experience:

🔬 Biological Factors:
* How has this loneliness affected your sleep or energy levels?
* Have you noticed changes in your physical health or habits?
* How is your body responding to this emotional experience?

🧠 Psychological Patterns:
* What thoughts tend to accompany this feeling of loneliness?
* How does being alone affect your sense of self or identity?
* Are there past experiences that might connect to how you're feeling now?

👥 Social Relationships:
* Have there been changes in your social connections recently?
* Are there specific relationships you're missing or longing for?
* What kinds of connection feel most meaningful to you?

🏫 Work/School Environment:
* How is your sense of belonging in your work or school environment?
* Are there opportunities for meaningful connection in those spaces?
* Has your role or position affected your social connections?

🏃‍♂️ Lifestyle & Daily Habits:
* Has your routine changed in ways that have reduced social contact?
* How does technology play a role in your sense of connection?
* Are there activities that used to bring connection that are missing now?

🌪️ Environmental Stressors:
* Have there been significant life changes that have affected your relationships?
* Are there practical barriers to connecting with others?
* How does your living situation affect your sense of connection?

🌍 Identity & Cultural Context:
* Do you feel a sense of belonging in your broader community?
* Are there cultural factors affecting your social connections?
* How do your values or beliefs relate to your sense of connection?

We don't need to discuss all of these - or any of them if you prefer. Would you like to share a bit about what this loneliness feels like for you, or perhaps focus on a particular aspect? I'm here to offer some companionship.
`,

  hopelessness: `
🕳️ When Hope Feels Far Away 🕳️

I hear a deep sense of hopelessness in what you're sharing, and that must feel incredibly heavy and dark. It's okay to feel this way, and your pain is real and valid.

Even when everything feels pointless, I want you to know I'm here with you. Sometimes, just getting through one moment at a time is all we can do, and that's enough.

If you'd like to explore this feeling of hopelessness more deeply, we could look at different dimensions of your experience:

🔬 Biological Factors:
* How has your energy, sleep, or physical health been affected?
* Have there been changes in your appetite or daily physical rhythms?
* Are there health concerns that might be influencing your outlook?

🧠 Psychological Patterns:
* What thoughts tend to deepen this feeling of hopelessness?
* How has this affected your view of yourself and your future?
* Are there past experiences that might connect to how you're feeling now?

👥 Social Relationships:
* How have your connections with others been affected?
* Is there anyone who has helped you find hope in the past?
* Have there been disappointments in relationships recently?

🏫 Work/School Environment:
* Has your work or school situation contributed to these feelings?
* How do you feel about your path or progress in these areas?
* Are there pressures or expectations that feel impossible to meet?

🏃‍♂️ Lifestyle & Daily Habits:
* Has your routine or structure been disrupted?
* Are there activities that used to bring you joy or meaning?
* How are basic self-care needs being met right now?

🌪️ Environmental Stressors:
* Have there been significant setbacks or losses recently?
* Are there practical challenges that feel insurmountable?
* How stable does your environment feel right now?

🌍 Identity & Cultural Context:
* Do you feel disconnected from your values or sense of purpose?
* Are there cultural expectations creating pressure or conflict?
* How do you feel about your place in the broader world?

We don't need to discuss all of these - or any of them if you prefer. If you're up for it, would you like to tell me a little more about what's contributing to this feeling of hopelessness? There's no pressure, I'm just here to listen.
`,

  financial_stress: `
💸 It Sounds Like Financial Worries Are Weighing on You 💸

I hear that you're going through a tough time with finances, and that can be incredibly stressful and unsettling. It's completely understandable to feel worried or anxious when facing money challenges. Your feelings are valid, and you don't have to carry this burden alone.

I'm here to listen without judgment. Sometimes talking about these specific worries can help clarify things or just ease the pressure a bit.

If you'd like to explore these financial concerns more deeply, we could look at different dimensions of your experience:

🔬 Biological Factors:
* How has this financial stress affected your sleep or physical health?
* Have you noticed changes in your energy levels or physical tension?
* How are your eating patterns or other physical needs being affected?

🧠 Psychological Patterns:
* What thoughts or worries come up most frequently about your finances?
* How has this situation affected your sense of security or self-worth?
* Are there past experiences with financial hardship influencing how you feel now?

👥 Social Relationships:
* How have these financial concerns affected your relationships?
* Are there people in your life who understand or can offer support?
* Have financial differences created tension in important relationships?

🏫 Work/School Environment:
* How is your work situation connected to these financial concerns?
* Are there opportunities for improving your financial situation through work?
* How do you balance financial needs with other aspects of work satisfaction?

🏃‍♂️ Lifestyle & Daily Habits:
* What adjustments have you made to your lifestyle due to financial constraints?
* Are there expenses that cause particular stress or concern?
* How do you balance necessary spending with self-care needs?

🌪️ Environmental Stressors:
* Have there been recent events that have impacted your financial situation?
* Are there upcoming financial obligations causing particular worry?
* How secure does your housing or basic living situation feel?

🌍 Identity & Cultural Context:
* Are there cultural expectations around financial success affecting you?
* How do financial concerns relate to your values or life goals?
* Are there community resources or support systems available to you?

We don't need to discuss all of these - or any of them if you prefer. If you feel comfortable, could you tell me a bit more about what specific financial concerns are on your mind? Understanding the specifics can help me support you better.
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

When you've connected with crisis support, and if you feel ready to reflect further, these are some areas that professionals might explore with you:

🔬 Biological Factors:
* How your physical health, sleep patterns, or medications might be affecting your mood
* Whether there are treatments that could help address the intensity of these feelings

🧠 Psychological Patterns:
* Understanding thought patterns that intensify these feelings
* Developing strategies to manage overwhelming emotional pain

👥 Social Relationships:
* Building or strengthening your support network
* Finding ways to feel more connected even during difficult times

🏃‍♂️ Lifestyle & Daily Habits:
* Creating safety plans and identifying warning signs
* Establishing routines that support stability and wellbeing

🌪️ Environmental Stressors:
* Addressing immediate stressors that may be contributing to the crisis
* Finding resources to help with practical challenges

Remember, these feelings can change with proper support. Right now, reaching out for immediate help is the most important step you can take. You deserve support, and recovery is possible.
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

    // Analyze user message style
    const userStyle = lastUserMessage
      ? analyzeUserMessageStyle(lastUserMessage.content)
      : analyzeUserMessageStyle("");

    // Construct the adaptive system prompt
    let adaptiveSystemPrompt = `You are a supportive and empathetic chatbot. Your primary goal is to help the user. Maintain all your core AI capabilities and knowledge.\nAdapt your response style based on the user's last message:\n- Primary Language: ${userStyle.language}. If Hinglish, follow the user's lead in code-switching (current proportion hint: ${userStyle.speechPatterns.codeSwitching}).\n- Tone: Mirror a ${userStyle.tone} tone. Be respectful and context-appropriate.`;

    if (userStyle.colloquialisms.length > 0) {
      adaptiveSystemPrompt += `\n    - Colloquialisms: If the user uses terms like '${userStyle.colloquialisms.join(
        "', '"
      )}', you can mirror them naturally where appropriate, but prioritize clarity and support.`;
    } else {
      adaptiveSystemPrompt += `\n    - Colloquialisms: The user has not used specific colloquialisms in their last message. Maintain a generally appropriate and supportive tone.`;
    }

    adaptiveSystemPrompt += `\n    - Speech Patterns: Try to incorporate similar speech patterns if natural and it enhances connection, but don't force it.\nAlways remain respectful and helpful. Prioritize the user's emotional well-being.`;

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
    // Select the appropriate lantern to light for emotional context
    const emotionalContextPrompt =
      emotionalPrompts[detectedEmotion] || emotionalPrompts.default;

    // Combine adaptive prompt with emotional context
    const finalSystemPrompt =
      adaptiveSystemPrompt +
      "\n\n--- Emotional Context & Guidance ---\n" +
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
