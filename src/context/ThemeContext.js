// ============================================
// StreamVibe – Theme Context
// ============================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { lsGet, lsSet, KEYS } from '../utils/storage';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => lsGet(KEYS.THEME, 'dark'));

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    lsSet(KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
