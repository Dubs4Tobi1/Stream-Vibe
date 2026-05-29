import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard';
import { VideoGridSkeleton } from '../components/common/Skeleton';
import { searchVideos } from '../utils/storage';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
    setLoading(true);

    const load = async () => {
      const data = await searchVideos(q);
      setResults(data);
      setLoading(false);
    };
    load();
  }, [location.search]);

  return (
    <div className="search-page fade-in">
      <div className="search-header">
        <h1 className="search-title">
          {query ? <>Results for <span className="search-query">"{query}"</span></> : 'Search Videos'}
        </h1>
        {!loading && (
          <p className="search-count">{results.length} video{results.length !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {loading ? (
        <VideoGridSkeleton count={6} />
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try different keywords or browse all videos on the home page.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>Browse All Videos</Link>
        </div>
      ) : (
        <div className="video-grid">
          {results.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Search;