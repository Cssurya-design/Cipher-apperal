import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size = 'XL', color = '') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.size === size && item.color === color)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const sizeObj = product.sizes?.find(s => s.size === size);
      const activePrice = sizeObj?.price || product.price;
      const activeDiscountPrice = sizeObj?.discount_price || product.discount_price;

      return [...prev, {
        ...product,
        price: activePrice,
        discount_price: activeDiscountPrice,
        quantity,
        size,
        color,
        description: product.description || '',
      }];
    });
  };

  const removeFromCart = (productId, size, color = '') => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size && (item.color || '') === color)));
  };

  const updateQuantity = (productId, quantity, size, color = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        (item.id === productId && item.size === size && (item.color || '') === color)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateSize = (productId, oldSize, newSize, color = '') => {
    setCart(prev => {
      // Check if an item with new size already exists
      const existingNew = prev.find(item => item.id === productId && item.size === newSize && (item.color || '') === color);
      if (existingNew) {
        // Merge quantities
        const oldItem = prev.find(item => item.id === productId && item.size === oldSize && (item.color || '') === color);
        return prev
          .map(item => {
            if (item.id === productId && item.size === newSize && (item.color || '') === color) {
              return { ...item, quantity: item.quantity + (oldItem?.quantity || 0) };
            }
            return item;
          })
          .filter(item => !(item.id === productId && item.size === oldSize && (item.color || '') === color));
      }
      // Just update size
      return prev.map(item =>
        (item.id === productId && item.size === oldSize && (item.color || '') === color)
          ? { ...item, size: newSize }
          : item
      );
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.discount_price || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateSize, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
