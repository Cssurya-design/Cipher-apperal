import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/token/', { email, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (name, email, password, profilePic) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePic) {
      formData.append('profile_pic', profilePic);
    }
    const res = await api.post('/signup/', formData);
    return res.data;
  };

  const googleLogin = async (credential) => {
    const res = await api.post('/auth/google/', { credential });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    
    let userData = res.data.user;
    
    if (userData.profile_pic && userData.profile_pic.startsWith('http') && !userData.profile_pic.includes('cipherapparel')) {
      try {
        const imgRes = await fetch(userData.profile_pic);
        const blob = await imgRes.blob();
        const file = new File([blob], 'google_pic.jpg', { type: blob.type });
        const formData = new FormData();
        formData.append('profile_pic', file);
        await api.post('/user/', formData);
        
        const updatedRes = await api.get('/user/');
        userData = updatedRes.data;
      } catch (e) {
        console.error("Failed to upload Google pic from frontend", e);
      }
    }
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_location');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
