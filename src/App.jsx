import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'
import Navbar from './components/Navbar'
import LocationModal from './components/LocationModal'
import ScrollToTop from './components/ScrollToTop'
import ToastProvider from './components/Toast'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import About from './pages/About'
import Blog from './pages/Blog'
import Auth from './pages/Auth'
import Wishlist from './pages/Wishlist'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminDashboard from './pages/AdminDashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import OrderTracking from './pages/OrderTracking'

import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '325983759714-rdm0tqf2t53i8p7r91iug06eut1v2jro.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <LocationProvider>
              <ToastProvider>
              <div className="font-inter">
                <Navbar />
                <LocationModal />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/orders/:id" element={<OrderTracking />} />
                </Routes>
              </main>
              </div>
              </ToastProvider>
            </LocationProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
