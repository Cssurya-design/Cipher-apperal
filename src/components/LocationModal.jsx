import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Loader2, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

const LocationModal = () => {
  const { user } = useAuth();
  const {
    location,
    showLocationModal,
    setShowLocationModal,
    saveLocation,
    autoDetectLocation,
    detectingLocation,
    loading,
  } = useLocation();

  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState(''); // '', 'detecting', 'success', 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [view, setView] = useState('quick'); // 'quick' or 'full'

  // Pre-fill form if location exists
  useEffect(() => {
    if (location) {
      setFormData({
        address_line1: location.address_line1 || '',
        address_line2: location.address_line2 || '',
        city: location.city || '',
        state: location.state || '',
        postal_code: location.postal_code || '',
        country: location.country || 'India',
      });
      setPincode(location.postal_code || '');
    }
  }, [location, showLocationModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus('');
  };

  const handleAutoDetect = async () => {
    setStatus('detecting');
    setStatusMsg('Detecting your location...');
    const result = await autoDetectLocation();
    if (result.success) {
      setFormData(result.location);
      setPincode(result.location.postal_code || '');
      setStatus('success');
      setStatusMsg('Location detected successfully!');
      // Auto-save after detecting
      setTimeout(async () => {
        await saveLocation(result.location);
        setStatus('');
      }, 1000);
    } else {
      setStatus('error');
      setStatusMsg(result.error);
    }
  };

  const handlePincodeSearch = async () => {
    if (!pincode || pincode.length < 4) {
      setStatus('error');
      setStatusMsg('Please enter a valid postal code');
      return;
    }
    setStatus('detecting');
    setStatusMsg('Looking up postal code...');
    try {
      // Use Nominatim for pincode lookup
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&limit=1&accept-language=en`
      );
      const data = await res.json();
      if (data.length > 0) {
        const addr = data[0].address || {};
        const detected = {
          address_line1: '',
          address_line2: '',
          city: addr.city || addr.town || addr.village || addr.county || addr.state_district || '',
          state: addr.state || '',
          postal_code: pincode,
          country: addr.country || 'India',
        };
        setFormData(detected);
        setStatus('success');
        setStatusMsg(`Found: ${detected.city}, ${detected.state}`);
      } else {
        setStatus('error');
        setStatusMsg('Could not find location for this postal code. Please enter details manually.');
        setView('full');
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg('Lookup failed. Please enter manually.');
      setView('full');
    }
  };

  const handleSave = async () => {
    if (!formData.city && !formData.postal_code) {
      setStatus('error');
      setStatusMsg('Please enter at least a city or postal code');
      return;
    }
    setStatus('detecting');
    setStatusMsg('Saving...');
    const result = await saveLocation(formData);
    if (result.success) {
      setStatus('success');
      setStatusMsg('Location saved!');
      setTimeout(() => {
        setShowLocationModal(false);
        setStatus('');
      }, 800);
    } else {
      setStatus('error');
      setStatusMsg('Failed to save location');
    }
  };

  if (!showLocationModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[100] flex items-start justify-center pt-20 sm:pt-24 px-4"
        onClick={() => setShowLocationModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: -20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: -20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="text-white" size={22} />
              <h2 className="text-white font-bold text-lg">Choose your location</h2>
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6">
            {/* Login prompt for guests */}
            {!user && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800 flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Sign in to save your location for a personalized experience across sessions.</span>
              </div>
            )}

            {/* Auto-detect button */}
            <button
              onClick={handleAutoDetect}
              disabled={detectingLocation}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-60 mb-4 shadow-sm"
            >
              {detectingLocation ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Navigation size={18} />
              )}
              {detectingLocation ? 'Detecting...' : 'Use my current location'}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium uppercase">or enter manually</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Quick pincode search */}
            {view === 'quick' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setStatus('');
                    }}
                    placeholder="Enter pincode / postal code"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    maxLength={6}
                  />
                  <button
                    onClick={handlePincodeSearch}
                    className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    <Search size={18} />
                  </button>
                </div>

                <button
                  onClick={() => setView('full')}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Enter full address instead →
                </button>
              </div>
            )}

            {/* Full address form */}
            {view === 'full' && (
              <div className="space-y-3">
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  placeholder="Address Line 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  placeholder="Address Line 2 (Optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City *"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State *"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>

                <button
                  onClick={() => setView('quick')}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  ← Back to pincode search
                </button>
              </div>
            )}

            {/* Status message */}
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm flex items-center gap-2 ${
                  status === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : status === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {status === 'success' && <CheckCircle2 size={16} />}
                {status === 'error' && <AlertCircle size={16} />}
                {status === 'detecting' && <Loader2 size={16} className="animate-spin" />}
                {statusMsg}
              </motion.div>
            )}

            {/* Apply / Save button */}
            <button
              onClick={handleSave}
              disabled={loading || (!formData.city && !formData.postal_code)}
              className="w-full mt-4 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Apply'}
            </button>

            {/* Current location display */}
            {location && location.city && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current delivery location</p>
                <p className="text-sm font-medium text-gray-700">
                  {location.city}{location.state ? `, ${location.state}` : ''} {location.postal_code || ''}
                </p>
                {location.address_line1 && (
                  <p className="text-xs text-gray-500 mt-0.5">{location.address_line1}</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationModal;
