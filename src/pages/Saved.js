import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import { useAuth } from '../context/AuthContext';
import { getSavedVideos, getVideoById } from '../utils/storage';
import { VideoGridSkeleton } from '../components/common/Skeleton';

const Saved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const load = async () => {
      const ids = await getSavedVideos(user.id);
      const videoList = await Promise.all(ids.map(id => getVideoById(id)));
      setVideos(videoList.filter(Boolean));
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  return (
    <div className="fade-in">
      <h1 className="section-heading" style={{ fontSize: 26, marginBottom: 28 }}> Saved Videos</h1>
      {loading ? (
        <VideoGridSkeleton count={6} />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3>No saved videos</h3>
          <p>Save videos while watching to find them here later.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Saved;
