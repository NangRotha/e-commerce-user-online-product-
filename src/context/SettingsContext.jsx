// src/context/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'TechStore',
    logo_url: null,
    favicon_url: null,
    slide_images: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // ✅ កែតម្រូវ៖ ហៅ API Public ដែលមិនត្រូវការ Token
      const data = await api.get('/admin/settings/public');
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // ប្រើតម្លៃ Default ប្រសិនបើហៅ API មិនបាន
      setSettings({
        site_name: 'TechStore',
        logo_url: null,
        favicon_url: null,
        slide_images: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};