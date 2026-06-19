import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Footer from '../components/Footer';

const Auth = () => {
  useEffect(() => {
    document.title = "Login / Sign Up | Cipher Apparel";
  }, []);

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, googleLogin, logout } = useAuth();
  const navigate = useNavigate();

  // If switched to admin, force login mode (no signup for admins here)
  useEffect(() => {
    if (isAdminLogin) {
      setIsLogin(true);
      setError('');
    }
  }, [isAdminLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const verifyAdminAccess = (userData) => {
    if (isAdminLogin && !userData.is_staff) {
      logout();
      setError("Unauthorized. Your account does not have Admin privileges.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        if (verifyAdminAccess(res.user)) {
          navigate(isAdminLogin ? '/admin-dashboard' : '/');
        }
      } else {
        await signup(formData.name, formData.email, formData.password, profilePic);
        // Auto-login after signup
        const res = await login(formData.email, formData.password);
        if (verifyAdminAccess(res.user)) {
          navigate(isAdminLogin ? '/admin-dashboard' : '/');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Something went wrong';
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (verifyAdminAccess(res.user)) {
        navigate(isAdminLogin ? '/admin-dashboard' : '/');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError('Google Login Failed: ' + msg);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="max-w-md w-full mx-auto px-6 py-12 flex-1">
        
        {/* Admin vs Customer Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 p-1 rounded-full flex gap-1 shadow-inner">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                !isAdminLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                isAdminLogin ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <motion.div
          key={isAdminLogin ? 'admin' : 'customer'}
          initial={{ opacity: 0, x: isAdminLogin ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-3xl p-8 shadow-sm border ${isAdminLogin ? 'bg-primary/5 border-primary/20' : 'bg-white border-gray-100'}`}
        >
          {/* Login/Signup Toggle (hidden if Admin mode) */}
          {!isAdminLogin && (
            <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isAdminLogin ? 'Admin Portal' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && !isAdminLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-4"
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center font-medium">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
                isAdminLogin 
                  ? 'bg-gray-900 text-white hover:bg-black' 
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
            
            <div className="mt-6 flex items-center justify-center">
              <span className="w-1/5 border-b border-gray-300"></span>
              <span className="mx-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Or continue with</span>
              <span className="w-1/5 border-b border-gray-300"></span>
            </div>

            <div className="mt-6 flex justify-center hover:scale-105 transition-transform">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="outline"
                size="large"
              />
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
