// src/utils/api.js
import axios from 'axios';

// ===== កំណត់ API URL ពី Environment Variable =====
// សំខាន់៖ ប្តូរ Fallback URL ទៅ Backend ដែលបាន Deploy
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
    // ប្រសិនបើ Response ជោគជ័យ ត្រឡប់ Data
    return response.data;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    // ប្រសិនបើ Token ផុតកំណត់ (401) ចេញពីប្រព័ន្ធ
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // បញ្ជូនទៅ Login ប្រសិនបើមិនទាន់នៅ Login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // ទាញយកសារ Error ពី Backend
    const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message ||
                         error.message ||
                         'Something went wrong';
    
    return Promise.reject(errorMessage);
  }
);

export default api;