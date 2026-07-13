// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', parsedUser.username);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ No token found, user not authenticated');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { access_token } = response;
      localStorage.setItem('token', access_token);
      
      try {
        const userData = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      } catch (userError) {
        console.warn('⚠️ Could not fetch user data, but login successful:', userError);
        setUser(null);
        setIsAuthenticated(true);
      }
      
      toast.success('ចូលប្រើប្រាស់បានជោគជ័យ!');
      return { success: true };
    } catch (error) {
      const errorMessage = error || 'ចូលប្រើប្រាស់មិនបានជោគជ័យ';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      toast.success('ចុះឈ្មោះបានជោគជ័យ! សូមចូលប្រើប្រាស់។');
      return { success: true };
    } catch (error) {
      const errorMessage = error || 'ចុះឈ្មោះមិនបានជោគជ័យ';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('បានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};