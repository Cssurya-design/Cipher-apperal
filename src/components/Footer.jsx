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
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Cipher Apparel</h3>
            <p className="text-sm leading-relaxed">Premium fashion brand delivering quality and style. Discover the latest trends and shop with confidence.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth" className="hover:text-white transition-colors">Login / Sign Up</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get updates on new arrivals and special offers.</p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-r-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                Subscribe
              </button>
            </form>
            {subStatus && <p className="text-xs mt-2 text-green-400">{subStatus}</p>}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; 2026, Cipher Apparel - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
