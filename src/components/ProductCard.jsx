import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all relative group"
    >
      <img 
        src={`https://cipherapparel.pythonanywhere.com/static/store/images/products/${product.image}`} 
        alt={product.name} 
        className="w-full h-64 object-cover rounded-xl mb-4"
      />
      <div className="text-left">
        <span className="text-gray-400 text-xs tracking-wider uppercase">{product.category}</span>
        <h5 className="text-gray-800 font-semibold text-base mt-1 mb-2">{product.name}</h5>
        <div className="flex text-yellow-400 text-sm mb-2">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
        </div>
        <h4 className="text-primary font-bold text-lg">₹{product.price}</h4>
      </div>

      <button className="absolute top-6 right-6 w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-500 hover:text-white">
        <Heart size={20} />
      </button>

      <button className="absolute bottom-4 right-4 w-10 h-10 bg-green-50 text-secondary rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
        <ShoppingCart size={20} />
      </button>
    </motion.div>
  );
};

export default ProductCard;
