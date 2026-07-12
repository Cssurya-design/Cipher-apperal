import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api, { API_BASE } from '../api';



const sortOptions = [
  { key: '', label: 'Default' },
  { key: 'price_low', label: 'Price: Low to High' },
  { key: 'price_high', label: 'Price: High to Low' },
  { key: 'newest', label: 'Newest First' },
  { key: 'rating', label: 'Highest Rated' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState([{ key: '', label: 'All' }]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/');
        const dynamicCats = res.data.categories.map(c => ({ key: c.slug, label: c.name }));
        setCategories([{ key: '', label: 'All' }, ...dynamicCats]);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Shop | Cipher Apparel";
  }, []);

  useEffect(() => {
    // Sync with URL search params
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;
    if (sort) params.sort = sort;

    api.get('/products/', { params })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total || res.data.products.length);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [activeCategory, search, sort]);

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-[30vh] sm:min-h-[40vh] bg-[#1a1a1a] text-white flex flex-col justify-center items-center text-center bg-cover bg-center px-4"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b1.jpg')` }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">#Stay<span className="text-primary">Home</span></h1>
        <p className="text-gray-300 text-sm sm:text-base">Save more with coupons & up to 70% off!</p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Top row: Search + Filter toggle */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 bg-white"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                  {/* Categories */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.key}
                          onClick={() => setActiveCategory(cat.key)}
                          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                            activeCategory === cat.key
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sort by</p>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white w-full sm:w-auto"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Chips */}
          {(activeCategory || sort) && (
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory('')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-primary border border-purple-200 flex items-center gap-1 hover:bg-purple-100 transition-colors"
                >
                  {categories.find(c => c.key === activeCategory)?.label || 'Category'}
                  <X size={12} />
                </button>
              )}
              {sort && (
                <button
                  onClick={() => setSort('')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-primary border border-purple-200 flex items-center gap-1 hover:bg-purple-100 transition-colors"
                >
                  {sortOptions.find(o => o.key === sort)?.label}
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Product count */}
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No products found.</p>
            <button onClick={() => { setSearch(''); setActiveCategory(''); }} className="text-primary font-semibold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
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
