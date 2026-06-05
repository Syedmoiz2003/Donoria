import api from './api';

export const sendMessageToOpenAI = async (messages, language = 'en') => {
  const response = await api.post('/ai/chat', {
    messages,
    language,
  });

  return response.response;
};
