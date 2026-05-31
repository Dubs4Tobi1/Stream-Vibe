import React, { useState, useEffect } from 'react';
import VideoCard from '../components/video/VideoCard';
import { VideoGridSkeleton } from '../components/common/Skeleton';
import { getVideos } from '../utils/storage';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await getVideos();
      const sorted = [...all].sort((a, b) => b.views - a.views);
      setVideos(sorted);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="fade-in">
      <h1 className="section-heading" style={{ fontSize: 26, marginBottom: 28 }}>Trending Videos</h1>
      {loading ? <VideoGridSkeleton count={8} /> : (
        <div className="video-grid">
          {videos.map((v, i) => (
            <div key={v.id} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: i < 3 ? 'var(--green)' : 'rgba(0,0,0,0.8)', color: i < 3 ? '#000' : '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13 }}>
                #{i + 1}
              </div>
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
