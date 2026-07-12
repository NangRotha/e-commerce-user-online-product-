// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // ទាញយកស្ថានភាព Authenticated ពី AuthContext
  const { isAuthenticated } = useAuth();

  // ===== ផ្ទុក Cart ពី Backend =====
  const loadCart = async () => {
    // ប្រសិនបើមិនទាន់ Authenticated កុំហៅ API
    if (!isAuthenticated) {
      console.log('🛒 Not authenticated, skipping cart load');
      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🛒 Loading cart...');
      const data = await api.get('/cart/');
      setCartItems(data || []);
      console.log('✅ Cart loaded:', data);
    } catch (error) {
      // ប្រសិនបើ Error 401 មិនបាច់បង្ហាញ
      if (error?.status !== 401) {
        console.error('❌ Error loading cart:', error);
        toast.error('មិនអាចផ្ទុកកន្ត្រកបានទេ');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== ផ្ទុក Cart ពេល Authenticated ផ្លាស់ប្តូរ =====
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // ប្រសិនបើ Logout សម្អាត Cart
      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    }
  }, [isAuthenticated]);

  // ===== គណនាសរុប =====
  useEffect(() => {
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => {
      const unitPrice = item.product.discounted_price || item.product.price;
      return sum + (unitPrice * item.quantity);
    }, 0);
    setTotalItems(items);
    setTotalPrice(price);
  }, [cartItems]);

  // ===== បន្ថែមទៅកន្ត្រក =====
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('សូមចូលប្រើប្រាស់ជាមុនសិន');
      return;
    }
    try {
      console.log('🛒 Adding to cart:', { productId, quantity });
      const response = await api.post('/cart/', { 
        product_id: productId, 
        quantity: quantity 
      });
      toast.success('បានបន្ថែមទៅកន្ត្រក!');
      loadCart(); // ផ្ទុក Cart ឡើងវិញ
      return response;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('មិនអាចបន្ថែមទៅកន្ត្រកបានទេ');
      throw error;
    }
  };

  // ===== លុបពីកន្ត្រក =====
  const removeFromCart = async (cartItemId) => {
    try {
      console.log('🛒 Removing from cart:', cartItemId);
      await api.delete(`/cart/${cartItemId}`);
      toast.success('បានលុបចេញពីកន្ត្រក');
      loadCart();
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      toast.error('មិនអាចលុបចេញពីកន្ត្រកបានទេ');
      throw error;
    }
  };

  // ===== សម្អាតកន្ត្រក =====
  const clearCart = () => {
    setCartItems([]);
    setTotalItems(0);
    setTotalPrice(0);
  };

  const value = {
    cartItems,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};