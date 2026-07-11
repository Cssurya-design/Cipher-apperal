import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, PackageSearch, RefreshCw, CheckCircle2, XCircle, Users, UserPlus, UserMinus } from 'lucide-react';
import api from '../api';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'staff'
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Staff State
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('staff');
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');

  useEffect(() => {
    document.title = "Admin Dashboard | Cipher Apparel";
    if (user && !user.is_staff) {
      navigate('/');
      return;
    }
    fetchOrders();
    fetchStaff();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/admin/orders/');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
    setOrdersLoading(false);
  };

  const updateOrder = async (orderId, field, value) => {
    setUpdatingId(orderId);
    try {
      await api.post(`/admin/orders/${orderId}/update/`, { [field]: value });
      setOrders(orders.map(o => o.id === orderId ? { ...o, [field]: value } : o));
    } catch (err) {
      toast.error('Failed to update order. Please try again.');
    }
    setUpdatingId(null);
  };

  const fetchStaff = async () => {
    setStaffLoading(true);
    try {
      const res = await api.get('/admin/staff/');
      setStaffList(res.data.staff);
    } catch (err) {
      console.error(err);
    }
    setStaffLoading(false);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setStaffError('');
    setStaffSuccess('');
    if (!newStaffEmail) return;

    try {
      const res = await api.post('/admin/staff/add/', { 
        email: newStaffEmail,
        role: newStaffRole 
      });
      setStaffSuccess(res.data.message);
      setNewStaffEmail('');
      setNewStaffRole('staff');
      fetchStaff();
    } catch (err) {
      setStaffError(err.response?.data?.error || "Failed to add staff");
    }
  };

  const handleRemoveStaff = async (email) => {
    if (!window.confirm(`Are you sure you want to revoke admin access for ${email}?`)) return;
    
    setStaffError('');
    setStaffSuccess('');
    try {
      const res = await api.post('/admin/staff/remove/', { email });
      setStaffSuccess(res.data.message);
      fetchStaff();
    } catch (err) {
      setStaffError(err.response?.data?.error || "Failed to remove staff");
    }
  };

  if (!user || !user.is_staff) return null;

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 w-full">
        
        {/* Header & Tabs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="text-primary" size={32} />
                Admin Portal
              </h1>
              <p className="text-gray-500 mt-1">Manage orders, payments, and staff members.</p>
            </div>
            
            {activeTab === 'orders' && (
              <button onClick={fetchOrders} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 self-start sm:self-auto">
                <RefreshCw size={16} className={ordersLoading ? 'animate-spin' : ''} />
                Refresh Orders
              </button>
            )}
            {activeTab === 'staff' && (
              <button onClick={fetchStaff} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 self-start sm:self-auto">
                <RefreshCw size={16} className={staffLoading ? 'animate-spin' : ''} />
                Refresh Staff
              </button>
            )}
          </div>

          <div className="flex border-b border-gray-200 gap-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Order Management
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Manage Staff
            </button>
          </div>
        </div>

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
                    {orders.length === 0 && !ordersLoading && (
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
          </motion.div>
        )}

        {/* --- STAFF TAB --- */}
        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            
            {/* Add Staff Form - Only visible to Owner/Superusers */}
            {user.is_superuser && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <UserPlus size={20} className="text-primary" />
                  Add New Team Member
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Grant access to an employee via their Google email address.
                  <br />
                  <span className="font-semibold text-gray-700">Admin</span>: Can manage orders AND add/remove staff. <span className="font-semibold text-gray-700">Staff</span>: Can only manage orders.
                </p>
                
                <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="employee@gmail.com"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="staff">Role: Staff</option>
                    <option value="admin">Role: Admin</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                  >
                    Grant Access
                  </button>
                </form>
                
                {staffError && <p className="text-red-500 text-sm font-medium mt-3 bg-red-50 p-2 rounded-lg">{staffError}</p>}
                {staffSuccess && <p className="text-green-600 text-sm font-medium mt-3 bg-green-50 p-2 rounded-lg">{staffSuccess}</p>}
              </div>
            )}

            {/* Staff List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users size={20} className="text-gray-700" />
                  Current Staff Members ({staffList.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {staffList.map((staff) => (
                  <div key={staff.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{staff.email}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          staff.is_superuser ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {staff.is_superuser ? 'Admin' : 'Staff'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {staff.name ? `Name: ${staff.name}` : 'Not logged in yet'} • Added: {staff.date_joined}
                      </p>
                    </div>
                    {user.is_superuser ? (
                      staff.email !== user.email ? (
                        <button
                          onClick={() => handleRemoveStaff(staff.email)}
                          className="flex items-center justify-center gap-1.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100"
                        >
                          <UserMinus size={16} />
                          Revoke Access
                        </button>
                      ) : (
                        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 text-center">
                          You (Cannot revoke)
                        </span>
                      )
                    ) : null}
                  </div>
                ))}
                {staffList.length === 0 && !staffLoading && (
                  <div className="p-8 text-center text-gray-500">
                    No staff members found.
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
