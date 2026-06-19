import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Parallax effect: Image starts big (scale 1.3) and shrinks to normal (scale 1) on scroll
    gsap.fromTo(imgRef.current, 
      { scale: 1.15 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Text parallax (moves up slightly on scroll)
    gsap.to(textRef.current, {
      y: -50,
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
      className="relative w-full min-h-[70vh] sm:min-h-[85vh] md:min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-24 pt-28 pb-12 bg-white overflow-hidden"
    >
      <motion.div 
        ref={textRef}
        className="z-10 flex flex-col items-start max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h4 variants={itemVariants} className="text-purple-600 font-bold text-sm sm:text-lg mb-2 tracking-widest uppercase">
          Welcome to Cipher Apparel
        </motion.h4>
        <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-2 leading-tight">
          Elevate Your <br /> Everyday Style
        </motion.h2>
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
          Premium Menswear.
        </motion.h1>
        <motion.p variants={itemVariants} className="text-gray-500 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
          Discover the ultimate e-commerce fashion destination. Shop our latest collection of premium clothing designed for the modern man. Save up to 70% today!
        </motion.p>
        <motion.div variants={itemVariants} className="flex gap-4">
          <Link to="/shop" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all text-sm sm:text-base">
            Shop Collection
          </Link>
          <Link to="/about" className="bg-white text-purple-700 border-2 border-purple-200 px-8 py-4 rounded-full font-bold hover:border-purple-600 hover:bg-purple-50 transition-all text-sm sm:text-base">
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      <div className="z-0 mt-12 md:mt-0 md:w-1/2 flex justify-center items-center relative">
        {/* Decorative backdrop behind image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10"></div>
        
        <div className="overflow-hidden rounded-3xl shadow-2xl relative w-full max-w-[320px] sm:max-w-md md:max-w-lg aspect-[4/5]">
          <motion.img 
            ref={imgRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            src="/hero-new.jpg" 
            alt="Cipher Apparel Menswear" 
            className="w-full h-full object-cover object-top origin-top"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
