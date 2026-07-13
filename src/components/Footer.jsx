import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/', { email });
      setSubStatus('Subscribed!');
      setEmail('');
    } catch {
      setSubStatus('Error. Try again.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-1 min-[450px]:col-span-2 md:col-span-1">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">Cipher Apparel</h3>
            <p className="text-xs sm:text-sm leading-relaxed">Premium fashion brand delivering quality and style. Discover the latest trends and shop with confidence.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">My Account</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/edit-profile" className="hover:text-white transition-colors">Edit Profile</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 min-[450px]:col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Newsletter</h4>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4">Subscribe to get updates on new arrivals and special offers.</p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 min-w-0 px-3 sm:px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="px-3 sm:px-4 py-2 bg-primary text-white rounded-r-lg text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors flex-shrink-0">
                Subscribe
              </button>
            </form>
            {subStatus && <p className="text-xs mt-2 text-green-400">{subStatus}</p>}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 sm:pt-6 text-center text-xs sm:text-sm">
          <p>&copy; 2026, Cipher Apparel - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
