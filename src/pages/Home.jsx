import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api, { API_BASE } from '../api';

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

  useEffect(() => {
    document.title = "Home | Cipher Apparel";
    api.get('/featured/')
      .then(res => setFeatured(res.data.featured))
      .catch(err => console.error("Error fetching featured products", err));
  }, []);

  return (
    <div className="w-full">
      <Hero />
      
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
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
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
      </section>

      {/* Main Banner */}
      <section 
        className="py-12 sm:py-20 md:py-24 text-center bg-cover bg-center text-white my-6 sm:my-12 flex flex-col justify-center items-center w-full min-h-[30vh] sm:min-h-[40vh] px-4"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b2.jpg')` }}
      >
        <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">Repair Services</h4>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Up to <span className="text-red-500">70% off</span> All t-shirts and accessories</h2>
        <Link to="/shop" className="bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-bold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base">
          Explore more
        </Link>
      </section>

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
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {featured.slice().reverse().map((product, index) => (
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
      </section>

      {/* Small Banners */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12 w-full flex flex-col md:flex-row gap-4 sm:gap-6 justify-between">
        <div 
          className="w-full md:w-[48%] bg-cover bg-center p-6 sm:p-8 md:p-12 text-white flex flex-col justify-center items-start min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh] rounded-xl"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b17.jpg')` }}
        >
          <h4 className="text-lg sm:text-xl font-light mb-2">crazy deals</h4>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">buy 1 get 1 free</h2>
          <span className="text-xs sm:text-sm font-medium mb-4 sm:mb-6">The best classic dress is on sale at cipher apparel</span>
          <button className="border border-white px-4 sm:px-6 py-2 hover:bg-primary hover:border-primary transition-colors text-xs sm:text-sm font-semibold rounded">Learn More</button>
        </div>
        <div 
          className="w-full md:w-[48%] bg-cover bg-center p-6 sm:p-8 md:p-12 text-white flex flex-col justify-center items-start min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh] rounded-xl"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b10.jpg')` }}
        >
          <h4 className="text-lg sm:text-xl font-light mb-2">spring/summer</h4>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">upcoming season</h2>
          <span className="text-xs sm:text-sm font-medium mb-4 sm:mb-6">The best classic dress is on sale at cipher apparel</span>
          <button className="border border-white px-4 sm:px-6 py-2 hover:bg-primary hover:border-primary transition-colors text-xs sm:text-sm font-semibold rounded">Learn More</button>
        </div>
      </section>

      {/* Bottom 3 Banners */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 pb-12 sm:pb-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div 
          className="bg-cover bg-center p-6 sm:p-8 text-white flex flex-col justify-center items-start min-h-[25vh] sm:min-h-[30vh] rounded-xl"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b7.jpg')` }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2 uppercase">SEASONAL SALE</h2>
          <h3 className="text-red-500 font-bold text-base sm:text-lg">Winter Collection -50% OFF</h3>
        </div>
        <div 
          className="bg-cover bg-center p-6 sm:p-8 text-white flex flex-col justify-center items-start min-h-[25vh] sm:min-h-[30vh] rounded-xl"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b4.jpg')` }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2 uppercase">NEW FOOTWEAR COLLECTION</h2>
          <h3 className="text-red-500 font-bold text-base sm:text-lg">Spring/Summer 2026</h3>
        </div>
        <div 
          className="bg-cover bg-center p-6 sm:p-8 text-white flex flex-col justify-center items-start min-h-[25vh] sm:min-h-[30vh] rounded-xl sm:col-span-2 lg:col-span-1"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b18.jpg')` }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2 uppercase">T-SHIRTS</h2>
          <h3 className="text-red-500 font-bold text-base sm:text-lg">New Trendy Prints</h3>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
