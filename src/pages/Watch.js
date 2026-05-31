// ============================================
// StreamVibe – Watch Video Page
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import VideoCard from '../components/video/VideoCard';
import {
  getVideoById, getVideos, getComments, addComment, deleteComment,
  toggleLike, isLiked, toggleSaved, isSaved, incrementViews,
  addToWatchHistory, formatViews, formatDate, deleteVideo,
  toggleSubscription, isSubscribed
} from '../utils/storage';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState('');
  const [videoError, setVideoError] = useState(null);
  const hasTrackedView = useRef(false);
  const videoRef = useRef(null);

  // Warn user before leaving if they have unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (commentText.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [commentText]);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      const v = await getVideoById(id);
      if (!v) { setError('Video not found'); setLoading(false); return; }
      setVideo(v);
      setComments(await getComments(id));
      await incrementViews(id);
      if (user) {
        await addToWatchHistory(user.id, id);
        setLiked(await isLiked(id, user.id));
        setSaved(await isSaved(user.id, id));
        setSubscribed(await isSubscribed(user.id, v.uploaderId));
      }
      const all = await getVideos();
      const related = all.filter(vi => vi.id !== id).slice(0, 6);
      setRelatedVideos(related);
      setLoading(false);
    };
    load();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { showToast('Sign in to like videos', 'info'); navigate('/login'); return; }
    const nowLiked = await toggleLike(id, user.id);
    setLiked(nowLiked);
    setVideo(prev => ({ ...prev, likes: prev.likes + (nowLiked ? 1 : -1) }));
    showToast(nowLiked ? 'Video liked! ❤️' : 'Like removed', 'success');
  };

  const handleSave = async () => {
    if (!user) { showToast('Sign in to save videos', 'info'); navigate('/login'); return; }
    const nowSaved = await toggleSaved(user.id, id);
    setSaved(nowSaved);
    showToast(nowSaved ? 'Saved to your library 🔖' : 'Removed from saved', 'success');
  };

  const handleSubscribe = async () => {
    if (!user) { showToast('Sign in to subscribe', 'info'); navigate('/login'); return; }
    const nowSub = await toggleSubscription(user.id, video.uploaderId);
    setSubscribed(nowSub);
    showToast(nowSub ? `Subscribed to ${video.channelName}! 📡` : 'Unsubscribed', 'success');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { showToast('Sign in to comment', 'info'); navigate('/login'); return; }
    if (!commentText.trim()) { setCommentError('Comment cannot be empty'); return; }
    if (commentText.trim().length > 500) { setCommentError('Comment too long (max 500 chars)'); return; }

    try {
      const newComment = await addComment(id, {
        text: commentText.trim(),
        userId: user.id,
        username: user.username,
      });
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      setCommentError('');
      showToast('Comment posted!', 'success');
    } catch {
      showToast('Failed to post comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    const ok = await deleteComment(id, commentId, user.id);
    if (ok) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast('Comment deleted', 'info');
    } else {
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleDeleteVideo = async () => {
    if (!user || !window.confirm('Are you sure you want to delete this video? This cannot be undone.')) return;
    const ok = await deleteVideo(id, user.id);
    if (ok) {
      showToast('Video deleted successfully', 'success');
      navigate('/profile');
    } else {
      showToast('Could not delete video', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard 📋', 'success');
  };

  const handleVideoError = (e) => {
    console.error('Video Error:', e);
    console.error('Video URL:', video?.videoUrl);
    console.error('Video error code:', videoRef.current?.error?.code);
    
    let errorMsg = 'Unable to load video. ';
    if (videoRef.current?.error?.code === 4) {
      errorMsg += 'The video format is not supported.';
    } else if (videoRef.current?.error?.code === 2) {
      errorMsg += 'The network request was aborted.';
    } else {
      errorMsg += 'Please check the video URL or try again later.';
    }
    setVideoError(errorMsg);
    showToast(errorMsg, 'error');
  };

  if (loading) {
    return (
      <div className="watch-page">
        <div className="watch-skeleton">
          <div className="skeleton-video-player" />
          <div className="skeleton-video-info">
            <div className="skeleton-box" style={{ height: 28, width: '70%' }} />
            <div className="skeleton-box" style={{ height: 16, width: '40%', marginTop: 12 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-error fade-in">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Video Not Found</h3>
          <p>This video doesn't exist or may have been removed.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page fade-in">
      <div className="watch-layout">
        {/* Main content */}
        <div className="watch-main">
          {/* Player */}
          <div className="video-player-wrap">
            {video.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  className="video-player"
                  poster={video.thumbnail || undefined}
                  onError={handleVideoError}
                  onLoadStart={() => {
                    setVideoError(null);
                    console.log('Video loading:', video.videoUrl);
                  }}
                  onCanPlay={() => {
                    setVideoError(null);
                    console.log('Video ready to play');
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {videoError && (
                  <div className="video-error-overlay">
                    <div className="video-error-message">
                      <span>⚠️</span>
                      <p>{videoError}</p>
                      <small style={{ marginTop: 8, color: '#aaa' }}>
                        URL: {video.videoUrl.substring(0, 60)}...
                      </small>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className="video-player-placeholder"
                style={{
                  background: video.thumbnail
                    ? `url(${video.thumbnail}) center/cover`
                    : 'linear-gradient(135deg, #0a1628, #1a3a2a 50%, #00ff87)'
                }}
              >
                <div className="no-video-overlay">
                  <div className="no-video-icon">▶</div>
                  <p>No video file — demo content</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="video-info-block">
            <h1 className="watch-title">{video.title}</h1>

            <div className="watch-meta-row">
              <div className="watch-stats">
                <span>{formatViews(video.views)} views</span>
                <span className="dot">·</span>
                <span>{formatDate(video.uploadedAt)}</span>
                {video.category && (
                  <span className="badge badge-green">{video.category}</span>
                )}
              </div>

              <div className="watch-actions">
                <button
                  className={`watch-action-btn ${liked ? 'active' : ''}`}
                  onClick={handleLike}
                >
                  <span>{liked ? '❤️' : '🤍'}</span>
                  <span>{formatViews(video.likes)}</span>
                </button>

                <button
                  className={`watch-action-btn ${saved ? 'active' : ''}`}
                  onClick={handleSave}
                >
                  <span>{saved ? '🔖' : '📌'}</span>
                  <span>Save</span>
                </button>

                <button className="watch-action-btn" onClick={handleShare}>
                  <span>🔗</span>
                  <span>Share</span>
                </button>

                {user && user.id === video.uploaderId && (
                  <button className="watch-action-btn danger" onClick={handleDeleteVideo}>
                    <span>🗑</span>
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            <div className="divider" />

            {/* Channel info */}
            <div className="channel-row">
              <div className="channel-avatar">
                {video.uploaderUsername?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="channel-info">
                <h3 className="channel-name">{video.channelName}</h3>
                <p className="channel-handle">@{video.uploaderUsername}</p>
              </div>
              <button
                className={`btn ${subscribed ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                onClick={handleSubscribe}
              >
                {subscribed ? '✓ Subscribed' : '+ Subscribe'}
              </button>
            </div>

            {/* Description */}
            {video.description && (
              <div className="video-description">
                <p>{video.description}</p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="comments-section">
            <h2 className="comments-heading">
              💬 Comments <span className="comments-count">{comments.length}</span>
            </h2>

            {/* Add Comment */}
            <form className="comment-form" onSubmit={handleComment}>
              <div className="comment-avatar">
                {user ? (user.avatar
                  ? <img src={user.avatar} alt="" className="comment-avatar-img" />
                  : <span>{user.username?.[0]?.toUpperCase()}</span>
                ) : <span>?</span>}
              </div>
              <div className="comment-input-wrap">
                <textarea
                  className="form-input form-textarea comment-textarea"
                  placeholder={user ? 'Add a comment...' : 'Sign in to comment...'}
                  value={commentText}
                  onChange={e => { setCommentText(e.target.value); setCommentError(''); }}
                  rows={2}
                  disabled={!user}
                  maxLength={500}
                />
                {commentError && <span className="form-error">{commentError}</span>}
                {commentText.trim() && (
                  <div className="comment-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCommentText('')}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comment List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <span>💬</span>
                  <p>Be the first to comment!</p>
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-avatar">
                      {c.avatar
                        ? <img src={c.avatar} alt="" className="comment-avatar-img" />
                        : <span>{c.username?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-username">@{c.username}</span>
                        <span className="comment-date">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="comment-text">{c.text}</p>
                    </div>
                    {user && user.id === c.userId && (
                      <button
                        className="comment-delete-btn"
                        onClick={() => handleDeleteComment(c.id)}
                        title="Delete comment"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar – Related Videos */}
        <aside className="watch-sidebar">
          <h3 className="related-heading">Up Next</h3>
          <div className="related-list">
            {relatedVideos.map(v => (
              <VideoCard key={v.id} video={v} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Watch;
