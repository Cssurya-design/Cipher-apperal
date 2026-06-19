import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('user_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Fetch saved location from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchLocation();
    } else {
      // Keep localStorage location for guest users display, but clear backend data
      const saved = localStorage.getItem('user_location');
      if (saved) {
        setLocation(JSON.parse(saved));
      }
    }
  }, [user]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const res = await api.get('/location/');
      if (res.data && res.data.city) {
        const loc = {
          address_line1: res.data.address_line1 || '',
          address_line2: res.data.address_line2 || '',
          city: res.data.city || '',
          state: res.data.state || '',
          postal_code: res.data.postal_code || '',
          country: res.data.country || '',
        };
        setLocation(loc);
        localStorage.setItem('user_location', JSON.stringify(loc));
      }
    } catch (err) {
      console.error('Failed to fetch location:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (locationData) => {
    try {
      setLoading(true);
      if (user) {
        await api.post('/location/', locationData);
      }
      setLocation(locationData);
      localStorage.setItem('user_location', JSON.stringify(locationData));
      setShowLocationModal(false);
      return { success: true };
    } catch (err) {
      console.error('Failed to save location:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const autoDetectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      return { success: false, error: 'Geolocation is not supported by your browser' };
    }

    setDetectingLocation(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );
            const data = await res.json();

            const detectedLocation = {
              address_line1: data.display_name ? data.display_name.split(',').slice(0, 2).join(',').trim() : '',
              address_line2: '',
              city: data.address?.city || data.address?.town || data.address?.village || data.address?.county || '',
              state: data.address?.state || '',
              postal_code: data.address?.postcode || '',
              country: data.address?.country || '',
            };

            setDetectingLocation(false);
            resolve({ success: true, location: detectedLocation });
          } catch (err) {
            console.error('Geocoding failed:', err);
            setDetectingLocation(false);
            resolve({ success: false, error: 'Failed to detect your location. Please enter manually.' });
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setDetectingLocation(false);
          let errorMsg = 'Unable to retrieve your location.';
          if (err.code === 1) errorMsg = 'Location access denied. Please enable location permission in your browser settings.';
          if (err.code === 2) errorMsg = 'Location unavailable. Please try again or enter manually.';
          if (err.code === 3) errorMsg = 'Location request timed out. Please try again.';
          resolve({ success: false, error: errorMsg });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem('user_location');
  };

  const displayLocation = location
    ? location.city
      ? `${location.city}${location.postal_code ? ' ' + location.postal_code : ''}`
      : location.state || location.country || 'Location set'
    : null;

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        detectingLocation,
        showLocationModal,
        setShowLocationModal,
        displayLocation,
        fetchLocation,
        saveLocation,
        autoDetectLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
