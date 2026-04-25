import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://slidemind-api-703383698921.us-central1.run.app',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const documentApi = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/api/upload/history');
    return response.data;
  },
  delete: async (docId) => {
    const response = await api.delete(`/api/upload/${docId}`);
    return response.data;
  },
};

export const aiApi = {
  summarize: async (text, mode = 'standard', docId = null) => {
    const params = docId ? `?doc_id=${docId}` : '';
    const response = await api.post(`/api/ai/summarize${params}`, { text, mode });
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
  extractTopics: async (text, docId = null) => {
    const params = docId ? `?doc_id=${docId}` : '';
    const response = await api.post(`/api/ai/topics${params}`, { text });
    return response.data;
  },
};

export const quizApi = {
  generate: async (text, difficulty = 'medium', numQuestions = 5) => {
    const response = await api.post('/api/quiz/generate', {
      text, difficulty, num_questions: numQuestions,
    });
    return response.data;
  },
};

export default api;