import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary-dark/10 py-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">#KnowUs</h1>
        <p className="text-gray-600">Learn more about Cipher Apparel</p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cipher Apparel is a premium fashion brand committed to delivering quality, style, and comfort. 
              We believe that fashion is more than just clothing – it's a form of self-expression.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our collections are designed for the modern individual who values both aesthetics and functionality. 
              From casual wear to formal attire, we have something for every occasion.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="/hero-new.jpg" alt="About" className="rounded-2xl shadow-lg w-full" />
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {[
            { num: '500+', label: 'Products' },
            { num: '10K+', label: 'Happy Customers' },
            { num: '50+', label: 'Awards Won' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.num}</h3>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
