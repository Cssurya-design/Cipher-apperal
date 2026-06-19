import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, PackageSearch, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    document.title = "Admin Dashboard | Cipher Apparel";
    if (user && !user.is_staff) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders/');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateOrder = async (orderId, field, value) => {
    setUpdatingId(orderId);
    try {
      await api.post(`/admin/orders/${orderId}/update/`, { [field]: value });
      // Optimistically update UI
      setOrders(orders.map(o => o.id === orderId ? { ...o, [field]: value } : o));
    } catch (err) {
      alert("Failed to update order");
    }
    setUpdatingId(null);
  };

  if (!user || !user.is_staff) return null;

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-primary" size={32} />
              Admin Portal
            </h1>
            <p className="text-gray-500 mt-1">Manage orders, verify payments, and fulfill shipments.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
            <p className="text-sm text-orange-600 font-medium">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {orders.filter(o => o.payment_status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">To Ship</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {orders.filter(o => o.status === 'processing' || o.status === 'placed').length}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment Verification</th>
                  <th className="px-6 py-4">Shipping Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">#{order.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{order.user_email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800 max-w-[200px] truncate">{order.product_name}</div>
                      <div className="text-xs text-gray-500 mt-1">Qty: {order.quantity} {order.size && `| Size: ${order.size}`}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">₹{order.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">
                            {order.payment_method}
                          </span>
                          {order.payment_method === 'UPI' && order.transaction_id && (
                            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                              UTR: {order.transaction_id}
                            </span>
                          )}
                        </div>
                        
                        <select
                          value={order.payment_status}
                          onChange={(e) => updateOrder(order.id, 'payment_status', e.target.value)}
                          disabled={updatingId === order.id}
                          className={`text-xs font-bold rounded-lg px-2 py-1.5 border focus:outline-none ${
                            order.payment_status === 'Verified' ? 'bg-green-50 border-green-200 text-green-700' :
                            order.payment_status === 'Failed' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-orange-50 border-orange-200 text-orange-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified ✅</option>
                          <option value="Failed">Failed ❌</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, 'status', e.target.value)}
                        disabled={updatingId === order.id}
                        className="text-xs font-bold rounded-lg px-3 py-1.5 border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-primary"
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped 🚚</option>
                        <option value="delivered">Delivered 📦</option>
                        <option value="cancelled">Cancelled ❌</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
                      No orders found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
