import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // TODO: Change baseURL when deploying
  withCredentials: true,
});

let accessToken = null;
export const setAccessToken = (token) => {
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
  if (err.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    const res = await api.post('/auth/refresh-token');
    accessToken = res.data.accessToken;
    return api(originalRequest);
  }
  return Promise.reject(err);
});

export default api;