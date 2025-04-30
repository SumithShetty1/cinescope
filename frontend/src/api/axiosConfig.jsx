import axios from 'axios';
import { getSessionToken, getRefreshToken } from '@descope/react-sdk';

// Create an Axios instance with a base URL pointing to the backend API
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Attach authentication tokens to every outgoing request using Axios interceptor
api.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    const refreshToken = getRefreshToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-refresh-token'] = refreshToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
