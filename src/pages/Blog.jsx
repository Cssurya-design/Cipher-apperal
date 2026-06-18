import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { API_BASE } from '../api';

const posts = [
  {
    id: 1,
    title: 'The Cotton-Jersey Zip-Up Hoodie',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    date: '13/01',
    image: `${API_BASE}/static/store/images/blog/b1.jpg`,
  },
  {
    id: 2,
    title: 'How to Style a Quiff',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    date: '13/01',
    image: `${API_BASE}/static/store/images/blog/b2.jpg`,
  },
  {
    id: 3,
    title: 'Must-Have Skater Girl Items',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    date: '13/01',
    image: `${API_BASE}/static/store/images/blog/b3.jpg`,
  },
  {
    id: 4,
    title: 'Runway-Inspired Trends',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    date: '13/01',
    image: `${API_BASE}/static/store/images/blog/b4.jpg`,
  },
  {
    id: 5,
    title: 'AW20 Menswear Trends',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    date: '13/01',
    image: `${API_BASE}/static/store/images/blog/b6.jpg`,
  },
  {
    id: 6,
    title: 'Top 10 Casual Outfits for Spring',
    excerpt: 'Discover the best casual wear for the spring season. From lightweight jackets to trendy sneakers, this guide covers all essentials...',
    date: '20/02',
    image: `${API_BASE}/static/store/images/blog/b5.jpg`,
  },
  {
    id: 7,
    title: 'Street Style Essentials for Men',
    excerpt: 'Street style has evolved into a global fashion movement. Learn how to incorporate bold prints, layered looks, and statement accessories...',
    date: '05/03',
    image: `${API_BASE}/static/store/images/blog/b7.jpg`,
  },
  {
    id: 8,
    title: 'How to Build a Capsule Wardrobe',
    excerpt: 'A capsule wardrobe is all about quality over quantity. Learn how to curate a versatile collection that works for every occasion...',
    date: '12/03',
    image: `${API_BASE}/static/store/images/blog/b1.jpg`,
  },
  {
    id: 9,
    title: 'Summer Fashion Lookbook 2026',
    excerpt: 'Get inspired with our summer 2026 lookbook featuring breezy linens, vibrant prints, and the hottest accessories of the season...',
    date: '15/03',
    image: `${API_BASE}/static/store/images/blog/b3.jpg`,
  },
  {
    id: 10,
    title: 'Sustainable Fashion: A Complete Guide',
    excerpt: 'Sustainable fashion is more than a trend — it\'s a movement. Discover eco-friendly brands, upcycling tips, and how to shop responsibly...',
    date: '18/03',
    image: `${API_BASE}/static/store/images/blog/b4.jpg`,
  },
];

const Blog = () => {
  const POSTS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#1a1a1a] text-white py-24 text-center bg-cover bg-center"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b19.jpg')` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">#Read<span className="text-gray-300">More</span></h1>
        <p className="text-gray-300">Read all case studies about our products!</p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="space-y-12">
          {visiblePosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative"
            >
              <div className="w-full md:w-1/2 overflow-hidden rounded-xl">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/hero-new.jpg'; }}
                />
              </div>
              <div className="w-full md:w-1/2 relative">
                <h1 className="absolute -top-16 md:-top-12 -left-4 md:-left-8 text-5xl md:text-7xl font-bold text-gray-100 -z-10">{post.date}</h1>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                <a href="#" className="font-bold text-gray-900 text-sm tracking-wider hover:text-primary transition-colors">CONTINUE READING &rarr;</a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-16">
          {currentPage > 1 && (
            <button 
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold"
            >
              &larr;
            </button>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-primary hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && (
            <button 
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold"
            >
              &rarr;
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
