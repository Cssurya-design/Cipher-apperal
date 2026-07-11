import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Zap, Share2, Heart, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import api, { API_BASE } from '../api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('XL');
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { displayLocation, setShowLocationModal } = useLocation();
  const toast = useToast();

  useEffect(() => {
    document.title = product ? `${product.name} | Cipher Apparel` : "Product | Cipher Apparel";
    api.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setIsWishlisted(res.data.is_wishlisted || false);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleRate = async (stars) => {
    if (!user) {
      toast.warning('Please login to rate this product');
      return;
    }
    setRatingLoading(true);
    try {
      await api.post('/rate-product/', {
        product_name: product.name,
        rating: stars,
        review_text: reviewText,
      });
      setProduct(prev => ({ ...prev, user_rating: stars }));
      // Refresh product to get updated reviews
      const res = await api.get(`/products/${id}/`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
    setRatingLoading(false);
  };

  const handleWishlist = async () => {
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

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    navigate('/cart');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Cipher Apparel!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  if (loading) return <div className="pt-24 text-center py-20 text-gray-500">Loading product...</div>;
  if (!product) return <div className="pt-24 text-center py-20 text-gray-500">Product not found</div>;

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <Link to="/shop" className="text-primary hover:underline mb-6 sm:mb-8 inline-block font-semibold text-sm">
          &larr; Back to Shop
        </Link>
        
        <div className="bg-white rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
          {/* Product Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <img
              src={getImageUrl(product.image, 'products')}
              alt={product.name}
              className="w-full rounded-2xl object-cover max-h-[500px]"
              onError={(e) => { e.target.src = '/hero-new.jpg'; }}
            />
          </motion.div>
          
          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
              </div>
              <button 
                onClick={handleWishlist}
                className={`p-3 rounded-full flex items-center justify-center transition-all border shadow-sm ${
                  isWishlisted
                    ? 'bg-pink-50 border-pink-100 text-pink-500'
                    : 'bg-white border-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                }`}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={18} fill={star <= product.avg_rating ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {product.avg_rating}/5 ({product.total_reviews} {product.total_reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-3xl font-bold text-primary">₹{product.discount_price || product.price}</p>
              {product.discount_price && (
                <p className="text-xl text-gray-400 line-through">₹{product.price}</p>
              )}
            </div>

            {/* Delivery location */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-4"
            >
              <MapPin size={14} />
              {displayLocation ? `Deliver to ${displayLocation}` : 'Select delivery location'}
            </button>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              {product.description || "Premium quality clothing designed for ultimate comfort and style. Perfect for every occasion."}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl font-semibold text-sm border-2 transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 px-6 py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                <ShoppingCart size={20} />
                {addedToCart ? '✓ Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} /> Buy Now
              </button>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm"
            >
              <Share2 size={16} /> Share this product
            </button>

            <hr className="my-6 border-gray-100" />

            {/* Rate this product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rate this product</h3>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={ratingLoading}
                    className={`transition-colors ${
                      star <= (hoverRating || product.user_rating) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  >
                    <Star size={28} fill="currentColor" />
                  </button>
                ))}
              </div>
              {user && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write a review (optional)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => handleRate(product.user_rating || 5)}
                    disabled={ratingLoading || !reviewText}
                    className="px-4 py-2 bg-primary text-white text-sm rounded-lg disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              )}
              {!user && <p className="text-xs text-gray-400 mt-2">Login required to rate</p>}
            </div>
          </motion.div>
        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100">
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-xl font-bold text-gray-900">
                Customer Reviews ({product.total_reviews})
              </h2>
              {showReviews ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showReviews && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 space-y-4"
              >
                {product.reviews.map((review, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        {review.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{review.user_name}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                      <div className="flex text-yellow-400 ml-auto">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    {review.review_text && (
                      <p className="text-gray-600 text-sm ml-11">{review.review_text}</p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {product.related_products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
