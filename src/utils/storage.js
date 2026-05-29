// ============================================
// StreamVibe – Supabase Data Layer
// Drop-in replacement for localStorage storage.js
// ============================================
import { supabase } from './supabase';

// ── FORMAT HELPERS (unchanged) ──────────────
export const formatViews = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n?.toString() || '0';
};

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
  if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
  if (diff < 2592000) return Math.floor(diff / 604800) + ' weeks ago';
  if (diff < 31536000) return Math.floor(diff / 2592000) + ' months ago';
  return Math.floor(diff / 31536000) + ' years ago';
};

export const CATEGORIES = [
  'All', 'Technology', 'Gaming', 'Music', 'Sports', 'Food',
  'Travel', 'Fitness', 'Lifestyle', 'Education', 'Photography',
  'News', 'Comedy', 'Science', 'Fashion',
];

// ── VIDEOS ──────────────────────────────────

// Map Supabase snake_case to camelCase shape the UI expects
const mapVideo = (v) => ({
  id: v.id,
  title: v.title,
  description: v.description,
  category: v.category,
  channelName: v.channel_name,
  uploaderId: v.uploader_id,
  uploaderUsername: v.uploader_username,
  thumbnail: v.thumbnail_url,
  videoUrl: v.video_url,
  duration: v.duration,
  views: v.views,
  likes: v.likes,
  uploadedAt: v.uploaded_at,
});

export const getVideos = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('uploaded_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(mapVideo);
};

export const getVideoById = async (id) => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapVideo(data);
};

export const searchVideos = async (query) => {
  if (!query) return getVideos();
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .or(`title.ilike.%${query}%,channel_name.ilike.%${query}%,category.ilike.%${query}%`)
    .order('uploaded_at', { ascending: false });
  if (error) return [];
  return data.map(mapVideo);
};

export const incrementViews = async (videoId) => {
  await supabase.rpc('increment_views', { video_id: videoId });
};

export const deleteVideo = async (videoId, userId) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)
    .eq('uploader_id', userId);
  return !error;
};

// ── FILE UPLOADS ─────────────────────────────

export const uploadThumbnail = async (file, userId) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('thumbnails').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('thumbnails').getPublicUrl(path);
  return data.publicUrl;
};

export const uploadVideoFile = async (file, userId, onProgress) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('videos').upload(path, file, {
    onUploadProgress: (p) => {
      if (onProgress) onProgress(Math.round((p.loaded / p.total) * 100));
    },
  });
  if (error) throw error;
  const { data } = supabase.storage.from('videos').getPublicUrl(path);
  return data.publicUrl;
};

export const addVideo = async ({ title, description, category, channelName, duration, thumbnailFile, videoFile, uploaderId, uploaderUsername, onProgress }) => {
  let thumbnail_url = null;
  let video_url = null;

  if (thumbnailFile) thumbnail_url = await uploadThumbnail(thumbnailFile, uploaderId);
  if (videoFile) video_url = await uploadVideoFile(videoFile, uploaderId, onProgress);

  const { data, error } = await supabase.from('videos').insert({
    title,
    description,
    category,
    channel_name: channelName,
    duration,
    thumbnail_url,
    video_url,
    uploader_id: uploaderId,
    uploader_username: uploaderUsername,
  }).select().single();

  if (error) throw error;
  return mapVideo(data);
};

// ── LIKES ────────────────────────────────────

export const isLiked = async (videoId, userId) => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single();
  return !!data;
};

export const toggleLike = async (videoId, userId) => {
  const liked = await isLiked(videoId, userId);
  if (liked) {
    await supabase.from('likes').delete().eq('video_id', videoId).eq('user_id', userId);
    await supabase.from('videos').update({ likes: supabase.rpc('decrement', { x: 1 }) }).eq('id', videoId);
  } else {
    await supabase.from('likes').insert({ video_id: videoId, user_id: userId });
    await supabase.from('videos').update({ likes: supabase.rpc('increment', { x: 1 }) }).eq('id', videoId);
  }
  return !liked;
};

// ── COMMENTS ─────────────────────────────────

export const getComments = async (videoId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(c => ({
    id: c.id,
    videoId: c.video_id,
    userId: c.user_id,
    username: c.username,
    text: c.text,
    createdAt: c.created_at,
  }));
};

export const addComment = async (videoId, { text, userId, username }) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ video_id: videoId, user_id: userId, username, text })
    .select().single();
  if (error) throw error;
  return { id: data.id, userId: data.user_id, username: data.username, text: data.text, createdAt: data.created_at };
};

export const deleteComment = async (videoId, commentId, userId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);
  return !error;
};

// ── WATCH HISTORY ─────────────────────────────

export const addToWatchHistory = async (userId, videoId) => {
  await supabase.from('watch_history')
    .upsert({ user_id: userId, video_id: videoId, watched_at: new Date().toISOString() },
             { onConflict: 'user_id,video_id' });
};

export const getWatchHistory = async (userId) => {
  const { data } = await supabase
    .from('watch_history')
    .select('video_id, watched_at')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(50);
  return (data || []).map(r => r.video_id);
};

// ── SAVED VIDEOS ──────────────────────────────

export const isSaved = async (userId, videoId) => {
  const { data } = await supabase
    .from('saved_videos')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();
  return !!data;
};

export const toggleSaved = async (userId, videoId) => {
  const saved = await isSaved(userId, videoId);
  if (saved) {
    await supabase.from('saved_videos').delete().eq('user_id', userId).eq('video_id', videoId);
  } else {
    await supabase.from('saved_videos').insert({ user_id: userId, video_id: videoId });
  }
  return !saved;
};

export const getSavedVideos = async (userId) => {
  const { data } = await supabase
    .from('saved_videos')
    .select('video_id')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  return (data || []).map(r => r.video_id);
};

// ── SUBSCRIPTIONS ─────────────────────────────

export const isSubscribed = async (userId, channelId) => {
  const { data } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('subscriber_id', userId)
    .eq('channel_id', channelId)
    .single();
  return !!data;
};

export const toggleSubscription = async (userId, channelId) => {
  const subbed = await isSubscribed(userId, channelId);
  if (subbed) {
    await supabase.from('subscriptions').delete().eq('subscriber_id', userId).eq('channel_id', channelId);
  } else {
    await supabase.from('subscriptions').insert({ subscriber_id: userId, channel_id: channelId });
  }
  return !subbed;
};

export const getSubscriptions = async (userId) => {
  const { data } = await supabase
    .from('subscriptions')
    .select('channel_id')
    .eq('subscriber_id', userId);
  return (data || []).map(r => r.channel_id);
};

// ── PROFILE ───────────────────────────────────

export const updateUserProfile = async (userId, updates) => {
  const mapped = {};
  if (updates.username !== undefined) mapped.username = updates.username;
  if (updates.channelName !== undefined) mapped.channel_name = updates.channelName;
  if (updates.bio !== undefined) mapped.bio = updates.bio;
  if (updates.avatar !== undefined) mapped.avatar_url = updates.avatar;

  const { error } = await supabase.from('profiles').update(mapped).eq('id', userId);
  return !error;
};

export const uploadAvatar = async (file, userId) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;
  await supabase.storage.from('thumbnails').upload(path, file, { upsert: true });
  const { data } = supabase.storage.from('thumbnails').getPublicUrl(path);
  await updateUserProfile(userId, { avatar: data.publicUrl });
  return data.publicUrl;
};