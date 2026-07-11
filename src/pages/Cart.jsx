import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaArrowRight, FaSpinner } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8"
          >
            <div className="w-24 h-24 bg-indigo-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingCart className="text-4xl text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">កន្ត្រកទទេ</h2>
            <p className="text-gray-500 mb-6">បន្ថែមផលិតផលទៅកន្ត្រករបស់អ្នកដើម្បីឱ្យវាបង្ហាញនៅទីនេះ។</p>
            <Link to="/shop" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg">
              បន្តការទិញ
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">កន្ត្រកទិញទំនិញ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== Cart Items ===== */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CartItem item={item} />
              </motion.div>
            ))}
          </div>

          {/* ===== Cart Summary (Glass Card) ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">សេចក្តីសង្ខេប</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>សរុបរង ({totalItems} មុខ)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ការដឹកជញ្ជូន</span>
                  <span className="text-green-600 font-medium">ឥតគិតថ្លៃ</span>
                </div>
                <div className="border-t border-gray-200/50 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>សរុប</span>
                    <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="group w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>បញ្ជាទិញ</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;