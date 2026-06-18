import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const posts = [
  {
    id: 1,
    title: 'The Evolution of Streetwear Fashion',
    excerpt: 'Explore how streetwear went from underground culture to mainstream fashion and what it means for the future of style.',
    date: 'Jun 15, 2026',
    image: '/hero-new.jpg',
  },
  {
    id: 2,
    title: 'Summer 2026 Trends You Need to Know',
    excerpt: 'From bold patterns to minimalist designs, discover the hottest trends that will define this summer season.',
    date: 'Jun 10, 2026',
    image: '/hero-new.jpg',
  },
  {
    id: 3,
    title: 'How to Build a Capsule Wardrobe',
    excerpt: 'Learn the art of creating a versatile wardrobe with fewer pieces that work together perfectly.',
    date: 'Jun 5, 2026',
    image: '/hero-new.jpg',
  },
  {
    id: 4,
    title: 'Sustainable Fashion: Our Commitment',
    excerpt: 'Discover how Cipher Apparel is leading the charge in eco-friendly and sustainable fashion practices.',
    date: 'May 28, 2026',
    image: '/hero-new.jpg',
  },
];

const Blog = () => {
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary-dark/10 py-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">#ReadMore</h1>
        <p className="text-gray-600">Read all case studies about our products!</p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow"
            >
              <div className="overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">{post.date}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
