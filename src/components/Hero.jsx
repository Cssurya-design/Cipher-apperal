import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Parallax effect on image scroll
    gsap.to(imgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section 
      ref={heroRef} 
      className="relative w-full min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-24 pb-12 bg-gradient-to-br from-[#f8f9fc] to-[#e0eafc] overflow-hidden"
    >
      <motion.div 
        className="z-10 flex flex-col items-start max-w-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h4 variants={itemVariants} className="text-gray-600 font-semibold text-lg mb-2">Trade-in-offer</motion.h4>
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Super value deals</motion.h2>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark mb-4">
          On all products
        </motion.h1>
        <motion.p variants={itemVariants} className="text-gray-500 text-lg mb-8">
          Save more with coupons & up to 70% off!
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to="/shop" className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
            Shop Now
          </Link>
        </motion.div>
      </motion.div>

      <div className="z-0 mt-12 md:mt-0 md:w-1/2 flex justify-center items-center">
        <motion.img 
          ref={imgRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          src="/hero-new.jpg" 
          alt="Hero" 
          className="w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
