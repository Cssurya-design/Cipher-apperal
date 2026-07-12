import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_BASE, getImageUrl } from '../api';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const features = [
  { img: 'f1.png', label: 'Free Shipping' },
  { img: 'f2.png', label: 'Online Order' },
  { img: 'f3.png', label: 'Save Money' },
  { img: 'f4.png', label: 'Promotions' },
  { img: 'f5.png', label: 'Happy Sell' },
  { img: 'f6.png', label: '24/7 Support' },
];


const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [banners, setBanners] = useState({ main: [], small: [], bottom: [] });
  const [promoCoupons, setPromoCoupons] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.title = "Home | Cipher Apparel";
    api.get('/featured/')
      .then(res => {
        setFeatured(res.data.featured || []);
        setNewArrivals(res.data.new_arrivals || []);
      })
      .catch(err => console.error("Error fetching featured products", err));

    api.get('/banners/')
      .then(res => {
        const fetched = res.data.banners || [];
        const promoBanners = fetched.filter(b => b.position === 'promo');
        setBanners({
          main: fetched.filter(b => b.position === 'main'),
          small: fetched.filter(b => b.position === 'small'),
          bottom: fetched.filter(b => b.position === 'bottom'),
        });
      })
      .catch(err => console.error("Error fetching banners", err));

    api.get('/public-coupons/')
      .then(res => {
        const coupons = res.data.coupons || [];
        setPromoCoupons(coupons);
      })
      .catch(err => console.error("Error fetching coupons", err));
  }, []);

  return (
    <div className="w-full">
      {promoCoupons && promoCoupons.length > 0 && (
        <div className="pt-[52px] sm:pt-[56px] md:pt-[64px] bg-white w-full">
          <div className="bg-purple-50 border-y border-primary/20 text-gray-800 overflow-hidden whitespace-nowrap py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold tracking-wide">
            <div className="animate-marquee inline-block">
              {promoCoupons.map((c, i) => (
                <span key={i} className="mx-4 sm:mx-8">
                  🎉 Limited Time Offer: Use code <span className="bg-primary text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded sm:rounded-md font-extrabold mx-1 shadow-sm">{c.code}</span> for {c.discount_percentage}% OFF!
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <Hero hasCoupon={promoCoupons && promoCoupons.length > 0} />
      
      {/* Features Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl py-4 sm:py-6 px-3 sm:px-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <img 
                src={`${API_BASE}/static/store/images/features/${feature.img}`} 
                alt={feature.label}
                className="mx-auto h-16 sm:h-24 mb-2 sm:mb-3"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h6 className="text-xs sm:text-sm font-bold w-max mx-auto px-2 py-1 bg-pink-50 text-[#088178] rounded">
                {feature.label}
              </h6>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-20 max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2"
        >
          Featured Products
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base"
        >
          Summer Collection New Modern Design
        </motion.p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link to="/shop" className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
            View All Featured
          </Link>
        </div>
      </section>

      {/* Main Banner */}
      {banners.main.length > 0 && banners.main.map(banner => (
        <section 
          key={banner.id}
          className="py-12 sm:py-20 md:py-24 text-center bg-cover bg-center text-white my-6 sm:my-12 flex flex-col justify-center items-center w-full min-h-[30vh] sm:min-h-[40vh] px-4"
          style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }}
        >
          {banner.subtitle && <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">{banner.subtitle}</h4>}
          {banner.title && <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6" dangerouslySetInnerHTML={{ __html: banner.title }}></h2>}
          {banner.description && <p className="mb-4">{banner.description}</p>}
          <button onClick={() => setSelectedOffer(banner)} className="bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-bold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base">
            Explore more
          </button>
        </section>
      ))}

      {/* New Arrivals */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-20 max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2"
        >
          New Arrivals
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base"
        >
          Summer Collection New Modern Design
        </motion.p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id + 'new'}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link to="/shop" className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
            View All New Arrivals
          </Link>
        </div>
      </section>

      {/* Small Banners */}
      {banners.small.length > 0 && (
        <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12 w-full flex flex-col md:flex-row gap-4 sm:gap-6 justify-between">
          {banners.small.map(banner => (
            <div 
              key={banner.id}
              className="w-full md:flex-1 bg-cover bg-center p-6 sm:p-8 md:p-12 text-white flex flex-col justify-center items-start min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh] rounded-xl"
              style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }}
            >
              {banner.subtitle && <h4 className="text-lg sm:text-xl font-light mb-2">{banner.subtitle}</h4>}
              {banner.title && <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" dangerouslySetInnerHTML={{ __html: banner.title }}></h2>}
              {banner.description && <span className="text-xs sm:text-sm font-medium mb-4 sm:mb-6">{banner.description}</span>}
              <button onClick={() => setSelectedOffer(banner)} className="border border-white px-4 sm:px-6 py-2 hover:bg-primary hover:border-primary transition-colors text-xs sm:text-sm font-semibold rounded block">Learn More</button>
            </div>
          ))}
        </section>
      )}

      {/* Bottom Banners */}
      {banners.bottom.length > 0 && (
        <section className="px-4 sm:px-6 md:px-10 lg:px-20 pb-12 sm:pb-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {banners.bottom.map((banner, index) => (
            <div 
              key={banner.id}
              className={`bg-cover bg-center p-6 sm:p-8 text-white flex flex-col justify-center items-start min-h-[25vh] sm:min-h-[30vh] rounded-xl ${index === 2 && banners.bottom.length === 3 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }}
            >
              {banner.title && <h2 className="text-xl sm:text-2xl font-bold mb-2 uppercase" dangerouslySetInnerHTML={{ __html: banner.title }}></h2>}
              {banner.subtitle && <h3 className="text-red-500 font-bold text-base sm:text-lg">{banner.subtitle}</h3>}
              <button onClick={() => setSelectedOffer(banner)} className="mt-4 border border-white px-4 py-1.5 hover:bg-primary hover:border-primary transition-colors text-xs font-semibold rounded">Shop Now</button>
            </div>
          ))}
        </section>
      )}

      {/* Offer Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col z-10"
            >
              {selectedOffer && (
                <>
                  <div 
                    className="h-48 sm:h-64 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${getImageUrl(selectedOffer.image)}')` }}
                  />
                  <button 
                    onClick={() => setSelectedOffer(null)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="p-6 sm:p-8">
                    {selectedOffer.subtitle && <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{selectedOffer.subtitle}</h4>}
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: (selectedOffer.title || '').replace(/<[^>]*>?/gm, '') }}></h3>
                    <p className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">{selectedOffer.description || "Grab this exclusive offer now!"}</p>
                    
                    <div className="flex gap-4">
                      {selectedOffer.product ? (
                        <button 
                          onClick={() => {
                            addToCart(selectedOffer.product);
                            toast.success(`Discount Applied! ${selectedOffer.product.name} added to cart.`);
                            setSelectedOffer(null);
                            navigate('/cart');
                          }}
                          className="inline-block bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-purple-900 transition-colors shadow-lg shadow-purple-200"
                        >
                          Get Discount & Add to Cart
                        </button>
                      ) : (
                        <Link 
                          to={selectedOffer.link || '/shop'}
                          onClick={() => setSelectedOffer(null)}
                          className="inline-block bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-purple-900 transition-colors shadow-lg shadow-purple-200"
                        >
                          Go to Offer
                        </Link>
                      )}
                      <button 
                        onClick={() => setSelectedOffer(null)}
                        className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Home;
