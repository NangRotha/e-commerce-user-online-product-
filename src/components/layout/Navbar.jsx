import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'ទំព័រដើម', path: '/' },
    { name: 'ហាង', path: '/shop' },
    { name: 'ផលិតផលថ្មី', path: '/shop?is_new=true' },
    { name: 'អំពីយើង', path: '/about' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-4 z-50 px-4 md:px-8">
      {/* ===== Main Glass Bar ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-2"
      >
        {/* ===== Logo & Title ===== */}
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          {settings.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings.site_name} 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
              M
            </div>
          )}
          {/* ===== កែត្រង់នេះ៖ ប្តូរពី hidden sm:block ទៅ hidden md:block ===== */}
          <span className="text-xl md:text-2xl font-bold text-gray-800 drop-shadow-sm group-hover:text-indigo-600 transition-colors duration-300 hidden md:block">
            {settings.site_name || 'MarketPlace'}
          </span>
        </Link>

        {/* ===== Desktop Navigation Links ===== */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium text-sm transition-all duration-300 rounded-full hover:bg-indigo-50/50"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ===== Search Bar (Glass Style) ===== */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gray-100/50 rounded-full blur-xl group-hover:bg-gray-200/50 transition-all duration-500"></div>
            <div className="relative flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full py-2 px-4 pl-10 shadow-inner">
              <FaSearch className="absolute left-3 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកផលិតផល..."
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm focus:placeholder-gray-500 transition-all duration-300"
              />
            </div>
          </div>
        </form>

        {/* ===== Right Icons ===== */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Cart Icon */}
          {isAuthenticated && (
            <Link to="/cart" className="relative group text-gray-700 hover:text-indigo-600 transition-colors duration-300">
              <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform duration-300" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-lg"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 focus:outline-none"
              >
                <FaUser className="text-xl" />
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-sm transition-all duration-300">
                        ប្រវត្តិរូប
                      </Link>
                      <Link to="/orders" className="block px-4 py-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-sm transition-all duration-300">
                        ការបញ្ជាទិញ
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50/50 text-sm transition-all duration-300"
                      >
                        ចាកចេញ
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors duration-300">
                ចូល
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                ចុះឈ្មោះ
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-300"
          >
            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </motion.div>

      {/* ===== Mobile Menu ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-700 hover:text-indigo-600 font-medium py-2 px-3 rounded-xl hover:bg-indigo-50/50 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200/50">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរក..."
                    className="w-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full py-2.5 px-4 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;