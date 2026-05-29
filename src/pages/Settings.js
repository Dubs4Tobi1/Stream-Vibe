import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { updateUserProfile } from '../utils/storage';
import './Settings.css';

const Settings = () => {
  const { user, refreshUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', channelName: '', bio: '', email: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({ username: user.username || '', channelName: user.channelName || '', bio: user.bio || '', email: user.email || '' });
  }, [user, navigate]);

  const handleChange = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); };
  const handlePwChange = e => { const { name, value } = e.target; setPwForm(p => ({ ...p, [name]: value })); };

  const saveProfile = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateUserProfile(user.id, { username: form.username.trim(), channelName: form.channelName.trim(), bio: form.bio.trim() });
    refreshUser();
    setSaving(false);
    showToast('Profile updated!', 'success');
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (pwForm.current !== user.password) errs.current = 'Current password is incorrect';
    if (pwForm.next.length < 6) errs.next = 'New password must be at least 6 characters';
    if (pwForm.next !== pwForm.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateUserProfile(user.id, { password: pwForm.next });
    refreshUser();
    setPwForm({ current: '', next: '', confirm: '' });
    setSaving(false);
    showToast('Password updated!', 'success');
  };

  if (!user) return null;

  return (
    <div className="settings-page fade-in">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-grid">
        <div className="settings-card">
          <h2 className="settings-card-title">Profile Information</h2>
          <form onSubmit={saveProfile} className="settings-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input name="username" className={`form-input ${errors.username ? 'input-error' : ''}`} value={form.username} onChange={handleChange} />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Channel Name</label>
              <input name="channelName" className="form-input" value={form.channelName} onChange={handleChange} placeholder="Your channel name" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea name="bio" className="form-input form-textarea" value={form.bio} onChange={handleChange} placeholder="Tell people about yourself..." rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">Email (read-only)</label>
              <input className="form-input" value={form.email} readOnly style={{ opacity: 0.6 }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        <div className="settings-card">
          <h2 className="settings-card-title">Change Password</h2>
          <form onSubmit={savePassword} className="settings-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input name="current" type="password" className={`form-input ${errors.current ? 'input-error' : ''}`} value={pwForm.current} onChange={handlePwChange} />
              {errors.current && <span className="form-error">{errors.current}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input name="next" type="password" className={`form-input ${errors.next ? 'input-error' : ''}`} value={pwForm.next} onChange={handlePwChange} />
              {errors.next && <span className="form-error">{errors.next}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input name="confirm" type="password" className={`form-input ${errors.confirm ? 'input-error' : ''}`} value={pwForm.confirm} onChange={handlePwChange} />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>

        <div className="settings-card">
          <h2 className="settings-card-title">Appearance</h2>
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Dark Mode</p>
              <p className="settings-row-desc">Toggle between dark and light theme</p>
            </div>
            <button className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>

        <div className="settings-card settings-danger-card">
          <h2 className="settings-card-title" style={{ color: 'var(--red)' }}>Danger Zone</h2>
          <p className="settings-row-desc" style={{ marginBottom: 16 }}>Sign out from your account on this device.</p>
          <button className="btn btn-danger" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
