import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext'; // នាំចូល AuthContext ដើម្បីពិនិត្យ Authenticated

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // ទាញយក isAuthenticated ពី AuthContext
  const { isAuthenticated } = useAuth();

  const loadCart = async () => {
    // ប្រសិនបើមិនទាន់ Authenticated សូមកុំហៅ API ហើយកុំឱ្យ Loading
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.get('/cart/');
      setCartItems(data || []);
    } catch (error) {
      // ទប់ស្កាត់ Error 401 កុំឱ្យបង្ហាញនៅលើ Console
      if (error?.status !== 401) {
        console.error('Error loading cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // ពឹងផ្អែកលើ isAuthenticated - ពេល Authenticated ផ្លាស់ប្តូរ វានឹងហៅ loadCart()
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  useEffect(() => {
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => sum + (item.product.discounted_price || item.product.price) * item.quantity, 0);
    setTotalItems(items);
    setTotalPrice(price);
  }, [cartItems]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('សូមចូលប្រើប្រាស់ជាមុនដើម្បីបន្ថែមទំនិញទៅកន្ត្រក');
      return;
    }
    try {
      const response = await api.post('/cart/', { product_id: productId, quantity });
      toast.success('បានបន្ថែមទៅកន្ត្រក!');
      loadCart();
      return response;
    } catch (error) {
      toast.error('បរាជ័យក្នុងការបន្ថែមទៅកន្ត្រក');
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      toast.success('បានលុបចេញពីកន្ត្រក');
      loadCart();
    } catch (error) {
      toast.error('បរាជ័យក្នុងការលុបចេញពីកន្ត្រក');
      throw error;
    }
  };

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