import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://cipherapparel.pythonanywhere.com';

export const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/media/')) return `${API_BASE}${image}`;
  return `${API_BASE}/static/store/images/banner/${image}`;
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
    return config;
  },
  (error) => Promise.reject(error)
);

export { API_BASE };
export default api;
