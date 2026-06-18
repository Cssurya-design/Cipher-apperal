import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { API_BASE } from '../api';

const features = [
  { img: 'f1.png', label: 'Free Shipping' },
  { img: 'f2.png', label: 'Online Order' },
  { img: 'f3.png', label: 'Save Money' },
  { img: 'f4.png', label: 'Promotions' },
  { img: 'f5.png', label: 'Happy Sell' },
  { img: 'f6.png', label: '24/7 Support' },
];

const About = () => {
  useEffect(() => {
    document.title = "About Us | Cipher Apparel";
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-[40vh] bg-[#1a1a1a] text-white flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/about/banner.png')` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">#About<span className="text-gray-300">Us</span></h1>
        <p className="text-gray-300">Read all case studies about our products!</p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        
        {/* About Head */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <img 
              src={`${API_BASE}/static/store/images/about/a6.jpg`} 
              alt="Who We Are" 
              className="w-full h-auto object-cover rounded-none"
              onError={(e) => { e.target.src = '/hero-new.jpg'; }}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Who We Are?</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-justify">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla corrupti deserunt, dolor sed hic sint repellat excepturi iure mollitia accusantium corporis quisquam. Reiciendis, voluptates voluptatibus. Eveniet doloremque ducimus error aliquid commodi dolores molestias totam.
            </p>
            <abbr title="" className="block text-gray-800 font-semibold mb-6 decoration-transparent">
              Create stunning images with as much or as little control as you like thanks to a choice of Basic and Creative modes.
            </abbr>
            
            <div className="bg-gray-200 py-2 overflow-hidden">
              <marquee className="text-gray-700 font-medium">Create stunning images with as much or as little control as you like thanks to a choice of Basic and Creative modes.</marquee>
            </div>
          </motion.div>
        </div>

        {/* About App */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Download Our <a href="#" className="text-primary hover:underline">App</a></h1>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white"
          >
            <video 
              autoPlay 
              muted 
              loop 
              src={`${API_BASE}/static/store/images/about/1.mp4`}
              className="w-full h-auto block"
            />
          </motion.div>
        </div>

        {/* Features */}
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

      </div>

      <Footer />
    </div>
  );
};

export default About;
