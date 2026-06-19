import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, X, ShoppingBag, MapPin, Smartphone, Monitor } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation as useLocationCtx } from '../context/LocationContext';
import { API_BASE } from '../api';
import api from '../api';
import Footer from '../components/Footer';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// UPI VPA — update this to your actual UPI address
const UPI_VPA = 'cipherapparel@upi';
const UPI_PAYEE_NAME = 'Cipher Apparel';

const Cart = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Shopping Cart | Cipher Apparel";
  }, []);

  const { cart, removeFromCart, updateQuantity, updateSize, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { displayLocation, location, setShowLocationModal } = useLocationCtx();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const items = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || '',
        image: item.image || '',
        description: item.description || '',
      }));
      await api.post('/save-order/', { items });
      setOrderPlaced(true);
      clearCart();
      setTimeout(() => {
        setShowCheckout(false);
        setOrderPlaced(false);
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  const generateUpiUrl = () => {
    const amount = cartTotal.toFixed(2);
    const note = `Cipher Apparel Order - ${cart.length} items`;
    return `upi://pay?pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const openUpiApp = (appScheme) => {
    const upiUrl = generateUpiUrl();
    // Try deep-link for specific apps
    if (appScheme === 'gpay') {
      window.location.href = `tez://upi/pay?pa=${UPI_VPA}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Cipher Apparel Order')}`;
    } else if (appScheme === 'phonepe') {
      window.location.href = `phonepe://pay?pa=${UPI_VPA}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Cipher Apparel Order')}`;
    } else if (appScheme === 'paytm') {
      window.location.href = `paytmmp://pay?pa=${UPI_VPA}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Cipher Apparel Order')}`;
    } else {
      window.location.href = upiUrl;
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-10"
        >
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </motion.h1>

        {/* Delivery location bar */}
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
          <MapPin size={18} className="text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-blue-800">
              {displayLocation
                ? `Delivering to ${location?.city}${location?.postal_code ? ' - ' + location.postal_code : ''}`
                : 'Select a delivery location'}
            </span>
          </div>
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-blue-600 text-sm font-semibold hover:underline flex-shrink-0"
          >
            Change
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-3 sm:gap-5">
                    {/* Image */}
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = '/hero-new.jpg'; }}
                    />
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-primary font-bold mt-1">₹{item.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Size & Quantity Row */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Size Selector */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Size:</span>
                          <select
                            value={item.size || 'M'}
                            onChange={(e) => updateSize(item.id, item.size, e.target.value)}
                            className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary bg-white"
                          >
                            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="font-bold text-gray-800 ml-auto text-sm sm:text-base">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-28"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="text-green-500 font-semibold">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                if (!user) { navigate('/auth'); return; }
                setShowCheckout(true);
              }}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center mt-3 text-sm text-gray-500 hover:text-primary">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              
              {orderPlaced ? (
                <div className="py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">🎉</motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                  <p className="text-gray-600">Thank you for your purchase. Redirecting to dashboard...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                  <p className="text-3xl font-bold text-primary mb-6">₹{cartTotal.toFixed(2)}</p>

                  {/* Desktop: Show QR */}
                  {!isMobile && (
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
                        <Monitor size={16} />
                        <span className="text-sm">Scan QR code to pay</span>
                      </div>
                      <img
                        src={`${API_BASE}/static/store/images/upi-qr.jpg`}
                        alt="UPI QR Code"
                        className="mx-auto w-48 h-48 rounded-xl border-2 border-gray-200 mb-4"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Mobile/Tablet: Show UPI app buttons */}
                  {isMobile && (
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                        <Smartphone size={16} />
                        <span className="text-sm">Pay with your UPI app</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          onClick={() => openUpiApp('gpay')}
                          className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                          <span className="text-2xl">💳</span>
                          <span className="font-semibold text-gray-700">Google Pay</span>
                        </button>
                        <button
                          onClick={() => openUpiApp('phonepe')}
                          className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                          <span className="text-2xl">📱</span>
                          <span className="font-semibold text-gray-700">PhonePe</span>
                        </button>
                        <button
                          onClick={() => openUpiApp('paytm')}
                          className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 hover:border-sky-500 hover:bg-sky-50 transition-all"
                        >
                          <span className="text-2xl">💰</span>
                          <span className="font-semibold text-gray-700">Paytm</span>
                        </button>
                        <button
                          onClick={() => openUpiApp('generic')}
                          className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl py-3 px-4 font-semibold"
                        >
                          <span className="text-2xl">🏦</span>
                          Open Any UPI App
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 text-white py-3.5 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    {isMobile ? "I've Completed UPI Payment" : "I've Completed Payment"}
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
