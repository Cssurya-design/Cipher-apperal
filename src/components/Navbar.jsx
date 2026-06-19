import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, User, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { displayLocation, setShowLocationModal, location } = useLocation();
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
      className="fixed w-full top-0 z-50 glass shadow-sm py-3 px-4 sm:px-6 md:px-12 flex justify-between items-center"
    >
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <Link to="/">
          <img src="/Logo1.png" alt="Logo" className="h-7 sm:h-8 md:h-10" />
        </Link>

        {/* Location indicator — Amazon style */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="hidden sm:flex items-center gap-1 text-left hover:outline hover:outline-1 hover:outline-gray-300 rounded-lg px-2 py-1 transition-all group"
          title="Change delivery location"
        >
          <MapPin size={16} className="text-gray-500 group-hover:text-primary flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-gray-400 font-medium">Deliver to</span>
            <span className="text-xs font-bold text-gray-700 group-hover:text-primary max-w-[100px] truncate">
              {displayLocation || 'Select location'}
            </span>
          </div>
        </button>
      </div>

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
            {user.is_staff && (
              <Link to="/admin-dashboard" className="text-sm font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors">
                Admin Panel
              </Link>
            )}
            <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">
              {user.name || user.email}
            </Link>
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

      {/* Mobile: Location + Cart + Hamburger */}
      <div className="md:hidden flex items-center space-x-3 text-gray-800">
        {/* Mobile location button */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="sm:hidden flex items-center gap-0.5 text-gray-600 hover:text-primary transition-colors"
          title="Set delivery location"
        >
          <MapPin size={18} />
          {displayLocation && (
            <span className="text-[10px] font-bold max-w-[50px] truncate">{location?.city || ''}</span>
          )}
        </button>

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

      {/* Mobile Menu Drawer */}
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

            {/* Location in mobile menu */}
            <button
              onClick={() => { setShowLocationModal(true); setIsOpen(false); }}
              className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium">Deliver to</p>
                <p className="text-sm font-bold text-gray-800">
                  {displayLocation || 'Select your location'}
                </p>
                {location?.address_line1 && (
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">{location.address_line1}</p>
                )}
              </div>
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
                <>
                  {user.is_staff && (
                    <li>
                      <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold bg-gray-100 px-3 py-1 rounded-lg">
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-primary">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/edit-profile" onClick={() => setIsOpen(false)} className="text-primary">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-500">
                      Logout ({user.name || user.email})
                    </button>
                  </li>
                </>
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
