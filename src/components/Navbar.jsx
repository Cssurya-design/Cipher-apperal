import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full top-0 z-50 glass shadow-sm py-3 px-6 md:px-12 flex justify-between items-center"
    >
      <Link to="/">
        <img src="/Logo1.png" alt="Logo" className="h-8 md:h-10" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 items-center font-semibold text-gray-800">
        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
        <li><Link to="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
        <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
        <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
        <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
      </ul>

      {/* Icons */}
      <div className="hidden md:flex space-x-5 items-center text-gray-800">
        <Link to="/wishlist" className="hover:text-primary transition-colors">
          <Heart size={22} />
        </Link>
        <Link to="/cart" className="hover:text-primary transition-colors relative">
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">{user.name || user.email}</span>
            <button onClick={handleLogout} className="hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="hover:text-primary transition-colors">
            <User size={22} />
          </Link>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center space-x-4 text-gray-800">
        <Link to="/cart" className="relative">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm glass shadow-2xl z-50 flex flex-col p-8"
          >
            <button className="self-end mb-8 text-gray-800" onClick={() => setIsOpen(false)}>
              <X size={32} />
            </button>
            <ul className="flex flex-col space-y-6 text-xl font-semibold text-gray-800">
              <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li><Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link></li>
              <li><Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
              <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
              <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
              <li><Link to="/wishlist" onClick={() => setIsOpen(false)}>Wishlist</Link></li>
              <li><Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link></li>
              {user ? (
                <li>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-500">
                    Logout ({user.name || user.email})
                  </button>
                </li>
              ) : (
                <li><Link to="/auth" onClick={() => setIsOpen(false)}>Login / Sign Up</Link></li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
