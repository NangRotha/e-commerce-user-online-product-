import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

const HeroSection = () => {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Slides from Admin Settings or Default
  const slides = settings.slide_images && settings.slide_images.length > 0
    ? settings.slide_images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop'];

  // Auto-play
  useEffect(() => {
    let interval = null;
    if (isAutoPlaying && slides.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, slides.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-100 rounded-3xl">
        <p className="text-gray-500">No slides available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ===== Main Slider Container ===== */}
      <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl bg-gray-100">
        
        {/* ===== Slider Images ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* ===== Content Overlay ===== */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="max-w-lg"
            >
              {/* Glass Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-1.5 text-white text-sm mb-5 shadow-lg">
                ✨ បណ្តុំថ្មីៗ
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight drop-shadow-lg">
                ទិញជាមួយនិងទំនុកចិត្ត<br />
                <span className="text-yellow-400">គុណភាពខ្ពស់</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md drop-shadow-md font-light">
                ស្វែងយល់ពីភាពច្បាស់នៃសំឡេង និងការរចនាដ៏ទំនើប ដែលកំណត់ឡើងវិញនូវបទពិសោធន៍ស្តាប់របស់អ្នក។
              </p>
              
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                ទិញឥឡូវនេះ 
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ===== Navigation Arrows (Glass) ===== */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300 z-20 hover:scale-110"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300 z-20 hover:scale-110"
        >
          <FaChevronRight />
        </button>

        {/* ===== Dots Indicator ===== */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-3 rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? 'w-10 bg-white shadow-lg' 
                  : 'w-3 bg-white/50 hover:bg-white/80'
              }`}
            >
              {currentSlide === index && (
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;