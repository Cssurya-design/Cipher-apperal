import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE } from '../api';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleRate = async (stars) => {
    if (!user) {
      alert("Please login to rate this product");
      return;
    }
    setRatingLoading(true);
    try {
      await api.post('/rate-product/', { product_name: product.name, rating: stars });
      setProduct({ ...product, user_rating: stars });
    } catch (err) {
      console.error(err);
    }
    setRatingLoading(false);
  };

  const getImageUrl = (image) => {
    if (!image) return '/hero-new.jpg';
    return image.startsWith('http') ? image : `${API_BASE}/static/store/images/products/${image}`;
  };

  if (loading) return <div className="pt-24 text-center py-20 text-gray-500">Loading product...</div>;
  if (!product) return <div className="pt-24 text-center py-20 text-gray-500">Product not found</div>;

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/shop" className="text-primary hover:underline mb-8 inline-block font-semibold">
          &larr; Back to Shop
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <img src={getImageUrl(product.image)} alt={product.name} className="w-full rounded-2xl object-cover" onError={(e) => { e.target.src = '/hero-new.jpg'; }} />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={20} fill={star <= product.avg_rating ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.avg_rating} / 5 from {product.total_reviews} reviews)</span>
            </div>

            <p className="text-3xl font-bold text-primary mb-6">₹{product.price}</p>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description || "Premium quality clothing designed for ultimate comfort and style. Perfect for every occasion."}
            </p>

            <button 
              onClick={() => addToCart(product)}
              className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>

            <hr className="my-8 border-gray-100" />

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rate this product</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => handleRate(star)}
                    disabled={ratingLoading}
                    className={`transition-colors ${star <= product.user_rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                  >
                    <Star size={28} fill="currentColor" />
                  </button>
                ))}
              </div>
              {!user && <p className="text-xs text-gray-400 mt-2">Login required to rate</p>}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
