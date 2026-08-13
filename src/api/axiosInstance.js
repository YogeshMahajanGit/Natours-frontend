import axios from 'axios';
import { ENV } from '../config/env';

const API_BASE_URL = ENV.API_BASE_URL;

const cache = new Map();
const CACHE_TTL = 3 * 60 * 1000;

const getCacheKey = (config) => {
  const paramsStr = config.params ? JSON.stringify(config.params) : '';
  return `${config.method.toUpperCase()}:${config.url}:${paramsStr}`;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('natours_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method?.toLowerCase() === 'get' && !config.bypassCache) {
      const cacheKey = getCacheKey(config);
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        config.adapter = () =>
          Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
            request: {},
          });
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
      const cacheKey = getCacheKey(response.config);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem('natours_token');
      localStorage.removeItem('natours_user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }

    if (response && response.status === 429 && config) {
      config._retryCount = (config._retryCount || 0) + 1;
      const MAX_RETRIES = 2;

      if (config._retryCount <= MAX_RETRIES) {
        const delayMs = config._retryCount * 1200;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return axiosInstance(config);
      }

      const customMsg = 'Rate limit exceeded (Too Many Requests). Please wait a few seconds before refreshing.';
      if (typeof error.response.data === 'string') {
        error.response.data = { message: error.response.data || customMsg };
      } else if (error.response.data && typeof error.response.data === 'object') {
        error.response.data.message = error.response.data.message || customMsg;
      } else {
        error.response.data = { message: customMsg };
      }
    }

    return Promise.reject(error);
  }
);

export const clearApiCache = () => {
  cache.clear();
};

export default axiosInstance;
