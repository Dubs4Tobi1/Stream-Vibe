// ============================================
// StreamVibe – localStorage Utilities
// ============================================

// --- Keys ---
export const KEYS = {
  USERS: 'sv_users',
  CURRENT_USER: 'sv_current_user',
  VIDEOS: 'sv_videos',
  COMMENTS: 'sv_comments',
  LIKES: 'sv_likes',
  WATCH_HISTORY: 'sv_watch_history',
  SAVED_VIDEOS: 'sv_saved_videos',
  SUBSCRIPTIONS: 'sv_subscriptions',
  THEME: 'sv_theme',
};

// --- Generic helpers ---
export const lsGet = (key, fallback = null) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

export const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const lsRemove = (key) => localStorage.removeItem(key);

// --- Users ---
export const getUsers = () => lsGet(KEYS.USERS, []);
export const saveUsers = (users) => lsSet(KEYS.USERS, users);

export const getCurrentUser = () => lsGet(KEYS.CURRENT_USER, null);
export const saveCurrentUser = (user) => lsSet(KEYS.CURRENT_USER, user);
export const clearCurrentUser = () => lsRemove(KEYS.CURRENT_USER);

export const registerUser = (userData) => {
  const users = getUsers();
  const exists = users.find(u => u.email === userData.email);
  if (exists) return { success: false, error: 'Email already registered' };
  const newUser = {
    id: `user_${Date.now()}`,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    avatar: null,
    bio: '',
    channelName: userData.username + "'s Channel",
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);
  return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, error: 'Invalid email or password' };
  saveCurrentUser(user);
  return { success: true, user };
};

export const updateUserProfile = (userId, updates) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  const current = getCurrentUser();
  if (current && current.id === userId) {
    saveCurrentUser(users[idx]);
  }
  return users[idx];
};

// --- Videos ---
export const getVideos = () => lsGet(KEYS.VIDEOS, getSeedVideos());

export const saveVideos = (videos) => lsSet(KEYS.VIDEOS, videos);

export const addVideo = (videoData) => {
  const videos = getVideos();
  const newVideo = {
    id: `video_${Date.now()}`,
    ...videoData,
    views: 0,
    likes: 0,
    uploadedAt: new Date().toISOString(),
  };
  saveVideos([newVideo, ...videos]);
  return newVideo;
};

export const deleteVideo = (videoId, userId) => {
  const videos = getVideos();
  const video = videos.find(v => v.id === videoId);
  if (!video || video.uploaderId !== userId) return false;
  saveVideos(videos.filter(v => v.id !== videoId));
  // also clean up comments for this video
  const allComments = lsGet(KEYS.COMMENTS, {});
  delete allComments[videoId];
  lsSet(KEYS.COMMENTS, allComments);
  return true;
};

export const getVideoById = (id) => {
  const videos = getVideos();
  return videos.find(v => v.id === id) || null;
};

export const incrementViews = (videoId) => {
  const videos = getVideos();
  const idx = videos.findIndex(v => v.id === videoId);
  if (idx !== -1) {
    videos[idx].views = (videos[idx].views || 0) + 1;
    saveVideos(videos);
  }
};

export const searchVideos = (query) => {
  const videos = getVideos();
  if (!query) return videos;
  const q = query.toLowerCase();
  return videos.filter(v =>
    v.title.toLowerCase().includes(q) ||
    v.channelName?.toLowerCase().includes(q) ||
    v.category?.toLowerCase().includes(q)
  );
};

// --- Likes ---
export const getLikes = () => lsGet(KEYS.LIKES, {});

export const toggleLike = (videoId, userId) => {
  const likes = getLikes();
  if (!likes[videoId]) likes[videoId] = [];
  const idx = likes[videoId].indexOf(userId);
  if (idx === -1) {
    likes[videoId].push(userId);
  } else {
    likes[videoId].splice(idx, 1);
  }
  lsSet(KEYS.LIKES, likes);

  // Update like count on video
  const videos = getVideos();
  const vi = videos.findIndex(v => v.id === videoId);
  if (vi !== -1) {
    videos[vi].likes = likes[videoId].length;
    saveVideos(videos);
  }

  return likes[videoId].includes(userId);
};

export const isLiked = (videoId, userId) => {
  const likes = getLikes();
  return (likes[videoId] || []).includes(userId);
};

// --- Comments ---
export const getComments = (videoId) => {
  const all = lsGet(KEYS.COMMENTS, {});
  return all[videoId] || [];
};

export const addComment = (videoId, comment) => {
  const all = lsGet(KEYS.COMMENTS, {});
  if (!all[videoId]) all[videoId] = [];
  const newComment = {
    id: `c_${Date.now()}`,
    ...comment,
    createdAt: new Date().toISOString(),
  };
  all[videoId] = [newComment, ...all[videoId]];
  lsSet(KEYS.COMMENTS, all);
  return newComment;
};

export const deleteComment = (videoId, commentId, userId) => {
  const all = lsGet(KEYS.COMMENTS, {});
  if (!all[videoId]) return false;
  const comment = all[videoId].find(c => c.id === commentId);
  if (!comment || comment.userId !== userId) return false;
  all[videoId] = all[videoId].filter(c => c.id !== commentId);
  lsSet(KEYS.COMMENTS, all);
  return true;
};

// --- Watch History ---
export const getWatchHistory = (userId) => {
  const all = lsGet(KEYS.WATCH_HISTORY, {});
  return all[userId] || [];
};

export const addToWatchHistory = (userId, videoId) => {
  const all = lsGet(KEYS.WATCH_HISTORY, {});
  if (!all[userId]) all[userId] = [];
  // remove duplicate then prepend
  all[userId] = [videoId, ...all[userId].filter(id => id !== videoId)].slice(0, 50);
  lsSet(KEYS.WATCH_HISTORY, all);
};

// --- Saved Videos ---
export const getSavedVideos = (userId) => {
  const all = lsGet(KEYS.SAVED_VIDEOS, {});
  return all[userId] || [];
};

export const toggleSaved = (userId, videoId) => {
  const all = lsGet(KEYS.SAVED_VIDEOS, {});
  if (!all[userId]) all[userId] = [];
  const idx = all[userId].indexOf(videoId);
  if (idx === -1) {
    all[userId].push(videoId);
  } else {
    all[userId].splice(idx, 1);
  }
  lsSet(KEYS.SAVED_VIDEOS, all);
  return all[userId].includes(videoId);
};

export const isSaved = (userId, videoId) => {
  const all = lsGet(KEYS.SAVED_VIDEOS, {});
  return (all[userId] || []).includes(videoId);
};

// --- Subscriptions ---
export const getSubscriptions = (userId) => {
  const all = lsGet(KEYS.SUBSCRIPTIONS, {});
  return all[userId] || [];
};

export const toggleSubscription = (userId, channelId) => {
  const all = lsGet(KEYS.SUBSCRIPTIONS, {});
  if (!all[userId]) all[userId] = [];
  const idx = all[userId].indexOf(channelId);
  if (idx === -1) {
    all[userId].push(channelId);
  } else {
    all[userId].splice(idx, 1);
  }
  lsSet(KEYS.SUBSCRIPTIONS, all);
  return all[userId].includes(channelId);
};

export const isSubscribed = (userId, channelId) => {
  const all = lsGet(KEYS.SUBSCRIPTIONS, {});
  return (all[userId] || []).includes(channelId);
};

// --- Seed demo data ---
function getSeedVideos() {
  const seeds = [
    {
      id: 'seed_1',
      title: 'Getting Started with React in 2024',
      description: 'A complete beginner guide to React. Learn components, hooks, state and more in this comprehensive tutorial.',
      category: 'Technology',
      channelName: 'CodeWithAlex',
      uploaderId: 'demo_user',
      uploaderUsername: 'codealex',
      thumbnail: null,
      videoUrl: null,
      duration: '24:18',
      views: 48200,
      likes: 3100,
      uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'seed_2',
      title: 'Top 10 Travel Destinations for 2024',
      description: 'Explore the most breathtaking places you must visit this year. From hidden gems to iconic landmarks.',
      category: 'Travel',
      channelName: 'WanderLust',
      uploaderId: 'demo_user2',
      uploaderUsername: 'wanderlust',
      thumbnail: null,
      videoUrl: null,
      duration: '18:44',
      views: 125000,
      likes: 9800,
      uploadedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: 'seed_3',
      title: 'Minimal Desk Setup Tour 2024',
      description: 'My complete minimal workspace setup for productivity and aesthetics. Every item linked below.',
      category: 'Lifestyle',
      channelName: 'MinimalVibes',
      uploaderId: 'demo_user3',
      uploaderUsername: 'minimalvibes',
      thumbnail: null,
      videoUrl: null,
      duration: '11:02',
      views: 87500,
      likes: 6200,
      uploadedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: 'seed_4',
      title: 'Cook Perfect Pasta Every Time',
      description: 'Restaurant quality pasta at home. The secrets chefs don\'t want you to know!',
      category: 'Food',
      channelName: 'ChefMarcello',
      uploaderId: 'demo_user4',
      uploaderUsername: 'chefmarcello',
      thumbnail: null,
      videoUrl: null,
      duration: '09:35',
      views: 210000,
      likes: 18000,
      uploadedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    {
      id: 'seed_5',
      title: 'Full Body Workout – No Equipment Needed',
      description: 'Burn fat and build muscle with this intense 30-minute home workout. No gym, no excuses.',
      category: 'Fitness',
      channelName: 'FitWithJordan',
      uploaderId: 'demo_user5',
      uploaderUsername: 'fitjordan',
      thumbnail: null,
      videoUrl: null,
      duration: '31:15',
      views: 340000,
      likes: 22000,
      uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'seed_6',
      title: 'Lo-Fi Hip Hop Beats – Study Session',
      description: 'Perfect music for studying, coding, and relaxing. 2 hours of smooth lo-fi beats.',
      category: 'Music',
      channelName: 'ChillBeatsHQ',
      uploaderId: 'demo_user6',
      uploaderUsername: 'chillbeats',
      thumbnail: null,
      videoUrl: null,
      duration: '2:04:00',
      views: 1200000,
      likes: 54000,
      uploadedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: 'seed_7',
      title: 'AI Tools That Will Change Everything in 2024',
      description: 'The best AI tools for creators, developers, and businesses. Boost your productivity today.',
      category: 'Technology',
      channelName: 'TechReviewDaily',
      uploaderId: 'demo_user7',
      uploaderUsername: 'techreview',
      thumbnail: null,
      videoUrl: null,
      duration: '16:50',
      views: 95000,
      likes: 7800,
      uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'seed_8',
      title: 'Street Photography in Tokyo',
      description: 'Capturing the soul of Tokyo through candid street photography. My tips and best shots.',
      category: 'Photography',
      channelName: 'FramedByLens',
      uploaderId: 'demo_user8',
      uploaderUsername: 'framedlens',
      thumbnail: null,
      videoUrl: null,
      duration: '14:22',
      views: 62000,
      likes: 4900,
      uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  lsSet(KEYS.VIDEOS, seeds);
  return seeds;
}

// --- Format helpers ---
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
