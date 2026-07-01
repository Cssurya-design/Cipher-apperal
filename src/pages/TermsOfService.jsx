import React, { useEffect } from 'react';
import Footer from '../components/Footer';

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service | Cipher Apparel";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-16 sm:mt-20 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">1. Acceptance of Terms</h2>
            <p>By accessing and placing an order with Cipher Apparel, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Cipher Apparel.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">2. Products and Pricing</h2>
            <p>All products listed on the website, their descriptions, and their prices are subject to change. Cipher Apparel reserves the right, at any time, to modify, suspend, or discontinue the sale of any product with or without notice. In the event a product is listed at an incorrect price or with incorrect information due to typographical error, we shall have the right to refuse or cancel any orders placed for the product listed at the incorrect price.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">3. Shipping and Delivery</h2>
            <p>Cipher Apparel will ship the products to the address provided by the user during the checkout process. We make every effort to deliver your order within the estimated timeframe. However, delays are occasionally inevitable due to unforeseen factors. Cipher Apparel shall be under no liability for any delay or failure to deliver the products within estimated timescales.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">4. Returns and Refunds</h2>
            <p>If you are not entirely satisfied with your purchase, we're here to help. You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging and needs to have the receipt or proof of purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">5. Intellectual Property</h2>
            <p>The website and its original content, features, and functionality are owned by Cipher Apparel and are protected by international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">6. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us via our Contact page or directly at support@cipherapparel.com.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
