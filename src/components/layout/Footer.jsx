import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-gray-900 to-black pt-16 pb-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* ===== Company Info ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              {settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.site_name} 
                  className="h-12 w-auto object-contain drop-shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                  <FaStore />
                </div>
              )}
              <span className="text-2xl font-bold text-white drop-shadow-md">
                {settings.site_name || 'TechStore'}
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              ហាងទំនិញដ៏ល្អបំផុតសម្រាប់ផលិតផលបច្ចេកវិទ្យាថ្មីៗ ម៉ូដែល AI ហ្គេម និងផលិតផលឌីជីថលផ្សេងៗទៀត។
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                <FaYoutube />
              </a>
            </div>
          </motion.div>

          {/* ===== Quick Links ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">តំណភ្ជាប់រហ័ស</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>ទំព័រដើម</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>ហាង</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>អំពីយើង</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>ទំនាក់ទំនង</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* ===== Categories ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">ប្រភេទ</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop?category=ai" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>ម៉ូដែល AI</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=games" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>ហ្គេម</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=software" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>កម្មវិធី</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></span>
                  <span>គ្រឿងបន្ថែម</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* ===== Newsletter ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">ព្រឹត្តិបត្រព័ត៌មាន</h3>
            <p className="text-gray-400 mb-4">ចុះឈ្មោះដើម្បីទទួលបានការអាប់ដេតអំពីផលិតផលថ្មីៗ និងការផ្តល់ជូនពិសេស។</p>
            <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1 shadow-lg">
              <input
                type="email"
                placeholder="អ៊ីមែលរបស់អ្នក"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 px-4 py-2 text-sm"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
                ចុះឈ្មោះ
              </button>
            </div>
          </motion.div>
        </div>

        {/* ===== Footer Bottom ===== */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} {settings.site_name || 'TechStore'}. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;