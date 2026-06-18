import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api, { API_BASE } from '../api';

const categories = [
  { key: '', label: 'All' },
  { key: 'Shirts', label: 'Shirts' },
  { key: 'T-Shirts', label: 'T-Shirts' },
  { key: 'Pants', label: 'Pants' },
  { key: 'Shorts', label: 'Shorts' },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;

    api.get('/products/', { params })
      .then(res => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [activeCategory, search]);

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-[40vh] bg-[#1a1a1a] text-white flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b1.jpg')` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">#Stay<span className="text-gray-300">Home</span></h1>
        <p className="text-gray-300">Save more with coupons & up to 70% off!</p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-md text-sm font-semibold border transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-900 border-[#cce7d0] hover:bg-[#088178] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-2.5 rounded-md border border-[#cce7d0] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-72 text-sm text-gray-900"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
