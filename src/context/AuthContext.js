// ============================================
// StreamVibe – Auth Context
// ============================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, saveCurrentUser, clearCurrentUser, loginUser, registerUser } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = loginUser(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = (userData) => {
    const result = registerUser(userData);
    if (result.success) {
      saveCurrentUser(result.user);
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  const refreshUser = () => {
    const saved = getCurrentUser();
    if (saved) setUser(saved);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
