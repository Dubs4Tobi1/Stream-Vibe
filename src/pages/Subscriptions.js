import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import { useAuth } from '../context/AuthContext';
import { getSubscriptions, getVideos } from '../utils/storage';
import { VideoGridSkeleton } from '../components/common/Skeleton';

const Subscriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const load = async () => {
      const subIds = await getSubscriptions(user.id);

      if (subIds.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const all = await getVideos();
      setVideos(all.filter(v => subIds.includes(v.uploaderId)));
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  return (
    <div className="fade-in">
      <h1 className="section-heading" style={{ fontSize: 26, marginBottom: 28 }}>📡 Subscriptions</h1>

      {loading ? (
        <VideoGridSkeleton count={6} />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📡</div>
          <h3>No subscriptions yet</h3>
          <p>Subscribe to channels on video pages to see their content here.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;