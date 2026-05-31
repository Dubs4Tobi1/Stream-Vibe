import React from 'react';
import './About.css';

const About = () => {
  const groupMembers = [
    { surname: 'Umah', otherNames: 'Justice ugochukwu', matric: 'LCU/UG/24/30299', department: 'Software Engineering' },
    { surname: 'Atipo', otherNames: 'Amazinggrace Ayomide', matric: 'Lcu/Ug/24/29304', department: 'Software Engineering' },
    { surname: 'Kalejaiye', otherNames: 'Oluwatumininu Ayomikun', matric: 'LCU/UG/24/32204', department: 'Software Engineering' },
    { surname: 'Kassim-Ashiru', otherNames: 'Kassim Olansile', matric: 'LCU/UG/25/39600', department: 'Software Engineering' },
    { surname: 'Femi-Asoro', otherNames: 'Oluwatobiloba David', matric: 'lcu/ug/24/34240', department: 'Software Engineering' },
    { surname: 'Tijani', otherNames: 'Farouq', matric: 'LCU/UG/24/32846', department: 'Software Engineering' },
    { surname: 'Chris', otherNames: 'Samuel Osahon', matric: 'LCU/UG/24/31903', department: 'Software Engineering' },
    { surname: 'Moka', otherNames: 'Chibuikem Derick', matric: 'LCU/UG/24/31974', department: 'Software Engineering' },
    { surname: 'Akinsanya', otherNames: 'Emmanuel Iseoluwa', matric: 'LCU/UG/24/30425', department: 'Software Engineering' },
    { surname: 'Sanni', otherNames: 'Wisdom Arome', matric: 'LCU/UG/24/29436', department: 'Software Engineering' },
    { surname: 'Ugwuegbu', otherNames: 'Harmony Johnson', matric: 'LCU/UG/24/30322', department: 'Software Engineering' },
    { surname: 'Anyanwu', otherNames: 'Lincoln Chinwudo', matric: 'LCU/UG/24/32881', department: 'Software Engineering' },
    { surname: 'Tikare', otherNames: 'Ridwan Adeola', matric: 'Lcu/Ug/25/38690', department: 'Software Engineering' },
    { surname: 'Omoriba', otherNames: 'Oluwafeyisanmi Paul', matric: 'LCU/UG/24/31710', department: 'Software Engineering' },
    { surname: 'Ayodele', otherNames: 'Olanrewaju James', matric: 'LCU/UG/24/33599', department: 'Software Engineering' },
  ];

  return (
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
        <h2>📚 University Group Project - Group L</h2>
        <p>StreamVibe was built as a final-year university group project. It demonstrates modern React development including hooks, context, routing, localStorage/Supabase, video uploads, and responsive design.</p>
        
        <div className="about-stack">
          {['React 18', 'React Router 6', 'Supabase', 'localStorage', 'CSS Variables', 'Responsive Design'].map(t => (
            <span key={t} className="badge badge-green">{t}</span>
          ))}
        </div>

        <h3 className="team-heading">Team Members</h3>
        <div className="team-table-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Surname</th>
                <th>Other Names</th>
                <th>Matric Number</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {groupMembers.map((member, index) => (
                <tr key={member.matric}>
                  <td className="team-index">{index + 1}</td>
                  <td className="team-surname">{member.surname}</td>
                  <td className="team-names">{member.otherNames}</td>
                  <td className="team-matric">{member.matric}</td>
                  <td className="team-dept">{member.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="team-stats">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-info">
              <p className="stat-label">Total Members</p>
              <p className="stat-value">{groupMembers.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎓</span>
            <div className="stat-info">
              <p className="stat-label">Department</p>
              <p className="stat-value">Software Engineering</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏫</span>
            <div className="stat-info">
              <p className="stat-label">Institution</p>
              <p className="stat-value">LCU</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-footer">
        <h3>Project Features</h3>
        <div className="features-list">
          <div className="feature-item">✅ User authentication with Supabase</div>
          <div className="feature-item">✅ Video upload to cloud storage</div>
          <div className="feature-item">✅ Search and filter videos by category</div>
          <div className="feature-item">✅ Video comments and likes</div>
          <div className="feature-item">✅ Channel subscriptions</div>
          <div className="feature-item">✅ Watch history tracking</div>
          <div className="feature-item">✅ Responsive mobile design</div>
          <div className="feature-item">✅ Dark mode UI</div>
        </div>
      </div>
    </div>
  );
};

export default About;
