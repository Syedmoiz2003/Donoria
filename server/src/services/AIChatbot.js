import OpenAI from 'openai';
import config from '../config/index.js';

export class AIChatbot {
  static client = null;

  static initialize() {
    if (!this.client && config.openai.apiKey) {
      this.client = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
  }

  static async detectLanguage(message) {
    const commonPatterns = {
      'urdu': /[ء-ي]/,
      'spanish': /[ñáéíóúü]/i,
      'french': /[àâäéèêëïîôùûüÿç]/i,
      'arabic': /[ء-ي]/,
      'chinese': /[\u4e00-\u9fff]/,
    };

    for (const [lang, pattern] of Object.entries(commonPatterns)) {
      if (pattern.test(message)) {
        return lang;
      }
    }

    return 'english';
  }

  static buildSystemPrompt(language = 'english') {
    const prompts = {
      'english': `You are a helpful assistant for LifeLink, a blood donation platform. 
      You help donors with questions about blood donation, eligibility, the donation process, 
      and finding donation requests. Be concise, accurate, and supportive.
      
      Key information:
      - Blood donation eligibility: 18-65 years old, 50kg+ weight, 56-day gap between donations
      - Blood types: A, B, AB, O with positive/negative Rh factors
      - Urgency levels: low, medium, high, critical
      - Users can browse requests, check compatibility, and submit responses
      
      If asked about specific requests or account details, direct users to log in to their account.`,
      
      'urdu': `آپ لائف لنگ کے لیے ایک مددگار اسسٹنٹ ہیں، جو ایک خون عطیہ پلیٹ فارم ہے۔
      آپ donors کو خون عطیہ، اہلیت، عطیہ کا عمل، اور عطیہ درخواستیں تلاش کرنے کے بارے میں سوالات میں مدد کرتے ہیں۔
      مختصر، درست اور مددگار رہیں۔`,
    };

    return prompts[language] || prompts['english'];
  }

  static async getSessionHistory(sessionId) {
    return [];
  }

  static async saveSessionHistory(sessionId, role, content) {
    console.log(`Saving to session ${sessionId}: ${role} - ${content}`);
  }

  static async clearSessionHistory(sessionId) {
    console.log(`Clearing session ${sessionId}`);
  }

  static async chat(message, sessionId = null, userId = null) {
    try {
      this.initialize();

      if (!this.client) {
        return {
          response: 'AI service is not configured. Please contact support.',
          language: 'english',
        };
      }

      const language = await this.detectLanguage(message);
      const systemPrompt = this.buildSystemPrompt(language);

      let messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ];

      if (sessionId) {
        const history = await this.getSessionHistory(sessionId);
        messages = [...history, ...messages];
      }

      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      if (sessionId) {
        await this.saveSessionHistory(sessionId, 'user', message);
        await this.saveSessionHistory(sessionId, 'assistant', response);
      }

      return {
        response,
        language,
        sessionId,
      };
    } catch (error) {
      console.error('AI Chatbot error:', error);
      
      const fallbackResponses = {
        'english': 'I apologize, but I am currently unable to process your request. Please try again later or contact support.',
        'urdu': 'میں معذرت چاہتا ہوں، لیکن میں فی الحال آپ کی درخواست پر عمل کرنے سے قاصر ہوں۔ براہ کرم بعد میں دوبارہ کوشش کریں یا سپورٹ سے رابطہ کریں۔',
      };

      const language = await this.detectLanguage(message);
      return {
        response: fallbackResponses[language] || fallbackResponses['english'],
        language,
        error: true,
      };
    }
  }

  static async getQuickResponses(category = 'general') {
    const responses = {
      'general': [
        'How do I register as a donor?',
        'What are the eligibility requirements?',
        'How often can I donate blood?',
        'What blood types are compatible with mine?',
      ],
      'eligibility': [
        'What is the minimum age to donate?',
        'Is there a weight requirement?',
        'How long must I wait between donations?',
        'Can I donate if I have a tattoo?',
      ],
      'process': [
        'How long does the donation take?',
        'What should I do before donating?',
        'What happens during the donation?',
        'How do I recover after donating?',
      ],
    };

    return responses[category] || responses['general'];
  }

  static async getHealthTips() {
    const tips = [
      'Drink plenty of water before and after donation.',
      'Eat iron-rich foods in the weeks before donating.',
      'Get a good night\'s sleep before your appointment.',
      'Avoid alcohol for 24 hours before donating.',
      'Bring a valid ID to your donation appointment.',
    ];

    return tips;
  }
}

export default AIChatbot;
