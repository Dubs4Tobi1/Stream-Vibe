import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { showToast('Please fill all required fields', 'error'); return; }
    setSent(true);
    showToast('Message sent! We will get back to you soon.', 'success');
  };

  return (
    <div className="fade-in" style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Contact Us</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Have a question or feedback? We would love to hear from you.</p>
      {sent ? (
        <div style={{ background: 'var(--green-glow)', border: '1px solid var(--green)', borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 48 }}>✅</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Message Sent!</h3>
          <p style={{ color: 'var(--text-muted)' }}>Thanks for reaching out. We will reply to {form.email} shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
          <div className="form-group"><label className="form-label">Name *</label><input name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Email *</label><input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Subject</label><input name="subject" className="form-input" placeholder="What is this about?" value={form.subject} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Message *</label><textarea name="message" className="form-input form-textarea" placeholder="Your message..." value={form.message} onChange={handleChange} rows={5} /></div>
          <button type="submit" className="btn btn-primary">Send Message ✉️</button>
        </form>
      )}
    </div>
  );
};

export default Contact;
