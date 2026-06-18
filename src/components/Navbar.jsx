import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full top-0 z-50 glass shadow-sm py-4 px-6 md:px-12 flex justify-between items-center"
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
      <div className="hidden md:flex space-x-6 items-center text-gray-800">
        <button className="hover:text-primary transition-colors"><MapPin size={22} /></button>
        <button className="hover:text-primary transition-colors"><Heart size={22} /></button>
        <Link to="/cart" className="hover:text-primary transition-colors"><ShoppingCart size={22} /></Link>
        <button className="hover:text-primary transition-colors"><User size={22} /></button>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center space-x-4 text-gray-800">
        <Link to="/cart"><ShoppingCart size={24} /></Link>
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
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
