import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaLock, FaTags, FaArrowRight, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [finalTotal, setFinalTotal] = useState(totalPrice);
  
  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'credit_card',
  });

  // Update total when coupon is applied
  useEffect(() => {
    if (appliedCoupon) {
      setFinalTotal(totalPrice * (1 - appliedCoupon.discount));
    } else {
      setFinalTotal(totalPrice);
    }
  }, [totalPrice, appliedCoupon]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('សូមបញ្ចូលកូដបញ្ចុះតម្លៃ');
      return;
    }

    setIsApplying(true);
    try {
      const upperCode = couponCode.toUpperCase();

      // Check against Settings Promo Code
      if (upperCode === settings.promo_code) {
        setAppliedCoupon({
          code: upperCode,
          discount: 0.30, // 30% discount
          message: `✅ បានប្រើកូដ "${upperCode}"!`,
        });
        toast.success(`បានប្រើកូដ "${upperCode}"!`);
        setCouponCode('');
      } else {
        toast.error('កូដមិនត្រឹមត្រូវ');
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error('បរាជ័យក្នុងការអនុវត្តកូដ');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info('បានលុបកូដ');
  };

  // Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('កន្ត្រករបស់អ្នកទទេ');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shipping_address: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        payment_method: formData.paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        discount_percent: appliedCoupon ? appliedCoupon.discount : 0,
        payment_status: 'pending',
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      toast.success('ការបញ្ជាទិញបានជោគជ័យ!');
      navigate(`/order-success/${response.id}`);
    } catch (error) {
      console.error('🔥 Error placing order:', error);
      const errorMessage = error?.detail || error?.message || 'បរាជ័យក្នុងការបញ្ជាទិញ';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <div className="text-center bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800">កន្ត្រករបស់អ្នកទទេ</h2>
          <p className="text-gray-500 mt-2 mb-6">សូមបន្ថែមផលិតផលទៅកន្ត្រកជាមុនសិន។</p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg"
          >
            បន្តការទិញ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">បញ្ជាក់ការបញ្ជាទិញ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== Order Summary (Glass Card) ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200/50 pb-4">
                សេចក្តីសង្ខេបនៃការបញ្ជាទិញ
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200/50 last:border-0 group">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden flex-shrink-0 border border-white/30 shadow-sm">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">ចំនួន: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-600">
                      ${((item.product.discounted_price || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Checkout Form (Glass Card) ===== */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="sticky top-24 bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">ព័ត៌មានដឹកជញ្ជូន</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះពេញ</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">អ៊ីមែល</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">អាសយដ្ឋាន</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ទីក្រុង</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ខេត្ត</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">លេខកូដតំបន់</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">លេខទូរស័ព្ទ</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">វិធីសាស្ត្រទូទាត់</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                  >
                    <option value="credit_card">ប័ណ្ណឥណទាន</option>
                    <option value="debit_card">ប័ណ្ណឥណពន្ធ</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>

              {/* ===== Coupon Section (Glass) ===== */}
              <div className="border-t border-gray-200/50 pt-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-700 mb-3">
                  <FaTags className="text-indigo-500" />
                  <span className="font-medium">បញ្ចូលកូដបញ្ចុះតម្លៃ</span>
                </div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        {appliedCoupon.message}
                      </p>
                      <p className="text-xs text-green-600">
                        កូដ: <span className="font-bold">{appliedCoupon.code}</span> ({Math.round(appliedCoupon.discount * 100)}% បញ្ចុះ)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-sm bg-red-50/80 backdrop-blur-sm text-red-500 px-3 py-1 rounded-full hover:bg-red-100 transition-colors duration-300"
                    >
                      លុប
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="បញ្ចូលកូដ..."
                        className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponCode.trim()}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isApplying ? <FaSpinner className="animate-spin" /> : 'អនុវត្ត'}
                    </button>
                  </div>
                )}
              </div>

              {/* ===== Order Total ===== */}
              <div className="border-t border-gray-200/50 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>សរុបរង</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>បញ្ចុះតម្លៃ ({Math.round(appliedCoupon.discount * 100)}%)</span>
                    <span>-${(totalPrice * appliedCoupon.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200/50">
                  <span>សរុប</span>
                  <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-xl" />
                ) : (
                  <>
                    <FaLock /> <span>បញ្ជាក់ការបញ្ជាទិញ</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;