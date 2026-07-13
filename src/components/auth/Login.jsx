// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/');
    }
    setLoading(false);
  };

  // ===== Google Login Success =====
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential received");
      
      // === ផ្ញើ JSON Body ជាមួយ { token: ... } ===
      const response = await api.post('/auth/google/callback', {
        token: credentialResponse.credential
      });
      
      console.log("Backend response:", response);
      
      // ទទួល JWT Token ពី Backend
      const { access_token } = response;
      localStorage.setItem('token', access_token);
      
      // ទាញយកព័ត៌មានអ្នកប្រើប្រាស់ (ប្រើ try/catch)
      try {
        const userData = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (userError) {
        console.warn('⚠️ Could not fetch user data, but login successful:', userError);
      }
      
      toast.success('Google Login ជោគជ័យ!');
      
      // ផ្ទុកព័ត៌មានអ្នកប្រើប្រាស់ឡើងវិញ
      window.location.reload();
      
    } catch (error) {
      console.error('Google Login Error:', error);
      // === ធានាថា error គឺជា String ===
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Google Login បរាជ័យ');
      toast.error(errorMessage);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    toast.error('Google Login បរាជ័យ');
  };

  // Google Client ID ពី Environment Variable
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  if (!GOOGLE_CLIENT_ID) {
    console.warn('⚠️ VITE_GOOGLE_CLIENT_ID not set in environment');
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-indigo-50/30 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        {/* Background Blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-md w-full bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaLock className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              ត្រឡប់មកវិញ
            </h2>
            <p className="mt-2 text-gray-500">
              ចូលទៅកាន់គណនីរបស់អ្នកដើម្បីបន្តការទិញ
            </p>
          </div>

          {/* ===== Email/Password Login Form ===== */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ឈ្មោះអ្នកប្រើប្រាស់
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
                    placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ពាក្យសម្ងាត់
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl pl-12 pr-12 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
                    placeholder="បញ្ចូលពាក្យសម្ងាត់"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-gray-600">ចងចាំខ្ញុំ</span>
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
                ភ្លេចពាក្យសម្ងាត់?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
            >
              {loading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់'}
            </motion.button>
          </form>

          {/* ===== Google Login Section ===== */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/40 text-gray-500">ឬចូលប្រើប្រាស់ជាមួយ</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              {GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              ) : (
                <div className="text-red-500 text-sm">
                  ⚠️ មិនទាន់កំណត់ Google Client ID
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;