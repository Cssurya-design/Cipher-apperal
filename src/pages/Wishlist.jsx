import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../api';
import api from '../api';
import Footer from '../components/Footer';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/wishlist/')
      .then(res => {
        setItems(res.data.wishlist);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      await api.post('/wishlist/', { product_id: productId });
      setItems(prev => prev.filter(item => item.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <Heart size={80} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Login to view your Wishlist</h2>
          <Link to="/auth" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
            Login / Sign Up
          </Link>
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
          My Wishlist
        </motion.h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
            <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-semibold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative group"
                >
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-64 object-cover rounded-xl mb-4" onError={(e) => { e.target.src = '/hero-new.jpg'; }} />
                  <h5 className="font-semibold text-gray-800">{item.name}</h5>
                  <p className="text-primary font-bold mt-1">₹{item.price}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { addToCart(item); }}
                      className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
