import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTruck, FaHeadset, FaLock, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const { settings } = useSettings();

  const features = [
    { icon: FaTruck, title: 'ដឹកជញ្ជូនឥតគិតថ្លៃ', desc: 'ឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើសពី $50' },
    { icon: FaCheckCircle, title: 'ការធានាប្រាក់', desc: 'ធានាសងប្រាក់វិញ 30 ថ្ងៃ' },
    { icon: FaHeadset, title: 'គាំទ្រ 24/7', desc: 'គាំទ្រគ្រប់ពេលវេលា' },
    { icon: FaLock, title: 'ការទូទាត់ដែលមានសុវត្ថិភាព', desc: 'ទូទាត់ប្រាក់ដោយសុវត្ថិភាព' },
  ];

  return (
    <div>
      <HeroSection />
      
      {/* ===== Glass Feature Icons (កែតម្រូវ Colors និង Spacing) ===== */}
      <section className="mt-4 relative py-12 -mt-16 z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-gray-800 font-semibold text-base">{feature.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Featured Products Section ===== */}
      <div className="relative py-20 bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <FeaturedProducts />
        </div>
      </div>

      {/* ===== New Arrivals Section ===== */}
      <div className="py-20 bg-gradient-to-b from-purple-50/30 via-white to-indigo-50/30">
        <div className="container mx-auto px-4">
          <NewArrivals />
        </div>
      </div>
      
      {/* ===== Promotional Banner (Glassmorphism Style) ===== */}
      {settings.promo_is_active && (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            {/* Glass Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                {settings.promo_title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
                {settings.promo_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/shop"
                  className="group relative inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-indigo-600 font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>{settings.promo_button_text}</span>
                  <FaShoppingBag className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <span className="text-white/80 text-sm font-medium bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  បញ្ចូលកូដ៖ <span className="text-yellow-300 font-bold">{settings.promo_code}</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Home;