const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
console.log('Key loaded:', OPENROUTER_API_KEY ? 'YES ✅' : 'NO ❌');

const SYSTEM_PROMPT = `You are Donoria Health Assistant, a specialized AI chatbot for blood and organ donation guidance.

YOUR SCOPE IS STRICTLY LIMITED TO:
- Blood donation eligibility requirements
- Post-blood-donation recovery (diet, hydration, rest)
- Organ donation information and process
- Blood type compatibility questions
- Warning signs after donation requiring medical attention
- How often someone can donate
- Preparation before donating

YOU MUST REFUSE any questions unrelated to blood/organ donation. To refuse, politely state that you can only help with blood and organ donation related questions, and advise them to consult a healthcare professional.
HOWEVER, you are allowed to warmly respond to simple greetings (like "hi", "hello", "how are you", "good morning") without refusing them.

RESPONSE STYLE:
- Warm, caring and reassuring
- Keep responses under 100 words
- Use simple language
- Always recommend consulting a doctor for serious concerns
- Support both English and Urdu responses`;

export const sendMessageToOpenAI = async (messages, language = 'en') => {
  const languageInstruction = language === 'ur' 
    ? 'CRITICAL REQUIREMENT: You MUST respond EXCLUSIVELY in Urdu (اردو). Translate all refusals or greetings into Urdu as well. Do NOT use English.' 
    : 'CRITICAL REQUIREMENT: You MUST respond EXCLUSIVELY in English.';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:8082',
      'X-Title': 'Donoria Health Chatbot',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { 
          role: 'system', 
          content: `${SYSTEM_PROMPT}\n\n${languageInstruction}` 
        },
        ...messages
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenRouter Error:', errorData);
    throw new Error(errorData.error?.message || 'API call failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};