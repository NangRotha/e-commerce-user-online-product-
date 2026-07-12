// src/utils/api.js
import axios from 'axios';

// ប្តូរ URL ទៅតាម Backend របស់អ្នក
const API_URL = 'https://e-commerce-2026-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Request Interceptor: បន្ថែម Token ទៅក្នុង Request =====
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

// ===== Response Interceptor: គ្រប់គ្រង Error =====
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // ប្រសិនបើ Token ផុតកំណត់ (401) ចេញពីប្រព័ន្ធ
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // ប្រសិនបើកំពុងស្ថិតនៅលើទំព័រដែលមិនមែន Login សូមបញ្ជូនទៅ Login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;