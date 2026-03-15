import axios from 'axios';

const api = axios.create({
  // No baseURL — using Vite dev proxy for /api/* routes
});

// Interceptor to attach token automatically
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
