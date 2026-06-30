import axios from "axios";

const geminiResponse = async (command, userName, assistantName) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.log("❌ API KEY MISSING");
      return JSON.stringify({
        type: "general",
        userInput: command,
        response: "API key missing"
      });
    }

    // ✅ FINAL PROMPT (merged cleanly)
    const systemPrompt = `
You are a voice-enabled virtual assistant named ${assistantName}, created by ${userName}.
You are NOT Google. You behave like a smart assistant that understands natural language.

Your task:
- Understand the user's intent
- Respond ONLY in JSON format

Response format:
{
  "type": "general | google_search | youtube_search | youtube_play | get_time | get_date | get_day | get_month | calculator_open | instagram_open | facebook_open | weather_show",
  "userInput": "",
  "response": ""
}

Rules:
- Always return ONLY JSON (no extra text)
- Keep response short and voice-friendly
- Remove assistant name from userInput
- If user wants search → return only search text
- If user asks "who created you?" → answer with "${userName}"

Examples:

Input: "Hey ${assistantName}, play Arijit Singh songs"
Output:
{
  "type": "youtube_play",
  "userInput": "Arijit Singh songs",
  "response": "Playing it now"
}
`;
const result = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    model: "llama-3.1-8b-instant", // or another model available to your account
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: command,
      },
    ],
    temperature: 0.3,
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
  }
);
    const text = result.data.choices[0].message.content;

    return text;

  } catch (error) {
    console.log("❌ GROQ ERROR:", error.response?.data || error.message);

    return JSON.stringify({
      type: "general",
      userInput: command,
      response: "AI is not responding right now."
    });
  }
};

export default geminiResponse;