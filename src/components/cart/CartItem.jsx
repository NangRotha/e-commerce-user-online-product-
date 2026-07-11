import React from 'react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-24 h-24 flex-shrink-0">
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
          <p className="text-gray-600 text-sm">{item.product.category}</p>
          <div className="flex items-center mt-2">
            <span className="text-xl font-bold text-indigo-600">
              ${(item.product.discounted_price || item.product.price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200">
              <FaMinus className="text-xs text-gray-600" />
            </button>
            <span className="font-semibold w-8 text-center">{item.quantity}</span>
            <button className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200">
              <FaPlus className="text-xs text-gray-600" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
          >
            <FaTrash />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;