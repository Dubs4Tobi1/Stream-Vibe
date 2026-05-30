import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import { useAuth } from '../context/AuthContext';
import { getWatchHistory, getVideoById } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import { supabase } from '../utils/supabase';
import { VideoGridSkeleton } from '../components/common/Skeleton';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const load = async () => {
      const ids = await getWatchHistory(user.id);
      const videoList = await Promise.all(ids.map(id => getVideoById(id)));
      setVideos(videoList.filter(Boolean));
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const clearHistory = async () => {
    await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id);
    setVideos([]);
    showToast('Watch history cleared', 'success');
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 className="section-heading" style={{ fontSize: 26, marginBottom: 0 }}> Watch History</h1>
        {videos.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearHistory}>Clear All</button>
        )}
      </div>

      {loading ? (
        <VideoGridSkeleton count={6} />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3>No history yet</h3>
          <p>Videos you watch will appear here.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default History;
