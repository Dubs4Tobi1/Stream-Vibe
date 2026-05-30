// ============================================
// StreamVibe – Footer Component
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">▶</span>
            <span>Stream<span>Vibe</span></span>
          </Link>
          <p className="footer-tagline">The next generation video platform. Built for creators, powered by community.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/upload">Upload</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 StreamVibe.  Group L. Built with React.</p>
        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
