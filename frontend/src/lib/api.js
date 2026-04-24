import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const documentApi = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/api/upload/history');
    return response.data;
  },
};

export const aiApi = {
  summarize: async (text, mode = 'standard') => {
    const response = await api.post('/api/ai/summarize', { text, mode });
    return response.data;
  },
  explain: async (text, topic = null) => {
    const response = await api.post('/api/ai/explain', { text, topic });
    return response.data;
  },
  chat: async (question, context, history = []) => {
    const response = await api.post('/api/ai/chat', { question, context, history });
    return response.data;
  },
  extractTopics: async (text) => {
    const response = await api.post('/api/ai/topics', { text });
    return response.data;
  },
};

export const quizApi = {
  generate: async (text, difficulty = 'medium', numQuestions = 5) => {
    const response = await api.post('/api/quiz/generate', {
      text,
      difficulty,
      num_questions: numQuestions,
    });
    return response.data;
  },
};

export default api;
