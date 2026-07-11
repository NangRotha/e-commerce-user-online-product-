import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaStar } from 'react-icons/fa';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await api.get('/products/featured/');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/60 rounded-full px-6 py-2 text-yellow-600 text-sm font-medium shadow-lg mb-4">
            <FaStar className="text-yellow-500" />
            <span>ពិសេស</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            ផលិតផលពិសេស
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mt-4"></div>
        </motion.div>

        <AnimatePresence mode="wait">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">មិនទាន់មានផលិតផលពិសេសនៅឡើយទេ</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedProducts;