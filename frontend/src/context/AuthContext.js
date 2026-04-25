'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://slidemind-api-703383698921.us-central1.run.app';
      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://slidemind-api-703383698921.us-central1.run.app';
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await axios.post(`${apiUrl}/api/auth/login`, formData);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    await fetchUser(access_token);
    router.push('/upload');
  };

  const signup = async (email, password, fullName) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://slidemind-api-703383698921.us-central1.run.app';
    await axios.post(`${apiUrl}/api/auth/signup`, {
      email,
      password,
      full_name: fullName
    });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
