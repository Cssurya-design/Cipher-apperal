import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package, Truck, CheckCircle2, Clock, MapPin, CreditCard,
  Banknote, ArrowLeft, XCircle, Star, ShoppingBag, AlertTriangle,
} from 'lucide-react';
import api, { API_BASE } from '../api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// Status ordering for the timeline
const STATUSES = [
  { key: 'placed',     label: 'Order Placed',  icon: Package },
  { key: 'processing', label: 'Processing',     icon: Clock },
  { key: 'shipped',    label: 'Shipped',        icon: Truck },
  { key: 'delivered',  label: 'Delivered',      icon: CheckCircle2 },
];

const STATUS_ORDER = { placed: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };

const getEstimatedDelivery = () => {
  const est = new Date();
  est.setDate(est.getDate() + 5);
  return est.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
};

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    document.title = `Order #${id} | Cipher Apparel`;
    if (!user) { navigate('/auth'); return; }
    fetchOrder();
  }, [id, user]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/${id}/`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found.');
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel/`);
      setOrder(prev => ({ ...prev, status: 'cancelled', status_display: 'Cancelled' }));
      setShowCancelConfirm(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel order.');
    }
    setCancelling(false);
  };

  const handleRate = async (stars) => {
    if (!order) return;
    setRatingLoading(true);
    try {
      await api.post('/rate-product/', { product_name: order.product_name, rating: stars });
      setOrder(prev => ({ ...prev, user_rating: stars }));
    } catch (err) {
      console.error(err);
    }
    setRatingLoading(false);
  };

  const getImageUrl = (img) => {
    if (!img) return '/hero-new.jpg';
    return img.startsWith('http') ? img : `${API_BASE}/static/store/images/products/${img}`;
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading order details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={60} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">{error}</h2>
          <Link to="/dashboard" className="text-primary font-semibold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentIdx = STATUS_ORDER[order.status] ?? 0;

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-sm text-gray-400 mt-1">Placed on {order.date} at {order.time}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold w-fit ${
              isCancelled
                ? 'bg-red-100 text-red-700'
                : order.status === 'delivered'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {isCancelled
              ? <XCircle size={14} />
              : order.status === 'delivered'
              ? <CheckCircle2 size={14} />
              : <Clock size={14} />}
            {order.status_display}
          </span>
        </motion.div>

        {/* Tracking Timeline */}
        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6"
          >
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Order Progress</h2>
            <div className="flex items-start justify-between">
              {STATUSES.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentIdx;
                const isActive = idx === currentIdx;
                const isPending = idx > currentIdx;
                const cls = isCompleted ? 'completed' : isActive ? 'active' : 'pending';
                return (
                  <div key={step.key} className={`tracking-step ${cls}`}>
                    <div className="tracking-step-icon">
                      <Icon size={18} />
                    </div>
                    <p className={`text-xs mt-2 text-center font-medium leading-tight max-w-[70px] ${
                      isPending ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {order.status !== 'delivered' && (
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                <Truck size={16} className="text-primary flex-shrink-0" />
                <span>
                  Estimated delivery:{' '}
                  <span className="font-semibold text-gray-800">{getEstimatedDelivery()}</span>
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-4"
          >
            <XCircle size={32} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-700">Order Cancelled</p>
              <p className="text-sm text-red-400 mt-0.5">
                This order was cancelled. Contact support if you have questions.
              </p>
            </div>
          </motion.div>
        )}

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Product Details</h2>
          <div className="flex gap-4">
            <img
              src={getImageUrl(order.product_img)}
              alt={order.product_name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
              onError={(e) => { e.target.src = '/hero-new.jpg'; }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{order.product_name}</h3>
              {order.product_description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{order.product_description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {order.size && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                    Size: {order.size}
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                  Qty: {order.quantity}
                </span>
                <span className="text-sm font-bold text-primary">₹{order.price}</span>
              </div>
            </div>
          </div>

          {/* Rating (delivered only) */}
          {order.status === 'delivered' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-2">Rate this product:</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    disabled={ratingLoading}
                    className={`transition-colors ${
                      star <= order.user_rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star size={22} fill="currentColor" />
                  </button>
                ))}
                {order.user_rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500">You rated {order.user_rating}/5</span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Grid: Address + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-primary" />
              <h2 className="text-sm font-bold text-gray-700">Delivery Address</h2>
            </div>
            {order.address ? (
              <p className="text-sm text-gray-600 leading-relaxed">{order.address}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No address on file</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-3">
              {order.payment_method === 'COD'
                ? <Banknote size={15} className="text-green-600" />
                : <CreditCard size={15} className="text-primary" />}
              <h2 className="text-sm font-bold text-gray-700">Payment</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold text-gray-800">
                  {order.payment_method === 'COD' ? '💵 Cash on Delivery' : '💳 UPI'}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                  order.payment_status === 'Verified'
                    ? 'bg-green-100 text-green-700'
                    : order.payment_status === 'Failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              {order.transaction_id && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">UTR/Txn ID</span>
                  <span className="font-mono text-xs text-gray-700 break-all text-right max-w-[120px]">
                    {order.transaction_id}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t pt-2 mt-1">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-primary">₹{order.price}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cancel Order */}
        {order.status === 'placed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Need to cancel?</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Orders can only be cancelled before processing begins.
                </p>
              </div>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200"
              >
                Cancel Order
              </button>
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Last updated: {order.updated_at}
        </p>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to cancel Order #{order.id}? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default OrderTracking;
