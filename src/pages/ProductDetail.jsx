import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalf, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await api.get(`/products/${id}`);
      setProduct(data);
      setSelectedImage(data.image_url);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 btn-primary"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.sub_images || [])];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" /> ត្រឡប់ក្រោយ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ===== Image Section ===== */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-xl overflow-hidden relative p-4">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImage || product.image_url}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </div>

            {/* Glass Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((url, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === url 
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' 
                        : 'border-gray-200/50 bg-white/50 backdrop-blur-sm hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== Product Info Section ===== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {product.is_new && (
                  <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    ថ្មី
                  </span>
                )}
                {product.discounted_price && (
                  <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    បញ្ចុះតម្លៃ
                  </span>
                )}
                <span className="text-gray-500 text-sm bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-500 ml-1">
                  ({product.reviews_count} ការវាយតម្លៃ)
                </span>
              </div>
            </div>

            {/* Glass Price Card */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-2">
                {product.discounted_price ? (
                  <>
                    <span className="text-4xl font-bold text-indigo-600">
                      ${product.discounted_price.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100/80 backdrop-blur-sm text-red-600 px-3 py-1 rounded-full text-sm">
                      -{Math.round((1 - product.discounted_price / product.price) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-indigo-600">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600">✓ មានស្តុក ({product.stock_quantity} មាន)</span>
                ) : (
                  <span className="text-red-600">✗ អស់ស្តុក</span>
                )}
              </p>
            </div>

            <div className="border-t border-gray-200/50 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ការពិពណ៌នា</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Glass Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">លក្ខណៈបច្ចេកទេស</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200/50 last:border-0">
                      <span className="text-gray-600">{key}</span>
                      <span className="text-gray-800 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Glass Quantity + Add to Cart */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm rounded-full p-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-white rounded-full transition-colors duration-300 disabled:opacity-50"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 hover:bg-white rounded-full transition-colors duration-300 disabled:opacity-50"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart />
                <span>បន្ថែមទៅកន្ត្រក</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;