import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import { useAuth } from '../context/AuthContext';
import { getWatchHistory, getVideoById, lsGet, lsSet, KEYS } from '../utils/storage';
import { useToast } from '../context/ToastContext';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const ids = getWatchHistory(user.id);
    setVideos(ids.map(id => getVideoById(id)).filter(Boolean));
  }, [user, navigate]);

  const clearHistory = () => {
    const all = lsGet(KEYS.WATCH_HISTORY, {});
    delete all[user.id];
    lsSet(KEYS.WATCH_HISTORY, all);
    setVideos([]);
    showToast('Watch history cleared', 'success');
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 className="section-heading" style={{ fontSize: 26, marginBottom: 0 }}>🕐 Watch History</h1>
        {videos.length > 0 && <button className="btn btn-ghost btn-sm" onClick={clearHistory}>Clear All</button>}
      </div>
      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🕐</div>
          <h3>No history yet</h3>
          <p>Videos you watch will appear here.</p>
        </div>
      ) : (
        <div className="video-grid">{videos.map(v => <VideoCard key={v.id} video={v} />)}</div>
      )}
    </div>
  );
};

export default History;
