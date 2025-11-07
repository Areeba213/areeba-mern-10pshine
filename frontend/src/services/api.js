import axios from 'axios';
import logger from '../utils/logger';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  logger.info('API Request', {
    method: config.method?.toUpperCase(),
    url: config.url,
    headers: config.headers
  });
  
  return config;
}, (error) => {
  logger.error('API Request Error', {
    error: error.message,
    stack: error.stack
  });
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  (response) => {
    logger.info('API Response Success', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    logger.error('API Response Error', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default API;