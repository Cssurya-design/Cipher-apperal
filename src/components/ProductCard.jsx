import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE, getImageUrl } from '../api';
import { useToast } from '../components/Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl = getImageUrl(product.image, 'products');

  const avgRating = product.avg_rating || 0;
  const totalReviews = product.total_reviews || 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add to wishlist');
      navigate('/auth');
      return;
    }
    try {
      const res = await api.post('/wishlist/', { product_id: product.id });
      if (res.data.status === 'added') {
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      } else {
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.12)" }}
      className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm transition-all relative group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl mb-3">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = '/hero-new.jpg'; }}
          />
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Eye size={14} /> Quick View
            </span>
          </div>
        </div>
        <span className="text-gray-400 text-[10px] sm:text-xs tracking-wider uppercase">{product.category}</span>
        <h5 className="text-gray-800 font-semibold text-sm sm:text-base mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h5>
      </Link>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col mr-2">
          <h4 className="text-primary font-bold text-base sm:text-lg truncate">
            ₹{product.discount_price || product.price}
          </h4>
          {product.discount_price && (
            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} size={12} fill={star <= Math.round(avgRating) ? "currentColor" : "none"} strokeWidth={1.5} />
            ))}
          </div>
          {totalReviews > 0 && (
            <span className="text-[10px] text-gray-400">({totalReviews})</span>
          )}
        </div>
      </div>

      <button 
        onClick={handleWishlist}
        className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-pink-500 text-white opacity-100'
            : 'bg-pink-50 text-pink-500 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-pink-500 hover:text-white'
        }`}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <button 
        onClick={(e) => { e.preventDefault(); addToCart(product, 1, 'XL'); }}
        className="absolute bottom-14 sm:bottom-16 right-5 w-9 h-9 bg-green-50 text-secondary rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
      >
        <ShoppingCart size={18} />
      </button>
    </motion.div>
  );
};

export default ProductCard;
