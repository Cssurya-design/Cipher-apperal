import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, PackageSearch, RefreshCw, CheckCircle2, XCircle, Users, UserPlus, UserMinus, Plus } from 'lucide-react';
import api, { API_BASE, getImageUrl } from '../api';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'staff' | 'banners' | 'coupons'
  
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

  // Banners State
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [products, setProducts] = useState([]);

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    document.title = "Admin Dashboard | Cipher Apparel";
    if (user && !user.is_staff) {
      navigate('/');
      return;
    }
    fetchOrders();
    fetchStaff();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'banners' && user?.is_staff) {
      fetchBanners();
      fetchProducts();
    }
    if (activeTab === 'coupons' && user?.is_staff) {
      fetchCoupons();
    }
  }, [activeTab, user]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/admin/orders/');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
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
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error(err);
      setStaffList([]);
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

  const fetchBanners = async () => {
    setBannersLoading(true);
    try {
      const res = await api.get('/admin/banners/');
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error(err);
      setBanners([]);
    }
    setBannersLoading(false);
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/admin/banners/${id}/`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (editingBanner.position) formData.append('position', editingBanner.position);
      if (editingBanner.title) formData.append('title', editingBanner.title);
      if (editingBanner.subtitle) formData.append('subtitle', editingBanner.subtitle);
      if (editingBanner.description) formData.append('description', editingBanner.description);
      if (editingBanner.product_id) formData.append('product_id', editingBanner.product_id);
      if (editingBanner.discount_price !== undefined && editingBanner.discount_price !== '') formData.append('discount_price', editingBanner.discount_price);
      formData.append('is_active', editingBanner.is_active ?? true);
      
      if (editingBanner.imageFile) {
        formData.append('image', editingBanner.imageFile);
      } else if (editingBanner.image) {
        formData.append('image', editingBanner.image);
      } else if (editingBanner.position !== 'promo') {
        toast.error('An image is required for this banner type');
        return;
      }

      if (editingBanner.id) {
        await api.put(`/admin/banners/${editingBanner.id}/`, formData);
        toast.success('Banner updated');
      } else {
        await api.post('/admin/banners/', formData);
        toast.success('Banner created');
      }
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      toast.error('Failed to save banner');
    }
  };

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await api.get('/admin/coupons/');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
      setCoupons([]);
    }
    setCouponsLoading(false);
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}/`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon.id) {
        await api.put(`/admin/coupons/${editingCoupon.id}/`, editingCoupon);
        toast.success('Coupon updated');
      } else {
        await api.post('/admin/coupons/', editingCoupon);
        toast.success('Coupon created');
      }
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save coupon');
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
            {activeTab === 'banners' && (
              <button onClick={() => setEditingBanner({ position: 'main', is_active: true })} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark self-start sm:self-auto">
                + Add Banner
              </button>
            )}
            {activeTab === 'coupons' && (
              <button onClick={() => setEditingCoupon({ code: '', discount_percentage: 10, max_uses: 100, is_active: true })} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark self-start sm:self-auto">
                + Add Coupon
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
            <button
              onClick={() => setActiveTab('banners')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'banners' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Promotions & Banners
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'coupons' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Coupons
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

        {/* --- BANNERS TAB --- */}
        {activeTab === 'banners' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Promotional Banners</h2>
            </div>
            {editingBanner ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-4">{editingBanner.id ? 'Edit Banner' : 'Create Banner'}</h2>
                <form onSubmit={handleSaveBanner} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Position</label>
                    <select value={editingBanner.position || 'main'} onChange={e => setEditingBanner({...editingBanner, position: e.target.value})} className="w-full p-2 border rounded">
                      <option value="main">Main (Center)</option>
                      <option value="small">Small (Half Width)</option>
                      <option value="bottom">Bottom (Third Width)</option>
                      <option value="promo">Promo Code Bar (Top Announcement)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title (HTML supported)</label>
                    <input type="text" value={editingBanner.title || ''} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} className="w-full p-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Subtitle</label>
                    <input type="text" value={editingBanner.subtitle || ''} onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Full Description (Shown in Offer Popup Modal)</label>
                    <textarea value={editingBanner.description || ''} onChange={e => setEditingBanner({...editingBanner, description: e.target.value})} className="w-full p-2 border rounded min-h-[100px]" placeholder="Enter the full offer details, terms, or descriptions here..." />
                  </div>
                  {editingBanner.position !== 'promo' && (
                    <div>
                      <label className="block text-sm font-semibold mb-1">Banner Image (Upload File)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          if (e.target.files.length > 0) {
                            setEditingBanner({...editingBanner, imageFile: e.target.files[0]});
                          }
                        }} 
                        className="w-full p-2 border rounded bg-gray-50" 
                      />
                      {editingBanner.image && !editingBanner.imageFile && (
                        <p className="text-xs text-gray-500 mt-2 font-medium">Current Image: {editingBanner.image}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-1">Linked Discount Product (Optional)</label>
                    <select 
                      value={editingBanner.product_id || ''} 
                      onChange={e => setEditingBanner({...editingBanner, product_id: e.target.value})} 
                      className="w-full p-2 border rounded"
                    >
                      <option value="">-- No Product Linked --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">If a product is linked, clicking the offer will automatically apply a discount / add it to cart.</p>
                  </div>
                  {editingBanner.product_id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-semibold mb-1">Discount Price for this Product (₹)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={editingBanner.discount_price || ''} 
                        onChange={e => setEditingBanner({...editingBanner, discount_price: e.target.value})} 
                        className="w-full p-2 border rounded" 
                        placeholder="e.g. 499.00" 
                      />
                      <p className="text-xs text-green-600 font-semibold mt-1">This will update the product's price sitewide to show a strikethrough sale price.</p>
                    </motion.div>
                  )}
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" checked={editingBanner.is_active ?? true} onChange={e => setEditingBanner({...editingBanner, is_active: e.target.checked})} id="is_active" />
                    <label htmlFor="is_active" className="text-sm font-semibold">Active</label>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-bold">Save Banner</button>
                    <button type="button" onClick={() => setEditingBanner(null)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded font-bold">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map(banner => (
                  <div key={banner.id} className={`bg-white rounded-xl shadow-sm border ${banner.is_active ? 'border-gray-200' : 'border-red-200'} overflow-hidden`}>
                    <div className="h-32 bg-gray-100 relative bg-cover bg-center" style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }}>
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold uppercase">{banner.position}</span>
                      {!banner.is_active && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">INACTIVE</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{String(banner.title || '').replace(/<[^>]*>?/gm, '')}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <button onClick={() => setEditingBanner(banner)} className="text-sm font-semibold text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteBanner(banner.id)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* --- COUPONS TAB --- */}
        {activeTab === 'coupons' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {editingCoupon ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <h2 className="text-xl font-bold mb-6">{editingCoupon.id ? 'Edit Coupon' : 'Create Coupon'}</h2>
                <form onSubmit={handleSaveCoupon} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Coupon Code</label>
                    <input type="text" required value={editingCoupon.code} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})} className="w-full p-2 border rounded font-mono uppercase" placeholder="e.g. SUMMER20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Discount Percentage (%)</label>
                    <input type="number" min="1" max="100" required value={editingCoupon.discount_percentage} onChange={e => setEditingCoupon({...editingCoupon, discount_percentage: e.target.value})} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Maximum Uses</label>
                    <input type="number" min="1" required value={editingCoupon.max_uses} onChange={e => setEditingCoupon({...editingCoupon, max_uses: e.target.value})} className="w-full p-2 border rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Valid From (Optional)</label>
                      <input type="datetime-local" value={editingCoupon.valid_from ? editingCoupon.valid_from.slice(0,16) : ''} onChange={e => setEditingCoupon({...editingCoupon, valid_from: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Valid To (Optional)</label>
                      <input type="datetime-local" value={editingCoupon.valid_to ? editingCoupon.valid_to.slice(0,16) : ''} onChange={e => setEditingCoupon({...editingCoupon, valid_to: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" checked={editingCoupon.is_active} onChange={e => setEditingCoupon({...editingCoupon, is_active: e.target.checked})} id="coupon_active" />
                    <label htmlFor="coupon_active" className="text-sm font-semibold">Active</label>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setEditingCoupon(null)} className="flex-1 bg-gray-100 py-2 rounded font-semibold">Cancel</button>
                    <button type="submit" className="flex-1 bg-primary text-white py-2 rounded font-semibold">Save Coupon</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-4 font-semibold text-gray-600 text-sm">Code</th>
                        <th className="p-4 font-semibold text-gray-600 text-sm">Discount</th>
                        <th className="p-4 font-semibold text-gray-600 text-sm">Usage</th>
                        <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                        <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {couponsLoading ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading coupons...</td></tr>
                      ) : coupons.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No coupons found.</td></tr>
                      ) : (
                        coupons.map(coupon => (
                          <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4"><span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">{coupon.code}</span></td>
                            <td className="p-4 font-semibold">{coupon.discount_percentage}% OFF</td>
                            <td className="p-4 text-sm text-gray-600">{coupon.current_uses} / {coupon.max_uses} used</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {coupon.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button onClick={() => setEditingCoupon(coupon)} className="text-blue-600 text-sm font-semibold hover:underline mr-4">Edit</button>
                              <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
