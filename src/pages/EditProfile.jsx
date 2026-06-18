import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin } from 'lucide-react';
import api from '../api';
import Footer from '../components/Footer';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [locationData, setLocationData] = useState({
    address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: ''
  });
  const [status, setStatus] = useState('');
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' });
      api.get('/location/')
        .then(res => {
          if (res.data.city) {
            setLocationData(res.data);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleLocationChange = (e) => setLocationData({ ...locationData, [e.target.name]: e.target.value });

  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        setLocationData(prev => ({
          ...prev,
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          country: data.address.country || '',
          postal_code: data.address.postcode || ''
        }));
      } catch (err) {
        console.error("Geocoding failed", err);
      } finally {
        setLoadingLoc(false);
      }
    }, () => {
      alert("Unable to retrieve your location");
      setLoadingLoc(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      // In a real app we'd also update the user's name via an /api/user/ PUT endpoint, 
      // but the Django views_api.py doesn't have a PUT for user right now, so we just save location.
      await api.post('/location/', locationData);
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (!user) {
    return <div className="pt-24 text-center">Please login</div>;
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h1 className="text-2xl font-bold mb-6">Edit Profile & Location</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Name</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50" />
                  <span className="text-xs text-gray-400">Name editing requires backend support</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input type="email" name="email" value={profileData.email} disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Location Info */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Delivery Address</h2>
                <button type="button" onClick={autoDetectLocation} disabled={loadingLoc} className="text-primary flex items-center gap-1 text-sm font-semibold hover:underline">
                  <MapPin size={16} /> {loadingLoc ? 'Detecting...' : 'Auto-detect'}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input type="text" name="address_line1" value={locationData.address_line1} onChange={handleLocationChange} placeholder="Address Line 1" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <input type="text" name="address_line2" value={locationData.address_line2} onChange={handleLocationChange} placeholder="Address Line 2 (Optional)" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="city" value={locationData.city} onChange={handleLocationChange} placeholder="City" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="state" value={locationData.state} onChange={handleLocationChange} placeholder="State" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="postal_code" value={locationData.postal_code} onChange={handleLocationChange} placeholder="Postal Code" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="country" value={locationData.country} onChange={handleLocationChange} placeholder="Country" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'saving'}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {status === 'saving' ? 'Saving...' : 'Save Profile'}
            </button>

            {status === 'success' && <p className="text-green-500 text-center font-medium mt-2">Saved successfully!</p>}
            {status === 'error' && <p className="text-red-500 text-center font-medium mt-2">Failed to save</p>}
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
