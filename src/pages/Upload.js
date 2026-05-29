// ============================================
// StreamVibe – Upload Video Page
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addVideo, CATEGORIES } from '../utils/storage';
import './Upload.css';

const Upload = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    channelName: '',
    duration: '',
    videoUrl: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const thumbInputRef = useRef();
  const videoInputRef = useRef();

  useEffect(() => {
    if (!user) navigate('/login');
    else {
      setFormData(prev => ({ ...prev, channelName: user.channelName || user.username + "'s Channel" }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Thumbnail must be under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
        setThumbnail(file);              // store File object
        setThumbnailPreview(URL.createObjectURL(file));  // for display only

// In handleVideo:
setVideoFile(file);              // already correct
    };
    reader.readAsDataURL(file);
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      showToast('Please select a video file', 'error');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      showToast('Video must be under 200MB', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreviewUrl(url);

    // Try to get duration
    const vid = document.createElement('video');
    vid.src = url;
    vid.onloadedmetadata = () => {
      const sec = Math.floor(vid.duration);
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      const dur = h > 0
        ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
        : `${m}:${String(s).padStart(2,'0')}`;
      setFormData(prev => ({ ...prev, duration: dur }));
    };
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.channelName.trim()) errs.channelName = 'Channel name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);

    // Simulate upload progress
    for (let i = 10; i <= 90; i += 10) {
      await new Promise(r => setTimeout(r, 120));
      setUploadProgress(i);
    }

    const newVideo = await addVideo({
  title: formData.title.trim(),
  description: formData.description.trim(),
  category: formData.category,
  channelName: formData.channelName.trim(),
  duration: formData.duration || '0:00',
  thumbnailFile: thumbnail,   // pass the raw File object, not base64
  videoFile: videoFile,
  uploaderId: user.id,
  uploaderUsername: user.username,
  onProgress: setUploadProgress,
});

    setUploadProgress(100);
    await new Promise(r => setTimeout(r, 300));

    setLoading(false);
    setSuccess(true);
    showToast('Video uploaded successfully! 🎉', 'success');

    setTimeout(() => navigate(`/watch/${newVideo.id}`), 2000);
  };

  if (success) {
    return (
      <div className="upload-success fade-in">
        <div className="success-icon">✓</div>
        <h2>Upload Complete!</h2>
        <p>Your video is live. Redirecting you to the watch page...</p>
      </div>
    );
  }

  return (
    <div className="upload-page fade-in">
      <div className="upload-header">
        <h1 className="upload-title">Upload a Video</h1>
        <p className="upload-subtitle">Share your content with the StreamVibe community</p>
      </div>

      <form className="upload-form" onSubmit={handleSubmit} noValidate>
        <div className="upload-grid">
          {/* Left Column – Fields */}
          <div className="upload-fields">
            <div className="form-group">
              <label className="form-label">Video Title *</label>
              <input
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter a catchy title..."
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                {formData.title.length}/100
              </span>
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input form-textarea"
                placeholder="Tell viewers about your video..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className={`form-input form-select ${errors.category ? 'input-error' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Channel Name *</label>
                <input
                  name="channelName"
                  type="text"
                  className={`form-input ${errors.channelName ? 'input-error' : ''}`}
                  placeholder="Your channel name"
                  value={formData.channelName}
                  onChange={handleChange}
                />
                {errors.channelName && <span className="form-error">{errors.channelName}</span>}
              </div>
            </div>

            {/* Video File Upload */}
            <div className="form-group">
              <label className="form-label">Video File</label>
              <div
                className="upload-dropzone"
                onClick={() => videoInputRef.current.click()}
              >
                {videoFile ? (
                  <div className="dropzone-filled">
                    <span className="dropzone-icon">🎬</span>
                    <span className="dropzone-filename">{videoFile.name}</span>
                    {formData.duration && <span className="badge badge-green">{formData.duration}</span>}
                  </div>
                ) : (
                  <>
                    <span className="dropzone-icon">📤</span>
                    <p className="dropzone-text">Click to select video</p>
                    <p className="dropzone-hint">MP4, MOV, AVI · Max 200MB</p>
                  </>
                )}
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideo}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Right Column – Thumbnail & Preview */}
          <div className="upload-preview-col">
            <div className="form-group">
              <label className="form-label">Thumbnail Image</label>
              <div
                className="thumb-upload-zone"
                onClick={() => thumbInputRef.current.click()}
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="thumb-preview" />
                ) : (
                  <div className="thumb-placeholder">
                    <span>🖼</span>
                    <p>Upload Thumbnail</p>
                    <p className="dropzone-hint">JPG, PNG · Max 5MB</p>
                  </div>
                )}
                <div className="thumb-overlay">Change</div>
              </div>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnail}
                style={{ display: 'none' }}
              />
            </div>

            {/* Video Preview */}
            {videoPreviewUrl && (
              <div className="form-group">
                <label className="form-label">Video Preview</label>
                <video
                  src={videoPreviewUrl}
                  controls
                  className="video-preview-player"
                />
              </div>
            )}

            {/* Upload Tips */}
            <div className="upload-tips">
              <h4>Upload Tips</h4>
              <ul>
                <li>Use a clear, descriptive title</li>
                <li>Add a custom thumbnail for more clicks</li>
                <li>Select the right category</li>
                <li>Write a detailed description</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="progress-label">Uploading... {uploadProgress}%</span>
          </div>
        )}

        {/* Submit */}
        <div className="upload-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : '📤'}
            {loading ? 'Uploading...' : 'Publish Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
