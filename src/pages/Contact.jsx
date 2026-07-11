import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { API_BASE } from '../api';
import Footer from '../components/Footer';

const Contact = () => {
  useEffect(() => {
    document.title = "Contact | Cipher Apparel";
  }, []);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact/', formData);
      setStatus('success');
      setFormData({ full_name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-[40vh] bg-[#1a1a1a] text-white flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url('${API_BASE}/static/store/images/about/banner.png')` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">#Let's_<span className="text-primary">Talk</span></h1>
        <p className="text-gray-300">LEAVE A MESSAGE,We love to hear from you!</p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        
        {status === 'success' && (
          <div className="bg-[#d4edda] text-[#155724] p-4 mb-8 rounded text-center font-semibold">
            Message sent successfully!
          </div>
        )}
        
        {status === 'error' && (
          <div className="bg-[#f8d7da] text-[#721c24] p-4 mb-8 rounded text-center font-semibold">
            Failed to send message. Please try again.
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div className="w-full lg:w-1/2">
            <span className="text-sm font-semibold tracking-wider text-gray-500 block mb-2">GET IN TOUCH</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit one of our agency locations or contact us today</h2>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Head Office</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <i className="fa-solid fa-map mt-1 text-gray-600"></i>
                <p className="text-gray-600">275, Sampath St, Rathinapuri, Tatabad, Coimbatore, Tamil Nadu 641027</p>
              </li>
              <li className="flex items-center gap-4">
                <i className="fa-solid fa-envelope text-gray-600"></i>
                <p className="text-gray-600">contact@example.com</p>
              </li>
              <li className="flex items-center gap-4">
                <i className="fa-solid fa-phone text-gray-600"></i>
                <p className="text-gray-600">(+91) 2254 3658 /(+91) 01 2345 6789</p>
              </li>
              <li className="flex items-center gap-4">
                <i className="fa-solid fa-clock text-gray-600"></i>
                <p className="text-gray-600">Monday to Saturday: 10:00 AM - 16:00 PM</p>
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-1/2 h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.1586990240926!2d76.95968577387424!3d11.026717354529532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba858f7bae42e6d%3A0x3508457d2e84a95a!2s275%2C%20Sampath%20St%2C%20Rathinapuri%2C%20Tatabad%2C%20Coimbatore%2C%20Tamil%20Nadu%20641027!5e0!3m2!1sen!2sin!4v1773558070970!5m2!1sen!2sin" 
              className="w-full h-full rounded border-0" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 border border-gray-200 p-8 rounded">
          <div className="w-full lg:w-2/3">
            <span className="text-sm font-semibold tracking-wider text-gray-500 block mb-2">LEAVE A MESSAGE</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">We love to hear from you</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Your Name" required className="p-3 border border-gray-300 rounded focus:outline-none focus:border-primary" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your E-mail" required className="p-3 border border-gray-300 rounded focus:outline-none focus:border-primary" />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="p-3 border border-gray-300 rounded focus:outline-none focus:border-primary" />
              <textarea name="message" value={formData.message} onChange={handleChange} cols="30" rows="6" placeholder="Your Message" required className="p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"></textarea>
              <button type="submit" className="w-max bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-opacity-90 transition-all">Submit</button>
            </form>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="flex gap-4 items-start">
              <img src={`${API_BASE}/static/store/images/people/1.png`} alt="" className="w-16 h-16 object-cover" />
              <div>
                <p className="text-gray-600 m-0"><span className="font-bold text-gray-900 block text-lg">John Doe</span> Senior Marketing Manager <br /> Phone: + 000 123 000 77 88 <br /> Email-id: contact@example.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <img src={`${API_BASE}/static/store/images/people/2.png`} alt="" className="w-16 h-16 object-cover" />
              <div>
                <p className="text-gray-600 m-0"><span className="font-bold text-gray-900 block text-lg">William Smith</span> Senior Marketing Manager <br /> Phone: + 000 123 000 77 88 <br /> Email-id: contact@example.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <img src={`${API_BASE}/static/store/images/people/3.png`} alt="" className="w-16 h-16 object-cover" />
              <div>
                <p className="text-gray-600 m-0"><span className="font-bold text-gray-900 block text-lg">Emma Stone</span> Senior Marketing Manager <br /> Phone: + 000 123 000 77 88 <br /> Email-id: contact@example.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Contact;
