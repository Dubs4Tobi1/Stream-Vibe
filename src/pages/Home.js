import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import { VideoGridSkeleton } from '../components/common/Skeleton';
import { getVideos, CATEGORIES } from '../utils/storage';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const all = await getVideos();
      setVideos(all);
      setFilteredVideos(all);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(v => v.category === activeCategory));
    }
  }, [activeCategory, videos]);

  const trending = [...videos].sort((a, b) => b.views - a.views).slice(0, 4);
  const recent = [...videos].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 8);

  return (
    <div className="home-page fade-in">
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge badge badge-green">🔴 Live Platform</div>
          <h1 className="hero-title">
            Your stage.<br />
            <span className="hero-accent">Your vibe.</span>
          </h1>
          <p className="hero-subtitle">
            Upload, discover and share videos that move the world.
            A platform built for the next generation of creators.
          </p>
          <div className="hero-actions">
            <Link to="/upload" className="btn btn-primary btn-lg">Start Creating</Link>
            <Link to="/register" className="btn btn-ghost btn-lg">Join Free →</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-grid-preview">
            {['💻', '🎵', '✈️', '💪', '🎮', '🍳'].map((emoji, i) => (
              <div key={i} className="preview-tile" style={{ animationDelay: `${i * 0.1}s` }}>
                <span>{emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="category-bar">
        <div className="category-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <VideoGridSkeleton count={8} />
      ) : (
        <>
          {activeCategory === 'All' && trending.length > 0 && (
            <section className="home-section">
              <h2 className="section-heading">🔥 Trending Now</h2>
              <div className="video-grid">
                {trending.map((video, i) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          )}

          {activeCategory === 'All' && <div className="divider" />}

          <section className="home-section">
            <h2 className="section-heading">
              {activeCategory === 'All' ? '🎬 All Videos' : `${activeCategory} Videos`}
            </h2>

            {filteredVideos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No videos found</h3>
                <p>No videos in this category yet. Be the first to upload!</p>
                <Link to="/upload" className="btn btn-primary" style={{ marginTop: 8 }}>
                  Upload a Video
                </Link>
              </div>
            ) : (
              <div className="video-grid">
                {(activeCategory === 'All' ? recent : filteredVideos).map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
