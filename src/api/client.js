import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Get current language from localStorage
  const lang = localStorage.getItem('i18nextLng') || 'vi';

  // Set Accept-Language header
  if (config.headers) {
    config.headers['Accept-Language'] = lang;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
