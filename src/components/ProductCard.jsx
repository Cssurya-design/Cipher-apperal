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

  // Use product_category_name if available, fall back to category
  const categoryLabel = product.product_category_name || product.category || '';

  // Calculate discount percentage if both prices present
  const originalPrice = parseFloat(product.price) || 0;
  const discountedPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const discountPercent = discountedPrice
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

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
      whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.12)' }}
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm transition-all relative group overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full aspect-square sm:aspect-[3/4] object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = '/hero-new.jpg'; }}
          />
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full shadow">
              -{discountPercent}%
            </span>
          )}
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors hidden sm:flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Eye size={14} /> Quick View
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2.5 sm:p-4">
          {/* Category */}
          {categoryLabel && (
            <span className="text-gray-400 text-[9px] sm:text-xs tracking-widest uppercase font-medium">
              {categoryLabel}
            </span>
          )}

          {/* Name */}
          <h5 className="text-gray-900 font-bold text-xs sm:text-base mt-0.5 mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h5>

          {/* Description snippet — hide on mobile for space */}
          {product.description && (
            <p className="hidden sm:block text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={10} fill={star <= Math.round(avgRating) ? 'currentColor' : 'none'} strokeWidth={1.5} className="sm:w-3.5 sm:h-3.5" />
              ))}
            </div>
            {totalReviews > 0 && (
              <span className="text-[9px] sm:text-[11px] text-gray-400 ml-0.5">({totalReviews})</span>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <span className="text-primary font-bold text-sm sm:text-lg block leading-tight">
                ₹{discountedPrice !== null ? discountedPrice.toFixed(2) : originalPrice.toFixed(2)}
              </span>
              {discountedPrice !== null && (
                <span className="text-[9px] sm:text-xs text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
              )}
            </div>
            {/* Add to Cart button */}
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, 1, 'XL'); }}
              className="w-7 h-7 sm:w-9 sm:h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors flex-shrink-0"
              title="Add to cart"
            >
              <ShoppingCart size={13} className="sm:w-[17px] sm:h-[17px]" />
            </button>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
          isWishlisted
            ? 'bg-pink-500 text-white'
            : 'bg-white/90 text-pink-500 hover:bg-pink-500 hover:text-white'
        }`}
      >
        <Heart size={14} className="sm:w-[17px] sm:h-[17px]" fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>
    </motion.div>
  );
};

export default ProductCard;
