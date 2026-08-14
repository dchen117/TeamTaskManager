import axios from 'axios';
import { getAccessToken, setAccessToken, notifyLogout } from './tokenService.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (getAccessToken()) {
    config.headers.Authorization = `Bearer ${getAccessToken()}`; 
  }
  return config;
});

api.interceptors.response.use(res => res, async err => {
  const originalRequest = err.config;
  if (err.response?.status === 401 && !originalRequest.url.startsWith('/auth') && !originalRequest._retry) {
    try {
      originalRequest._retry = true;
      const res = await api.post('/auth/refresh-token');
      setAccessToken(res.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(originalRequest);
    } catch (error) {
      notifyLogout();
      return Promise.reject(error);
    }
  }
  return Promise.reject(err);
});

export default api;