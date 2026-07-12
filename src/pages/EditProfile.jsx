import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { MapPin, Navigation, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { location, saveLocation, autoDetectLocation, detectingLocation } = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [locationData, setLocationData] = useState({
    address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: ''
  });
  const [status, setStatus] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [locationMsg, setLocationMsg] = useState('');
  const toast = useToast();

  useEffect(() => {
    document.title = "Edit Profile | Cipher Apparel";
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  // Sync with global location context
  useEffect(() => {
    if (location) {
      setLocationData({
        address_line1: location.address_line1 || '',
        address_line2: location.address_line2 || '',
        city: location.city || '',
        state: location.state || '',
        postal_code: location.postal_code || '',
        country: location.country || '',
      });
    }
  }, [location]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleLocationChange = (e) => {
    setLocationData({ ...locationData, [e.target.name]: e.target.value });
    setLocationStatus('');
  };

  const handleAutoDetect = async () => {
    setLocationStatus('detecting');
    setLocationMsg('Detecting your location...');
    const result = await autoDetectLocation();
    if (result.success) {
      setLocationData(result.location);
      setLocationStatus('');
      toast.success('Location detected! Click "Save Profile" to apply.');
    } else {
      setLocationStatus('');
      toast.error(result.error);
    }
  };

  const handlePincodeBlur = async () => {
    const pincode = locationData.postal_code;
    if (!pincode || pincode.length < 4) return;

    setLocationStatus('detecting');
    setLocationMsg('Looking up postal code...');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&limit=1&accept-language=en`
      );
      const data = await res.json();
      if (data.length > 0) {
        const addr = data[0].address || {};
        setLocationData(prev => ({
          ...prev,
          city: addr.city || addr.town || addr.village || addr.county || addr.state_district || prev.city,
          state: addr.state || prev.state,
          country: addr.country || prev.country || 'India',
        }));
        setLocationStatus('');
        toast.success(`Found: ${addr.city || addr.town || addr.village || ''}, ${addr.state || ''}`);
      } else {
        setLocationStatus('');
      }
    } catch {
      setLocationStatus('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');

    try {
      // 1. Save Profile Data
      const formData = new FormData();
      formData.append('name', profileData.name);
      if (profileData.phone) {
        formData.append('phone', profileData.phone);
      }
      if (profilePic) {
        formData.append('profile_pic', profilePic);
      }
      
      const profileRes = await api.post('/user/', formData);
      
      if (profileRes.data.status === 'success') {
        updateUser(profileRes.data.user);
      }

      // 2. Save location via global context (syncs everywhere including navbar)
      const result = await saveLocation(locationData);
      
      if (result.success && profileRes.data.status === 'success') {
        setStatus('');
        toast.success('Profile saved successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setStatus('');
        toast.error(profileRes.data.error || "Failed to save profile");
      }
    } catch (err) {
      console.error("Profile save error:", err.response?.data || err.message);
      setStatus('');
      toast.error(err.response?.data?.error || err.message || "Failed to save");
    }
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to edit your profile</h2>
          <Link to="/auth" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back button */}
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
        >
          <h1 className="text-2xl font-bold mb-6">Edit Profile & Location</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Name</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input type="email" name="email" value={profileData.email} disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} placeholder="Enter your mobile number" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Location Info */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Delivery Address</h2>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={detectingLocation}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-60"
                >
                  {detectingLocation ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Navigation size={16} />
                  )}
                  {detectingLocation ? 'Detecting...' : 'Auto-detect location'}
                </button>
              </div>

              {/* Location status */}
              {locationStatus === 'detecting' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <Loader2 size={16} className="animate-spin" />
                  {locationMsg}
                </motion.div>
              )}
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input type="text" name="address_line1" value={locationData.address_line1} onChange={handleLocationChange} placeholder="Address Line 1" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div className="sm:col-span-2">
                  <input type="text" name="address_line2" value={locationData.address_line2} onChange={handleLocationChange} placeholder="Address Line 2 (Optional)" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input
                    type="text"
                    name="postal_code"
                    value={locationData.postal_code}
                    onChange={handleLocationChange}
                    onBlur={handlePincodeBlur}
                    placeholder="Postal Code"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                  />
                  <span className="text-xs text-gray-400">Auto-fills city & state</span>
                </div>
                <div>
                  <input type="text" name="city" value={locationData.city} onChange={handleLocationChange} placeholder="City" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="state" value={locationData.state} onChange={handleLocationChange} placeholder="State" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="country" value={locationData.country} onChange={handleLocationChange} placeholder="Country" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'saving'}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {status === 'saving' ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
