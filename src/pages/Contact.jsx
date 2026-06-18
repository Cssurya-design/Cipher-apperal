import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import api from '../api';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
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
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 md:px-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">#let's_talk</h1>
          <p className="text-lg text-gray-600">LEAVE A MESSAGE, We love to hear from you!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-2">GET IN TOUCH</h2>
            <p className="text-gray-600 mb-8">Visit one of our agency locations or contact us today</p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Head Office</h3>
                  <p className="text-gray-600">56 Glassford Street Glasgow G1 1UL New York</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-primary" />
                <p className="text-gray-600">contact@cipherapparel.com</p>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-primary" />
                <p className="text-gray-600">contact@cipherapparel.com</p>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="text-primary" />
                <p className="text-gray-600">Monday to Saturday: 9.00am to 16.pm</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Leave A Message</h2>
              
              <div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message" 
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Submit'}
              </button>
              
              {status === 'success' && <p className="text-green-500 mt-2 font-medium">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-500 mt-2 font-medium">Something went wrong. Try again.</p>}
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
