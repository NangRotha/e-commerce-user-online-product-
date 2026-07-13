// src/utils/api.js
import axios from 'axios';

// ===== កំណត់ API URL ពី Environment Variable =====
// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-online-product.onrender.com/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ===== Request Interceptor: បន្ថែម Token ទៅក្នុង Request =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached to request');
    }
    // សំខាន់៖ លុប Content-Type នៅពេលផ្ញើ FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// ===== Response Interceptor: គ្រប់គ្រង Error និង Response =====
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    let errorMessage = 'Something went wrong';
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail.map(err => err.msg).join(', ');
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return Promise.reject(errorMessage);
  }
);

export default api;