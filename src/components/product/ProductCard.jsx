import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaStarHalf } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-yellow-400" />);
    }
    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer"
      >
        {/* ===== Image Wrapper ===== */}
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {/* Glass Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-lg">
                ថ្មី
              </span>
            )}
          </div>
          {product.discounted_price && (
            <span className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-lg">
              -{Math.round((1 - product.discounted_price / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* ===== Product Info ===== */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-1 mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-400 ml-1">({product.reviews_count})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {product.discounted_price ? (
                <>
                  <span className="text-xl font-bold text-indigo-600">
                    ${product.discounted_price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="relative p-3 bg-indigo-500/10 backdrop-blur-sm border border-indigo-200/50 text-indigo-600 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaShoppingCart className="text-lg" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;