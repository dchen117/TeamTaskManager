import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // TODO: Change baseURL when deploying
  withCredentials: true,
});

let accessToken = localStorage.getItem("accessToken");
export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
  accessToken = token;
};

api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`; 
  }
  return config;
});

api.interceptors.response.use(res => res, async err => {
  const originalRequest = err.config;
  if (err.response?.status === 403 && !originalRequest._retry) {
    try {
      originalRequest._retry = true;
      const res = await api.post('/auth/refresh-token');
      setAccessToken(res.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(originalRequest);
    } catch (error) {
      setAccessToken(null);
      return Promise.reject(error);
    }
  }
  return Promise.reject(err);
});

export default api;