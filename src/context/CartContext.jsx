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

  const addToCart = (product, quantity = 1, size = 'XL') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.size === size)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        ...product,
        quantity,
        size,
        description: product.description || '',
      }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, quantity, size) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        (item.id === productId && item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateSize = (productId, oldSize, newSize) => {
    setCart(prev => {
      // Check if an item with new size already exists
      const existingNew = prev.find(item => item.id === productId && item.size === newSize);
      if (existingNew) {
        // Merge quantities
        const oldItem = prev.find(item => item.id === productId && item.size === oldSize);
        return prev
          .map(item => {
            if (item.id === productId && item.size === newSize) {
              return { ...item, quantity: item.quantity + (oldItem?.quantity || 0) };
            }
            return item;
          })
          .filter(item => !(item.id === productId && item.size === oldSize));
      }
      // Just update size
      return prev.map(item =>
        (item.id === productId && item.size === oldSize)
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
