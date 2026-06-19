import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation as useLocationCtx } from '../context/LocationContext';
import { Star, Package, CreditCard, MapPin, Edit3, ShoppingBag, Heart } from 'lucide-react';
import api, { API_BASE } from '../api';
import Footer from '../components/Footer';

const STATUS_STYLES = {
  placed: 'status-placed',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const Dashboard = () => {
  const { user } = useAuth();
  const { displayLocation, location } = useLocationCtx();
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ total_orders: 0, total_spent: '0' });
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(null);

  useEffect(() => {
    document.title = "My Dashboard | Cipher Apparel";
    if (user) {
      api.get('/orders/')
        .then(res => {
          setOrders(res.data.orders || []);
          setSummary(res.data.summary || { total_orders: 0, total_spent: '0' });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  const handleRateOrder = async (order, stars) => {
    setRatingLoading(order.id);
    try {
      await api.post('/rate-product/', { product_name: order.product_name, rating: stars });
      setOrders(prev => prev.map(o =>
        o.id === order.id ? { ...o, user_rating: stars } : o
      ));
    } catch (err) {
      console.error(err);
    }
    setRatingLoading(null);
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please login to view your dashboard</h2>
          <Link to="/auth" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-5 sm:p-8 text-white mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold backdrop-blur-sm flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">{user.name || 'User'}</h1>
              <p className="text-white/70 text-sm truncate">{user.email}</p>
              {displayLocation && (
                <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                  <MapPin size={12} /> {displayLocation}
                </p>
              )}
            </div>
            <Link
              to="/edit-profile"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors flex-shrink-0"
            >
              <Edit3 size={16} /> Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Package size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{summary.total_orders}</p>
            <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{parseFloat(summary.total_spent).toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-500">Total Spent</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <MapPin size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">
              {location?.city || 'Not set'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Delivery Location</p>
          </motion.div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold">Order History</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
              <Link to="/shop" className="text-primary font-semibold hover:underline">Start Shopping</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <img
                      src={getImageUrl(order.product_img)}
                      alt={order.product_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
                      onError={(e) => { e.target.src = '/hero-new.jpg'; }}
                    />
                    
                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {order.product_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {order.size && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                Size: {order.size}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Qty: {order.quantity}</span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold text-gray-600 border border-gray-200 px-2 py-0.5 rounded">
                              {order.payment_method === 'COD' ? '💵 COD' : '💳 UPI'}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${order.payment_status === 'Verified' ? 'bg-green-100 text-green-700' : order.payment_status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {order.payment_status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:text-right flex-shrink-0">
                          <p className="font-bold text-primary">₹{order.price}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100'}`}>
                            {order.status_display || order.status}
                          </span>
                        </div>
                      </div>

                      {/* Description snippet */}
                      {order.product_description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {order.product_description}
                        </p>
                      )}

                      {/* Rating for this order */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Your rating:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => handleRateOrder(order, star)}
                              disabled={ratingLoading === order.id}
                              className={`transition-colors ${
                                star <= order.user_rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                              }`}
                            >
                              <Star size={16} fill="currentColor" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
