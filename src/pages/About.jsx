import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaTruck, FaHeadset, FaShieldAlt, FaStar } from 'react-icons/fa';

const About = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      const data = await api.get('/pages/about');
      setPageContent(data);
    } catch (error) {
      console.error('Error fetching about page:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for features
  const getFeatureIcon = (feature) => {
    const lower = feature.toLowerCase();
    if (lower.includes('shipping') || lower.includes('delivery')) return <FaTruck />;
    if (lower.includes('support') || lower.includes('help') || lower.includes('247')) return <FaHeadset />;
    if (lower.includes('secure') || lower.includes('payment') || lower.includes('safe')) return <FaShieldAlt />;
    return <FaStar />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          រកមិនឃើញមាតិកា
          <br />
          <span className="text-sm text-gray-500">សូមបង្កើតទំព័រនៅក្នុង Admin Panel (Pages)។</span>
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ===== Hero Section ===== */}
      <div className="mt-12 relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block bg-white/60 backdrop-blur-sm border border-white/60 rounded-full px-6 py-2 text-purple-600 text-sm font-medium shadow-lg"
            >
              📖 អំពីយើង
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight drop-shadow-sm">
              {pageContent.title}
            </h1>

            {/* Glass Image Card */}
            {pageContent.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative mt-8 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40"
              >
                {/* Inner Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                <img 
                  src={pageContent.image_url} 
                  alt={pageContent.title} 
                  className="w-full h-[350px] md:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ===== Content & Features ===== */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        
        {/* ===== Content Section ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200/60 rounded-3xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg md:prose-xl text-gray-700 leading-relaxed font-light">
              {pageContent.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6">{paragraph}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== Features Section ===== */}
        {pageContent.features && pageContent.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                ហេតុអ្វីជ្រើសរើសយើង?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageContent.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
                    <div className="text-2xl text-indigo-600">
                      {getFeatureIcon(feature)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{feature}</h3>
                  <p className="text-gray-500 text-sm">
                    យើងប្តេជ្ញាផ្តល់នូវបទពិសោធន៍ល្អបំផុតសម្រាប់អតិថិជនរបស់យើង។
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== Gallery Section ===== */}
        {pageContent.gallery_images && pageContent.gallery_images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                វិចិត្រសាលរូបភាព
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pageContent.gallery_images.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => window.open(url, '_blank')}
                >
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-gray-800 text-xs font-medium">
                      មើលរូបភាព
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default About;