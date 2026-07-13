import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState('details');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { displayLocation, setShowLocationModal } = useLocation();
  const toast = useToast();

  useEffect(() => {
    document.title = product ? `${product.name} | Cipher Apparel` : "Product | Cipher Apparel";
    api.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setSelectedImage(res.data.image);
        setIsWishlisted(res.data.is_wishlisted || false);
        setLoading(false);
        
        if (res.data.sizes && res.data.sizes.length > 0) {
          const availableSize = res.data.sizes.find(s => s.stock > 0);
          if (availableSize) setSelectedSize(availableSize.size);
          else setSelectedSize(res.data.sizes[0].size);
        }
        
        if (res.data.colors && res.data.colors.length > 0) {
          setSelectedColor(res.data.colors[0].color);
        }
        
        // Add to recently viewed
        try {
          const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const newItem = { id: res.data.id, name: res.data.name, image: res.data.image, price: res.data.price, discount_price: res.data.discount_price };
          const filtered = viewed.filter(item => item.id !== newItem.id);
          const updated = [newItem, ...filtered].slice(0, 4);
          localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        } catch(e) {}
        
        // Fetch related products
        if (res.data.category) {
          api.get(`/products/?category=${res.data.category.slug || res.data.category}`)
            .then(relRes => {
              const rel = relRes.data.products.filter(p => p.id !== res.data.id).slice(0, 4);
              setRelatedProducts(rel);
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
      
    // Fetch delivery setting
    api.get('/api/settings/')
      .then(res => {
        if (res.data?.settings?.delivery_days) {
          setDeliveryDays(parseInt(res.data.settings.delivery_days, 10) || 5);
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
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
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
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

  if (loading) return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="bg-white rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start animate-pulse">
          <div className="bg-gray-200 rounded-2xl w-full h-[300px] sm:h-[400px] md:h-[500px]"></div>
          <div className="flex flex-col space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded w-full mt-4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3 mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
  if (!product) return <div className="pt-24 text-center py-20 text-gray-500">Product not found</div>;

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <Link to="/shop" className="text-primary hover:underline mb-6 sm:mb-8 inline-block font-semibold text-sm">
          &larr; Back to Shop
        </Link>
        
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Product Image Gallery (Left Column) */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-5 lg:col-span-5 flex flex-col gap-4">
            <img
              src={getImageUrl(selectedImage || product.image, 'products')}
              alt={product.name}
              className="w-full rounded-2xl object-cover max-h-[500px]"
              onError={(e) => { e.target.src = '/hero-new.jpg'; }}
            />
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === product.image ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={getImageUrl(product.image, 'products')} className="w-full h-full object-cover" alt="Primary" />
                </button>
                {product.images.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === img.url ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={getImageUrl(img.url, 'products')} className="w-full h-full object-cover" alt="Gallery" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Product Info (Center Column) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-4 lg:col-span-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
              </div>
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

            <hr className="my-4 border-gray-100" />

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-2xl font-bold text-gray-900">
                <span className="text-sm text-gray-500 align-top mr-1">₹</span>
                {product.discount_price || product.price}
              </p>
              {product.discount_price && (
                <p className="text-lg text-gray-400 line-through">₹{product.price}</p>
              )}
            </div>

            {/* Bullet Features (Amazon Style) */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Accordions */}
            <div className="mb-6 space-y-2 border-t border-b py-4 border-gray-100">
              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-primary transition-colors py-2"
                >
                  <span>Product Details</span>
                  {activeAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {activeAccordion === 'details' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 text-sm mt-2 mb-4 leading-relaxed">
                        {product.description || "Premium quality clothing designed for ultimate comfort and style. Perfect for every occasion."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-primary transition-colors py-2"
                >
                  <span>Shipping & Returns</span>
                  {activeAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {activeAccordion === 'shipping' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 text-sm mt-2 mb-4 leading-relaxed">
                        Free shipping on orders over ₹1000. Hassle-free 15-day return policy. Items must be unworn and unwashed.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pb-2">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-primary transition-colors py-2"
                >
                  <span>Care Instructions</span>
                  {activeAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {activeAccordion === 'care' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="list-disc pl-5 text-gray-600 text-sm mt-2 mb-4 space-y-1">
                        <li>Machine wash cold with like colors</li>
                        <li>Do not bleach</li>
                        <li>Tumble dry low</li>
                        <li>Warm iron if needed</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Buy Box (Right Column) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-3 lg:col-span-3 border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm sticky top-28 flex flex-col bg-white">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              <span className="text-sm text-gray-500 align-top mr-1">₹</span>
              {product.discount_price || product.price}
            </p>

            {/* Delivery location */}
            <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors mb-1"
              >
                <MapPin size={12} />
                {displayLocation ? `Deliver to ${displayLocation}` : 'Select delivery location'}
              </button>
              <div className="text-gray-800">
                Delivery: <span className="font-bold text-gray-900">{(() => {
                  const est = new Date();
                  est.setDate(est.getDate() + deliveryDays);
                  return est.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
                })()}</span>
              </div>
            </div>

            {/* Scarcity Indicator */}
            <div className="mb-4 flex items-center gap-2 text-orange-600 text-sm font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              In Stock
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">Size: {selectedSize}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.size)}
                      disabled={s.stock <= 0}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs border-2 transition-all ${
                        selectedSize === s.size
                          ? 'border-primary bg-primary text-white'
                          : s.stock <= 0
                            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Size: {selectedSize}</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs border-2 transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Color: {selectedColor}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.color)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs border-2 transition-all ${
                        selectedColor === c.color
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {c.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-5">
              <h3 className="font-bold text-gray-900 mb-1 text-sm">Quantity:</h3>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-24 bg-gray-50 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-600 text-lg"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm bg-white h-8 flex items-center justify-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-600 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={handleAddToCart}
                className={`w-full py-2.5 font-bold rounded-full flex items-center justify-center transition-all text-sm ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200] shadow-sm'
                }`}
              >
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-2.5 bg-[#FFA41C] hover:bg-[#FA8900] text-gray-900 font-bold rounded-full transition-all flex items-center justify-center border border-[#FF8F00] shadow-sm text-sm"
              >
                Buy Now
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-16">Ships from</span>
                <span className="text-gray-900">Cipher Apparel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16">Sold by</span>
                <span className="text-gray-900">Cipher Apparel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16">Returns</span>
                <span className="text-blue-600 hover:underline cursor-pointer">15-day refund/replacement</span>
              </div>
            </div>

            <hr className="my-4 border-gray-100" />

            <button 
              onClick={handleWishlist}
              className="flex justify-center w-full items-center gap-2 border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <Heart size={16} className={isWishlisted ? "text-pink-500 fill-pink-500" : "text-gray-600"} /> 
              {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
            </button>
            
            <button
              onClick={handleShare}
              className="flex justify-center w-full mt-2 items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
            >
              <Share2 size={14} /> Share
            </button>
          </motion.div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-8 md:p-12 shadow-sm border border-gray-100 mt-6 grid grid-cols-1 gap-8">
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
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write a review (optional)"
                    className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => handleRate(product.user_rating || 5)}
                    disabled={ratingLoading || !reviewText}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm rounded-lg disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              )}
              {!user && <p className="text-xs text-gray-400 mt-2">Login required to rate</p>}
            </div>
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
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={`related-${p.id}`} product={p} />
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
