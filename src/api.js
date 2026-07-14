import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://cipherapparel.pythonanywhere.com');

export const getImageUrl = (image, type = 'banner') => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/media/')) return `${API_BASE}${image}`;
  if (image.startsWith('/static/')) return `${API_BASE}${image}`;
  return `${API_BASE}/static/store/images/${type}/${image}`;
};

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method === 'get' && config.url && config.url.includes('/settings')) {
      config.params = { ...config.params, t: new Date().getTime() };
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !error.config.url.includes('/login')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export { API_BASE };
export default api;
