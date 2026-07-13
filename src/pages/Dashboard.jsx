import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation as useLocationCtx } from '../context/LocationContext';
import { Star, Package, CreditCard, MapPin, Edit3, ShoppingBag, Heart, Truck, ExternalLink } from 'lucide-react';
import api, { API_BASE } from '../api';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
const STATUS_STYLES = {
  placed: 'status-placed',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

// Progress percentage for the mini status bar
const STATUS_PROGRESS = {
  placed: 20,
  processing: 45,
  shipped: 75,
  delivered: 100,
  cancelled: 0,
};

const getEstimatedDelivery = (dateStr, deliveryDays = 5) => {
  let est = new Date();
  if (dateStr) {
    const parsed = new Date(dateStr.split('•')[0].trim());
    if (!isNaN(parsed.getTime())) {
      est = parsed;
    }
  }
  est.setDate(est.getDate() + deliveryDays);
  return est.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
};

const Dashboard = () => {
  const { user } = useAuth();
  const { displayLocation, location } = useLocationCtx();
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ total_orders: 0, total_spent: '0' });
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(null);
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(viewed);
    } catch(e) {}
  }, []);

  useEffect(() => {
    document.title = "My Dashboard | Cipher Apparel";
    if (user) {
      api.get('/orders/')
        .then(res => {
          setOrders(res.data.grouped_orders || res.data.orders || []);
          setSummary(res.data.summary || { total_orders: 0, total_spent: '0' });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
      // Fetch delivery days setting
      api.get('/api/settings/')
        .then(res => {
          if (res.data?.settings?.delivery_days) {
            setDeliveryDays(parseInt(res.data.settings.delivery_days, 10) || 5);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  const handleRateOrder = async (item, stars) => {
    setRatingLoading(item.id);
    try {
      await api.post('/rate-product/', { product_name: item.product_name, rating: stars });
      setOrders(prev => prev.map(group => ({
        ...group,
        items: group.items?.map(i => i.id === item.id ? { ...i, user_rating: stars } : i)
      })));
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold backdrop-blur-sm flex-shrink-0 overflow-hidden">
              {user.profile_pic ? (
                <img 
                  src={user.profile_pic.startsWith('http') ? user.profile_pic : `${API_BASE}${user.profile_pic}`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
              )}
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
              {orders.map((group, i) => (
                <motion.div
                  key={group.group_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-800">Order #{group.group_id}</h3>
                      <p className="text-xs text-gray-500 mt-1">{group.date} • {group.items?.length || 0} items</p>
                    </div>
                    <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                      <p className="font-bold text-primary">₹{group.total_price}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLES[group.status] || 'bg-gray-100'}`}>
                          {group.status_display || group.status}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          group.payment_status === 'Verified' ? 'bg-green-100 text-green-700' 
                          : group.payment_status === 'Failed' ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                        }`}>
                          {group.payment_status === 'Pending' ? 'Pending Verification'
                            : group.payment_status === 'Verified' ? 'Verified ✓'
                            : group.payment_status === 'Failed' ? 'Failed'
                            : group.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.items?.map(item => (
                      <div key={item.id} className="flex gap-3 sm:gap-4 items-center">
                        <img
                          src={getImageUrl(item.product_img)}
                          alt={item.product_name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl flex-shrink-0"
                          onError={(e) => { e.target.src = '/hero-new.jpg'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm truncate">{item.product_name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.size && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                Size: {item.size}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                           <p className="font-semibold text-sm text-gray-800">₹{item.price}</p>
                           <div className="flex gap-0.5 justify-end mt-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => handleRateOrder(item, star)}
                                  disabled={ratingLoading === item.id}
                                  className={`transition-colors ${
                                    star <= item.user_rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                                  }`}
                                >
                                  <Star size={12} fill="currentColor" />
                                </button>
                              ))}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar for the group */}
                  {group.status !== 'cancelled' && (
                    <div className="order-progress-bar mt-5">
                      <div
                        className="order-progress-fill"
                        style={{ width: `${STATUS_PROGRESS[group.status] || 0}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-50">
                    {group.status !== 'delivered' && group.status !== 'cancelled' ? (
                      <div className="flex items-center gap-1">
                        <Truck size={14} className="text-primary flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                        Est. delivery: <span className="font-medium text-gray-700">{getEstimatedDelivery(group.date, deliveryDays)}</span>
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}
                    
                    <Link
                      to={`/orders/${group.group_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark border border-primary/30 hover:border-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <ExternalLink size={12} />
                      Track Order
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        {!loading && recentlyViewed.length > 0 && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {recentlyViewed.map((product) => (
                <ProductCard key={`recent-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
