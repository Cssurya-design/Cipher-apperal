import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
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
    api.get('/featured/')
      .then(res => setFeatured(res.data.featured))
      .catch(err => console.error("Error fetching featured products", err));
  }, []);

  return (
    <div className="w-full">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl py-6 px-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <img 
                src={`${API_BASE}/static/store/images/features/${feature.img}`} 
                alt={feature.label}
                className="mx-auto h-24 mb-3"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h6 className="text-sm font-bold w-max mx-auto px-2 py-1 bg-pink-50 text-[#088178] rounded">
                {feature.label}
              </h6>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-gray-800 mb-2"
        >
          Featured Products
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-12"
        >
          Summer Collection New Modern Design
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        className="py-24 text-center bg-cover bg-center text-white my-12"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b2.jpg')` }}
      >
        <h4 className="text-2xl font-semibold mb-4">Repair Services</h4>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Up to <span className="text-red-500">70% off</span> All t-shirts and accessories</h2>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-bold hover:bg-primary hover:text-white transition-colors">
          Explore more
        </button>
      </section>

      {/* New Arrivals (Using same products for demo as django api doesn't have separate endpoint) */}
      <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-gray-800 mb-2"
        >
          New Arrivals
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-12"
        >
          Summer Collection New Modern Design
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="px-6 py-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        <div 
          className="bg-cover bg-center p-12 text-white flex flex-col justify-center items-start min-h-[50vh]"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b17.jpg')` }}
        >
          <h4 className="text-xl font-light mb-2">crazy deals</h4>
          <h2 className="text-3xl font-bold mb-4">buy 1 get 1 free</h2>
          <span className="text-sm font-medium mb-6">The best classic dress is on sale at cipher apparel</span>
          <button className="border border-white px-6 py-2 hover:bg-primary hover:border-primary transition-colors">Learn More</button>
        </div>
        <div 
          className="bg-cover bg-center p-12 text-white flex flex-col justify-center items-start min-h-[50vh]"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b10.jpg')` }}
        >
          <h4 className="text-xl font-light mb-2">spring/summer</h4>
          <h2 className="text-3xl font-bold mb-4">upcoming season</h2>
          <span className="text-sm font-medium mb-6">The best classic dress is on sale at cipher apparel</span>
          <button className="border border-white px-6 py-2 hover:bg-primary hover:border-primary transition-colors">Learn More</button>
        </div>
      </section>

      {/* Bottom 3 Banners */}
      <section className="px-6 pb-16 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        <div 
          className="bg-cover bg-center p-8 text-white flex flex-col justify-center min-h-[30vh]"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b7.jpg')` }}
        >
          <h2 className="text-2xl font-bold mb-2 uppercase">SEASONAL SALE</h2>
          <h3 className="text-red-500 font-bold">Winter Collection -50% OFF</h3>
        </div>
        <div 
          className="bg-cover bg-center p-8 text-white flex flex-col justify-center min-h-[30vh]"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b4.jpg')` }}
        >
          <h2 className="text-2xl font-bold mb-2 uppercase">NEW FOOTWEAR COLLECTION</h2>
          <h3 className="text-red-500 font-bold">Spring/Summer 2026</h3>
        </div>
        <div 
          className="bg-cover bg-center p-8 text-white flex flex-col justify-center min-h-[30vh]"
          style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b18.jpg')` }}
        >
          <h2 className="text-2xl font-bold mb-2 uppercase">T-SHIRTS</h2>
          <h3 className="text-red-500 font-bold">New Trendy Prints</h3>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
