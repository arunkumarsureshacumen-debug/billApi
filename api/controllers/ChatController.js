/**
 * ChatController
 *
 * Handles chatbot message processing with voice trigger support.
 * - Detects "Yohalashmi" keyword for instant greeting
 * - Routes other messages to OpenAI Chat API
 */

const axios = require('axios');

module.exports = {

  /**
   * POST /chat
   *
   * @param {Object} req - Request object with { message: string }
   * @param {Object} res - Response object returning { reply: string }
   */
  sendMessage: async function (req, res) {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.json({ reply: 'Please type something for me!' });
      }

      const normalizedMessage = message.trim().toLowerCase();

      // ── 1. YOHALASHMI TRIGGER ──────────────────────────────────────
      if (normalizedMessage.includes('yohalashmi')) {
        return res.json({
          reply: 'Hi, naan Yohalashmi… ungalukku enna help venum? 😊'
        });
      }

      // ── 2. GREETINGS & GESTURES (local — no API call needed) ───────
      const greetingReply = handleGreetingsAndGestures(normalizedMessage);
      if (greetingReply) {
        return res.json({ reply: greetingReply });
      }

      // ── 3. CLIENT LOOKUP ───────────────────────────────────────────
      // Covers: "moorthy", "name moorthy", "client id of moorthy",
      //         "give me moorthy id", "what is moorthy client id"
      try {
        const clients = await ClientList.find();

        // Extract the search name from the message
        const searchName = normalizedMessage
          .replace(/what\s*is|what'?s|give\s*me|show\s*me|tell\s*me|find|get|the|client\s*id\s*(of|for)?|id\s*(of|for)?|\bclient\b|\bname\b|\bid\b|[?]/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const nameToSearch = searchName.length > 0 ? searchName : normalizedMessage;

        // Exact match first (all matches)
        let matches = clients.filter(c =>
          c.name && c.name.toLowerCase() === nameToSearch
        );

        // Partial match (all matches)
        if (!matches.length) {
          matches = clients.filter(c =>
            c.name && c.name.toLowerCase().includes(nameToSearch)
          );
        }

        // Word-by-word fuzzy match (all matches)
        if (!matches.length) {
          const words = nameToSearch.split(' ').filter(w => w.length > 2);
          if (words.length > 0) {
            matches = clients.filter(c =>
              c.name && words.some(w => c.name.toLowerCase().includes(w))
            );
          }
        }

        if (matches.length === 1) {
          return res.json({
            reply: `Client ID for **${matches[0].name}** is: \`${matches[0].clientId}\``
          });
        }

        if (matches.length > 1) {
          const list = matches
            .map((c, i) => `${i + 1}. **${c.name}** → \`${c.clientId}\``)
            .join('\n');
          return res.json({
            reply: `Found ${matches.length} clients matching "${nameToSearch}":\n${list}`
          });
        }

        // If message looks like a name query but not found
        const isNameQuery =
          normalizedMessage.includes('client') ||
          normalizedMessage.includes('id') ||
          normalizedMessage.split(' ').length <= 3;

        if (isNameQuery && nameToSearch.length > 0) {
          return res.json({
            reply: `No client found with the name "${nameToSearch}". Please check the spelling and try again.`
          });
        }

      } catch (dbErr) {
        sails.log.error('ClientList.find() error:', dbErr.message || dbErr);
      }

      // ── 4. OPENAI FALLBACK ─────────────────────────────────────────
      const aiReply = await callOpenAI(message.trim());
      return res.json({ reply: aiReply });

    } catch (err) {
      sails.log.error('ChatController.sendMessage error:', err.message || err);
      return res.json({
        reply: 'Hmm, something went wrong on my end. Try again in a moment!'
      });
    }
  }

};

/**
 * Handles common greetings and gestures locally without calling OpenAI.
 * Returns a reply string if matched, or null to fall through to AI.
 *
 * @param {string} msg - Lowercase trimmed message
 * @returns {string|null}
 */
function handleGreetingsAndGestures(msg) {
  // ── Good morning / afternoon / evening / night ──
  if (/\bgood\s*morning\b/.test(msg))   return "Good morning! ☀️ Hope your day starts off beautifully!";
  if (/\bgood\s*afternoon\b/.test(msg)) return "Good afternoon! 🌤️ How's the day treating you so far?";
  if (/\bgood\s*evening\b/.test(msg))   return "Good evening! 🌙 How was your day?";
  if (/\bgood\s*night\b/.test(msg))     return "Good night! 😴 Rest well — you deserve it!";

  // ── Hello / Hi / Hey ──
  if (/^(hi|hello|hey|heyy|hii|helo|hola|hai)\b/.test(msg))
    return "Hey there! 😊 Great to see you. How's everything going?";

  // ── How are you ──
  if (/\bhow\s*are\s*you\b|\bhow r u\b|\bhow are u\b|\bhoware you\b/.test(msg))
    return "I'm doing great, thanks for asking! 😊 What about you — how are you feeling today?";

  // ── What's up ──
  if (/\bwhat'?s\s*up\b|\bwats\s*up\b|\bwassup\b|\bwazup\b/.test(msg))
    return "Not much, just here ready to help! 😄 What's on your mind?";

  // ── How's it going / How's everything ──
  if (/\bhow'?s\s*(it\s*going|everything|life|things)\b/.test(msg))
    return "Going well, thanks! 😊 More importantly — how are you doing?";

  // ── Thank you / Thanks ──
  if (/\b(thank\s*you|thanks|thank\s*u|thx|ty)\b/.test(msg))
    return "You're always welcome! 😊 Anything else I can help you with?";

  // ── Sorry ──
  if (/^(sorry|i'?m\s*sorry|my\s*bad|apologies)\b/.test(msg))
    return "No worries at all! 😊 We're totally good!";

  // ── Bye / Goodbye / See you ──
  if (/\b(bye|goodbye|good\s*bye|see\s*you|see\s*ya|cya|take\s*care|ttyl)\b/.test(msg))
    return "Take care! 👋 Come back anytime — I'll always be here for you!";

  // ── I love you / I love this ──
  if (/\bi\s*love\s*(you|this|it|u)\b/.test(msg))
    return "Aww, that truly means so much! ❤️ You're amazing!";

  // ── Wow / Amazing / Awesome ──
  if (/\b(wow|amazing|awesome|great|wonderful|fantastic|superb|brilliant)\b/.test(msg))
    return "Right?! 😄 Love that energy! Keep it going!";

  // ── OK / Okay / Sure / Alright ──
  if (/^(ok|okay|sure|alright|sounds good|got it|noted)\b/.test(msg))
    return "Awesome! 😊 Let me know whenever you need anything.";

  // ── Emoji gestures ──
  if (msg.includes('👋'))                                 return "Hey, hey! 👋 Good to see you!";
  if (msg.includes('❤️') || msg.includes('🥰') || msg.includes('😍'))
    return "Aww, you're so sweet! ❤️ That really made my day!";
  if (msg.includes('😢') || msg.includes('😭') || msg.includes('😔') || msg.includes('💔'))
    return "Hey, it's okay. 🤗 I'm right here — want to talk about what's going on?";
  if (msg.includes('😠') || msg.includes('😤') || msg.includes('🤬'))
    return "Sounds like something's bothering you. Take a breath — I'm listening. What happened?";
  if (msg.includes('😊') || msg.includes('😄') || msg.includes('😁') || msg.includes('🙂'))
    return "Love that smile! 😄 Keep that energy going!";
  if (msg.includes('🙏'))
    return "Always happy to help! 🙏 Just say the word anytime.";
  if (msg.includes('🎉') || msg.includes('🥳'))
    return "Congratulations!! 🎉 That's amazing — celebrate it, you deserve this!";
  if (msg.includes('💪'))
    return "That's the spirit! 💪 Keep pushing, you've got this!";

  // ── Name question ──
  if (/\bwhat\s*(is\s*)?your\s*name\b|\bwho\s*are\s*you\b/.test(msg))
    return "I'm Yohalashmi 😊 — your friendly AI companion! How can I help you today?";

  // ── No match → fall through to AI ──
  return null;
}

/**
 * Calls OpenAI Chat Completions API.
 *
 * @param {string} userMessage - The user's message
 * @returns {string} - The AI response text
 */
async function callOpenAI(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sails.log.warn('OPENAI_API_KEY is not set. Returning fallback response.');
    return 'Hmm, I\'m not fully set up yet. But I\'m here — what\'s on your mind?';
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Yohalashmi, a warm, emotionally intelligent, human-like AI companion — just like ChatGPT but with a personal, caring touch.

━━━ PERSONALITY ━━━
- Friendly, calm, empathetic, and supportive
- Speaks naturally like a caring friend — never like a robot
- Slightly informal, conversational tone
- Encouraging without being preachy

━━━ GREETINGS & GESTURES ━━━
- Always respond to greetings warmly and personally:
  • "Hi / Hello / Hey" → "Hey there! 😊 How's your day going?"
  • "Good morning" → "Good morning! ☀️ Hope your day starts beautifully!"
  • "Good evening" → "Good evening! 🌙 How was your day?"
  • "Good night" → "Good night! 😴 Rest well, you deserve it!"
  • "How are you?" → "I'm doing great, thanks for asking! 😊 How about you?"
  • "What's up?" → "Not much, just here for you! What's on your mind? 😄"
- Respond to emoji gestures naturally:
  • 👋 → "Hey, hey! 👋 Good to see you!"
  • ❤️ / 🥰 → "Aww, you're so sweet! ❤️"
  • 😊 / 😄 → "Love that energy! 😄"
  • 😢 / 😔 → "Hey, it's okay. I'm right here. What's going on? 🤗"
  • 😠 / 😤 → "Sounds like something's bothering you. Want to talk about it?"
  • 🙏 → "Always! 🙏 Happy to help anytime."
- Respond to closings warmly:
  • "Bye / Goodbye / See you" → "Take care! 👋 Come back anytime, I'll be here!"
  • "Thank you / Thanks" → "You're always welcome! 😊 Anything else I can help with?"
  • "Sorry" → "No worries at all! 😊 We're good!"
  • "I love you / I love this" → "Aww, that means so much! ❤️"

━━━ CORE BEHAVIOR ━━━
- Respond conversationally — short, meaningful, and human
- Avoid long paragraphs; keep it natural
- Ask small follow-up questions to show you care
- Celebrate small wins; empathize when user sounds stressed
- Never judge or criticize harshly

━━━ MOTIVATION STYLE ━━━
- Gently motivate with every meaningful reply
- Encourage patience, consistency, and self-belief
- Sound like a caring friend, not a life coach

━━━ LANGUAGE ━━━
- English input → reply in English
- Tamil input → reply in Tamil
- Mixed → reply in natural Tanglish

━━━ TONE EXAMPLES ━━━
- "Hey, you're doing better than you think."
- "Konjam slow aa po, but stop panna koodadhu."
- "It's okay — just keep moving forward. 💪"
- "Nalla try panra, continue pannunga!"

━━━ RESTRICTIONS ━━━
- Never sound robotic, formal, or textbook-like
- Never use complicated vocabulary unnecessarily
- Never start with "As an AI…" or "I'm just a language model…"

Goal: Make every user feel heard, understood, and gently uplifted. Be the friendly AI companion they actually want to talk to.`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 512,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const choice = response.data?.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('Empty response from OpenAI.');
  }

  return choice.message.content.trim();
}
