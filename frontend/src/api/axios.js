import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseApiUrl = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : rawApiUrl.replace(/\/$/, '') + '/api';

const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

const api = axios.create({
  baseURL: baseApiUrl,
  timeout: TIMEOUT_MS,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = error.code === 'ECONNABORTED'
        ? 'Request timeout. The server may be starting up.'
        : 'Unable to reach the backend server.';
    }
    return Promise.reject(error);
  }
);

const shouldRetry = (error) => {
  if (error.code === 'ECONNABORTED') return true;
  if (!error.response) return true;
  return error.response.status >= 500;
};

export const requestWithRetry = async (requestFn, retries = MAX_RETRIES, retryDelay = RETRY_DELAY_MS) => {
  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !shouldRetry(error)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      attempt += 1;
    }
  }

  throw lastError;
};

export default api;
