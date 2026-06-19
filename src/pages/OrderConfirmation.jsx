import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const OrderConfirmation = () => {
  useEffect(() => {
    document.title = "Order Confirmed | Cipher Apparel";
  }, []);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryStr = estimatedDelivery.toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
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
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
        >
          Order Confirmed! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mb-8"
        >
          Thank you for your purchase. Your order has been placed successfully.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package size={20} className="text-primary" />
            <p className="font-semibold text-gray-800">Estimated Delivery</p>
          </div>
          <p className="text-lg font-bold text-primary">{deliveryStr}</p>
          <p className="text-sm text-gray-500 mt-2">You can track your order from the Dashboard</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            View My Orders <ArrowRight size={18} />
          </Link>
          <Link
            to="/shop"
            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
