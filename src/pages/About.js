import React from 'react';
import './About.css';

const About = () => (
  <div className="about-page fade-in">
    <div className="about-hero">
      <h1 className="about-title">About <span>StreamVibe</span></h1>
      <p className="about-lead">A next-generation video platform built for creators, by creators.</p>
    </div>
    <div className="about-grid">
      {[
        { icon: '🎬', title: 'Our Mission', body: 'To empower creators of all kinds with a platform that is modern, fast, and free. We believe everyone has a story worth sharing.' },
        { icon: '🌍', title: 'Our Vision', body: 'A world where creativity knows no barriers. StreamVibe connects creators with audiences globally, without gatekeeping.' },
        { icon: '🔒', title: 'Privacy First', body: 'Your data stays with you. We never sell your information to advertisers. StreamVibe is built with privacy as a core principle.' },
        { icon: '⚡', title: 'Built for Speed', body: 'Optimized for performance from day one. Fast uploads, smooth playback, and a lightning-fast interface on any device.' },
      ].map(card => (
        <div key={card.title} className="about-card">
          <span className="about-card-icon">{card.icon}</span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </div>
      ))}
    </div>
    <div className="about-team">
      <h2>University Group Project</h2>
      <p>StreamVibe was built as a final-year university group project. It demonstrates modern React development including hooks, context, routing, localStorage, and responsive design.</p>
      <div className="about-stack">
        {['React 18', 'React Router 6', 'localStorage', 'CSS Variables', 'Responsive Design'].map(t => (
          <span key={t} className="badge badge-green">{t}</span>
        ))}
      </div>
    </div>
  </div>
);

export default About;
