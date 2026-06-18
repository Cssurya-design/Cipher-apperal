import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../api';
import api from '../api';
import Footer from '../components/Footer';

const Cart = () => {
  useEffect(() => {
    document.title = "Shopping Cart | Cipher Apparel";
  }, []);

  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    try {
      const items = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      await api.post('/save-order/', { items });
      setOrderPlaced(true);
      clearCart();
      setTimeout(() => {
        setShowCheckout(false);
        setOrderPlaced(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-10"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm border border-gray-100"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                    onError={(e) => { e.target.src = '/hero-new.jpg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-800 w-20 text-right">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 h-fit sticky top-28"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </div>
      </div>

      {/* UPI Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative"
            >
              <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              
              {orderPlaced ? (
                <div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">🎉</motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                  <p className="text-gray-600">Thank you for your purchase.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pay via UPI</h3>
                  <p className="text-gray-600 mb-6">Scan the QR code to complete payment</p>
                  <img
                    src={`${API_BASE}/static/store/images/upi-qr.jpg`}
                    alt="UPI QR Code"
                    className="mx-auto w-48 h-48 rounded-xl border-2 border-gray-200 mb-6"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <p className="text-2xl font-bold text-primary mb-6">₹{cartTotal.toFixed(2)}</p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    I've Completed Payment
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Cart;
