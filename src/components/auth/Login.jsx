import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Light Background Blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl w-full bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* ===== Left Panel: Image ===== */}
        <div className="w-full md:w-2/5 relative overflow-hidden">
          {/* Background Image */}
          <img 
            src="https://i.pinimg.com/originals/7c/e9/e3/7ce9e34927261d3b035090cac779fec5.gif" 
            alt="Login Illustration" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 "></div>
          
          <div className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col justify-center items-center text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                សូមស្វាគមន៍
              </h1>
              <p className="text-white/90 text-lg drop-shadow-md">
                ចូលប្រើប្រាស់ជាមួយអ៊ីមែល និងពាក្យសម្ងាត់
              </p>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  ចុះឈ្មោះ <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== Right Panel: Login Form ===== */}
        <div className="w-full md:w-3/5 bg-white/90 backdrop-blur-md p-8 md:p-12 flex flex-col justify-center">
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto w-full space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">ចូលប្រើប្រាស់</h2>
              <p className="text-gray-500 mt-2">ចុះឈ្មោះជាមួយអ៊ីមែល</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;