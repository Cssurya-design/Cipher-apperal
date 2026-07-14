import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../api';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const groupId = state?.group_id || null;
  const orderIds = state?.orderIds || [];
  const [deliveryDays, setDeliveryDays] = useState(5);

  useEffect(() => {
    document.title = "Order Confirmed | Cipher Apparel";
    // Fetch delivery setting
    api.get('/settings/')
      .then(res => {
        if (res.data?.settings?.delivery_days) {
          setDeliveryDays(parseInt(res.data.settings.delivery_days, 10) || 5);
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);
  const deliveryStr = estimatedDelivery.toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={40} className="text-green-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
        >
          Order Confirmed! 🎉
        </motion.h1>

        {/* Order number */}
        {groupId && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-gray-400 text-sm mb-1"
          >
            Order #{orderIds.join(', #')}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mb-8"
        >
          Thank you for your purchase. Your order has been placed successfully.
        </motion.p>

        {/* Delivery card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Package size={20} className="text-primary" />
            <p className="font-semibold text-gray-800">Estimated Delivery</p>
          </div>
          <p className="text-lg font-bold text-primary">{deliveryStr}</p>
          <p className="text-sm text-gray-500 mt-2">You can track your order status in real-time</p>

          {/* Live tracker hint */}
          {groupId && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Truck size={16} className="text-primary" />
              <span>Tracking updates will appear as your order progresses</span>
            </div>
          )}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {groupId && (
            <Link
              to={`/orders/${groupId}`}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              Track Your Order <ArrowRight size={18} />
            </Link>
          )}
          <Link
            to="/dashboard"
            className={`px-6 py-3 rounded-xl font-semibold border border-gray-200 transition-colors flex items-center justify-center gap-2 ${
              groupId
                ? 'bg-white text-gray-700 hover:bg-gray-50'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            View My Orders {!groupId && <ArrowRight size={18} />}
          </Link>
          <Link
            to="/shop"
            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;

