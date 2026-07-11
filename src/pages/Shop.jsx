import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaFilter, FaUndo } from 'react-icons/fa';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showNewOnly, setShowNewOnly] = useState(searchParams.get('is_new') === 'true');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, showNewOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (showNewOnly) params.append('is_new', 'true');
      
      const data = await api.get(`/products/?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/products/');
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setShowNewOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ===== Header & Filters ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
          <h1 className="text-4xl font-bold text-gray-800">
            ហាង
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400 text-sm" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-medium py-1 px-2 text-sm min-w-[120px] cursor-pointer"
              >
                <option value="">គ្រប់ប្រភេទ</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="w-px h-6 bg-gray-200/50"></div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showNewOnly}
                  onChange={(e) => setShowNewOnly(e.target.checked)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-all checked:bg-indigo-600 checked:border-indigo-600 hover:checked:bg-indigo-700"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px]">
                  ✓
                </span>
              </div>
              <span className="text-gray-700 text-sm font-medium">ថ្មីៗ</span>
            </label>
            
            {(selectedCategory || showNewOnly) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 bg-red-50/50 hover:bg-red-100/50 px-3 py-1 rounded-full transition-all duration-300"
              >
                <FaUndo className="text-[10px]" />
                <span>សម្អាត</span>
              </button>
            )}
          </div>
        </div>

        {/* ===== Product Grid ===== */}
        <AnimatePresence mode="wait">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFilter className="text-3xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-600">គ្មានផលិតផល</h2>
              <p className="text-gray-400 mt-2">សូមកែសម្រួលតម្រងរបស់អ្នក ឬព្យាយាមម្តងទៀត។</p>
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
    </div>
  );
};

export default Shop;