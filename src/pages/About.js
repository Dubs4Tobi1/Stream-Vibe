import React from 'react';
import './About.css';

const members = [
  { id: 1, surname: 'Umah', otherNames: 'Justice Ugochukwu', matric: 'LCU/UG/24/30299' },
  { id: 2, surname: 'Atipo', otherNames: 'Amazinggrace Ayomide', matric: 'LCU/UG/24/29304' },
  { id: 3, surname: 'Kalejaiye', otherNames: 'Oluwatumininu Ayomikun', matric: 'LCU/UG/24/32204' },
  { id: 4, surname: 'Kassim-Ashiru', otherNames: 'Kassim Olansile', matric: 'LCU/UG/25/39600' },
  { id: 5, surname: 'Femi-Asoro', otherNames: 'Oluwatobiloba David', matric: 'LCU/UG/24/34240' },
  { id: 6, surname: 'Tijani', otherNames: 'Farouq', matric: 'LCU/UG/24/32846' },
  { id: 7, surname: 'Chris', otherNames: 'Samuel Osahon', matric: 'LCU/UG/24/31903' },
  { id: 8, surname: 'Moka', otherNames: 'Chibuikem Derick', matric: 'LCU/UG/24/31974' },
  { id: 9, surname: 'Akinsanya', otherNames: 'Emmanuel Iseoluwa', matric: 'LCU/UG/24/30425' },
  { id: 10, surname: 'Sanni', otherNames: 'Wisdom Arome', matric: 'LCU/UG/24/29436' },
  { id: 11, surname: 'Ugwuegbu', otherNames: 'Harmony Johnson', matric: 'LCU/UG/24/30322' },
  { id: 12, surname: 'Anyanwu', otherNames: 'Lincoln Chinwudo', matric: 'LCU/UG/24/32881' },
  { id: 13, surname: 'Tikare', otherNames: 'Ridwan Adeola', matric: 'LCU/UG/25/38690' },
  { id: 14, surname: 'Omoriba', otherNames: 'Oluwafeyisanmi Paul', matric: 'LCU/UG/24/31710' },
  { id: 15, surname: 'Ayodele', otherNames: 'Olanrewaju James', matric: 'LCU/UG/24/33599' },
];

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
      <p>StreamVibe is a streaming platform made by group L. It demonstrates modern React development including hooks, context, routing, and responsive design.</p>
      <div className="about-stack">
        {['React 18', 'React Router 6', 'localStorage', 'CSS Variables', 'Responsive Design'].map(t => (
          <span key={t} className="badge badge-green">{t}</span>
        ))}
      </div>
    </div>

    <div className="about-team" style={{ marginTop: '48px' }}>
      <h2>Group L Members</h2>
      <p>The team behind StreamVibe — Software Engineering, Leadcity University.</p>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '0.5px solid #e0e0e0', marginTop: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['#', 'Surname', 'Other names', 'Matric number', 'Department'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', borderBottom: '0.5px solid #e0e0e0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} style={{ borderBottom: '0.5px solid #e0e0e0' }}>
                <td style={{ padding: '10px 14px', color: '#222' }}>{m.id}</td>
                <td style={{ padding: '10px 14px', color: '#222', fontWeight: 500 }}>{m.surname}</td>
                <td style={{ padding: '10px 14px', color: '#222' }}>{m.otherNames}</td>
                <td style={{ padding: '10px 14px', color: '#666', fontFamily: 'monospace', fontSize: '12px' }}>{m.matric}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: '#e8f0fe', color: '#1a56db' }}>Software Eng.</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
);

export default About;
