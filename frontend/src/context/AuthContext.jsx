import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const API_URL = 'https://agripet-connect.onrender.com/api/auth';
  const BASE_URL = 'https://agripet-connect.onrender.com/api';

  const refreshCounts = async (currentToken = token) => {
    if (!currentToken) return;
    try {
      const headers = { 'Authorization': `Bearer ${currentToken}` };
      const [wishRes, cartRes] = await Promise.all([
        fetch(`${BASE_URL}/wishlist`, { headers }),
        fetch(`${BASE_URL}/cart`, { headers })
      ]);
      
      if (wishRes.ok) {
        const wishData = await wishRes.json();
        setWishlistCount(wishData.length);
      }
      
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const totalQty = cartData.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalQty);
      }
    } catch (err) {
      console.error("Error refreshing badge counts:", err);
    }
  };

  // Fetch profile when token changes or on load
  const fetchProfile = async (currentToken) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        await refreshCounts(currentToken);
      } else {
        // Token is invalid/expired
        logout();
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      await fetchProfile(data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, phone, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setWishlistCount(0);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, wishlistCount, cartCount, refreshCounts, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
