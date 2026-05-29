// ============================================
// StreamVibe – Navbar Component
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Pre-fill search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [location.search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="nav-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">Stream<span className="logo-accent">Vibe</span></span>
        </Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search videos, channels..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search"
        />
        <button type="submit" className="search-btn" aria-label="Submit search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>

      <div className="navbar-right">
        <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <Link to="/upload" className="btn btn-primary btn-sm nav-upload-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Upload</span>
            </Link>

            <div className="user-menu" ref={dropdownRef}>
              <button className="user-avatar-btn" onClick={() => setDropdownOpen(o => !o)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-username">@{user.username}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>👤</span> My Profile
                  </Link>
                  <Link to="/upload" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>📤</span> Upload Video
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>⚙️</span> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="nav-auth-btns">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
