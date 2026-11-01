import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('petlink_cart');
        if (stored) {
          setCart(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load cart', err);
      }
    };
    loadCart();
  }, []);

  const saveCart = async (newCart) => {
    setCart(newCart);
    try {
      await AsyncStorage.setItem('petlink_cart', JSON.stringify(newCart));
    } catch (err) {
      console.error('Failed to save cart', err);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => (item._id || item.id) === (product._id || product.id));
    let updated;
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cart, { ...product, quantity }];
    }
    saveCart(updated);
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => (item._id || item.id) !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId, delta) => {
    const updated = cart
      .map((item) => {
        if ((item._id || item.id) === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
