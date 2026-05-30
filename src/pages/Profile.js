import VideoCard from '../components/VideoCard';
import { getVideos, deleteVideo, getWatchHistory, getVideoById, updateUserProfile, uploadAvatar, formatDate } from '../utils/storage';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('videos');
  const [myVideos, setMyVideos] = useState([]);
  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const avatarRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

useEffect(() => {
  if (!user) { navigate('/login'); return; }
  const load = async () => {
    const all = await getVideos();
    setMyVideos(all.filter(v => v.uploaderId === user.id));
    const histIds = await getWatchHistory(user.id);
    const histVideos = await Promise.all(histIds.map(id => getVideoById(id)));
    setHistoryVideos(histVideos.filter(Boolean).slice(0, 20));
    setLoading(false);
  };
  load();
}, [user, navigate]);

const handleDelete = async (videoId) => {
  if (!window.confirm('Delete this video?')) return;
  const ok = await deleteVideo(videoId, user.id);
  if (ok) {
    setMyVideos(prev => prev.filter(v => v.id !== videoId));
    showToast('Video deleted', 'success');
  }
};

 const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    await uploadAvatar(file, user.id);
    refreshUser();
    showToast('Profile picture updated!', 'success');
  } catch {
    showToast('Failed to upload avatar', 'error');
  }
};

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <div className="profile-page fade-in">

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === 'error' ? '#e53e3e' : '#38a169',
          color: '#fff', padding: '12px 20px', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: 14
        }}>
          {toast.msg}
        </div>
      )}

      <div className="profile-header">
        <div className="profile-cover" />
        <div className="profile-info">
          <div className="profile-avatar-wrap" onClick={() => avatarRef.current.click()} title="Change avatar">
            {user.avatar
              ? <img src={user.avatar} alt={user.username} className="profile-avatar-img" />
              : <div className="profile-avatar-placeholder">{user.username?.[0]?.toUpperCase()}</div>
            }
            <div className="avatar-edit-overlay">📷</div>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <div className="profile-details">
            <h1 className="profile-username">{user.channelName || user.username}</h1>
            <p className="profile-handle">@{user.username}</p>
            <div className="profile-stats">
              <div className="stat"><span className="stat-num">{myVideos.length}</span><span className="stat-label">Videos</span></div>
              <div className="stat"><span className="stat-num">{formatDate(user.createdAt)}</span><span className="stat-label">Joined</span></div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/settings')}>⚙️ Settings</button>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        {['videos', 'history'].map(t => (
          <button key={t} className={`profile-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'videos' ? '🎬 My Videos' : '🕐 Watch History'}
          </button>
        ))}
      </div>

      {tab === 'videos' && (
        <div className="profile-content">
          <div className="profile-section-header">
            <h2 className="section-heading">My Videos</h2>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/upload')}>+ Upload</button>
          </div>
          {myVideos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No videos yet</h3>
              <p>Upload your first video to get started!</p>
              <button className="btn btn-primary" onClick={() => navigate('/upload')} style={{ marginTop: 8 }}>Upload Now</button>
            </div>
          ) : (
            <div className="video-grid">
              {myVideos.map(v => <VideoCard key={v.id} video={v} showDelete onDelete={handleDelete} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="profile-content">
          <h2 className="section-heading">Watch History</h2>
          {historyVideos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🕐</div>
              <h3>No history yet</h3>
              <p>Videos you watch will appear here.</p>
            </div>
          ) : (
            <div className="video-grid">
              {historyVideos.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
