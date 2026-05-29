import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 20 }}>
    <div style={{ fontSize: 80 }}>📺</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>404</h1>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', maxWidth: 360 }}>Looks like this page went offline. Let's get you back to the good stuff.</p>
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      <Link to="/" className="btn btn-primary">Go Home</Link>
      <Link to="/trending" className="btn btn-ghost">Browse Trending</Link>
    </div>
  </div>
);

export default NotFound;
