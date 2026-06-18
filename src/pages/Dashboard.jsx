import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE } from '../api';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Dashboard | Cipher Apparel";
    if (user) {
      api.get('/orders/')
        .then(res => {
          setOrders(res.data.orders || []);
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

  if (!user) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your dashboard</h2>
          <Link to="/auth" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            My Dashboard
          </motion.h1>
          <Link to="/edit-profile" className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
            Edit Profile
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6">Order History</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Product</th>
                    <th className="pb-4 font-semibold">Price</th>
                    <th className="pb-4 font-semibold">Qty</th>
                    <th className="pb-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, i) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="py-4 flex items-center gap-4">
                        <img src={getImageUrl(order.product_img)} alt="Product" className="w-16 h-16 object-cover rounded-lg" onError={(e) => { e.target.src = '/hero-new.jpg'; }} />
                        <span className="font-semibold text-gray-800">{order.product_name}</span>
                      </td>
                      <td className="py-4 text-gray-600">₹{order.price}</td>
                      <td className="py-4 text-gray-600">{order.quantity}</td>
                      <td className="py-4 text-gray-500 text-sm">{order.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
