// ============================================
// StreamVibe – VideoCard Component
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';
import { formatViews, formatDate } from '../../utils/storage';
import './VideoCard.css';

// Generate a deterministic gradient thumbnail based on video id
const getThumbnailGradient = (id = '', category = '') => {
  const gradients = [
    'linear-gradient(135deg, #0a1628 0%, #1a3a2a 50%, #00ff87 100%)',
    'linear-gradient(135deg, #1a0a28 0%, #2a1a3a 50%, #8800ff 100%)',
    'linear-gradient(135deg, #280a0a 0%, #3a1a1a 50%, #ff4444 100%)',
    'linear-gradient(135deg, #0a1a28 0%, #1a2a3a 50%, #0088ff 100%)',
    'linear-gradient(135deg, #1a1a0a 0%, #2a2a1a 50%, #ffaa00 100%)',
    'linear-gradient(135deg, #0a2828 0%, #1a3838 50%, #00ffcc 100%)',
    'linear-gradient(135deg, #28100a 0%, #3a2a1a 50%, #ff8800 100%)',
    'linear-gradient(135deg, #0a0a1a 0%, #1a1a2a 50%, #4488ff 100%)',
  ];
  const hash = (id + category).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const getCategoryEmoji = (category) => {
  const map = {
    Technology: '💻', Gaming: '🎮', Music: '🎵', Sports: '⚽',
    Food: '🍳', Travel: '✈️', Fitness: '💪', Lifestyle: '🌿',
    Education: '📚', Photography: '📷', News: '📰', Comedy: '😂',
    Science: '🔬', Fashion: '👗',
  };
  return map[category] || '🎬';
};

const VideoCard = ({ video, onDelete, showDelete = false, compact = false }) => {
  if (!video) return null;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(video.id);
  };

  return (
    <div className={`video-card ${compact ? 'compact' : ''}`}>
      <Link to={`/watch/${video.id}`} className="video-card-thumb-wrap">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="video-card-thumb" />
        ) : (
          <div
            className="video-card-thumb video-card-thumb-placeholder"
            style={{ background: getThumbnailGradient(video.id, video.category) }}
          >
            <span className="thumb-emoji">{getCategoryEmoji(video.category)}</span>
          </div>
        )}
        {video.duration && (
          <span className="video-duration">{video.duration}</span>
        )}
        <div className="video-card-hover-overlay">
          <span className="play-icon">▶</span>
        </div>
      </Link>

      <div className="video-card-info">
        <div className="video-card-avatar">
          <div className="mini-avatar">
            {video.uploaderUsername?.[0]?.toUpperCase() || video.channelName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>

        <div className="video-card-meta">
          <Link to={`/watch/${video.id}`} className="video-card-title">
            {video.title}
          </Link>
          <div className="video-card-channel">{video.channelName || video.uploaderUsername}</div>
          <div className="video-card-stats">
            <span>{formatViews(video.views)} views</span>
            <span className="dot">·</span>
            <span>{formatDate(video.uploadedAt)}</span>
          </div>
          {video.category && (
            <span className="video-category-tag">{video.category}</span>
          )}
        </div>

        {showDelete && (
          <button className="video-card-delete-btn" onClick={handleDelete} title="Delete video">
            🗑
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
