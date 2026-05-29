// ============================================
// StreamVibe – Sidebar Component
// ============================================
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: 'Home', exact: true },
  { to: '/trending', icon: '🔥', label: 'Trending' },
  { to: '/saved', icon: '🔖', label: 'Saved', auth: true },
  { to: '/history', icon: '🕐', label: 'History', auth: true },
  { to: '/subscriptions', icon: '📡', label: 'Subscriptions', auth: true },
];

const MORE_ITEMS = [
  { to: '/about', icon: 'ℹ️', label: 'About' },
  { to: '/contact', icon: '✉️', label: 'Contact' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthRequired = (to) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(to);
    }
    if (window.innerWidth < 900) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            {NAV_ITEMS.map(item => (
              item.auth ? (
                <button
                  key={item.to}
                  className="sidebar-link sidebar-btn"
                  onClick={() => handleAuthRequired(item.to)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => window.innerWidth < 900 && onClose()}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </NavLink>
              )
            ))}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <p className="sidebar-section-title">More</p>
            {MORE_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 900 && onClose()}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {!user && (
            <>
              <div className="sidebar-divider" />
              <div className="sidebar-cta">
                <p>Sign in to save videos and subscribe to channels</p>
                <NavLink to="/login" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign In
                </NavLink>
              </div>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 StreamVibe</p>
          <p>University Group Project</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
