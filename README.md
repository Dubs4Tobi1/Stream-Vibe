# 🎬 StreamVibe – YouTube-Inspired Video Platform

> A modern video sharing platform built with React. University Group Project.

![StreamVibe](https://img.shields.io/badge/React-18-blue) ![Router](https://img.shields.io/badge/React%20Router-6-orange) ![Storage](https://img.shields.io/badge/Storage-localStorage-green)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Open in browser
http://localhost:3000
```

---

## ✨ Features

| Feature | Status |
|---|---|
| User Registration & Login | ✅ |
| JWT-free session via localStorage | ✅ |
| Video Upload (file + thumbnail) | ✅ |
| Video Playback | ✅ |
| Like / Unlike videos | ✅ |
| Save / Unsave videos | ✅ |
| Comment system | ✅ |
| Delete own videos | ✅ |
| Delete own comments | ✅ |
| Real-time Search | ✅ |
| Category Filter | ✅ |
| Trending page | ✅ |
| Watch History | ✅ |
| Channel Subscriptions | ✅ |
| Dark / Light theme toggle | ✅ |
| Profile Dashboard | ✅ |
| Edit profile & avatar | ✅ |
| Responsive design | ✅ |
| Toast notifications | ✅ |
| Skeleton loading states | ✅ |
| 404 error page | ✅ |

---

## 📁 Project Structure

```
streamvibe/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Skeleton.js        # Loading skeletons & spinner
│   │   ├── layout/
│   │   │   ├── Navbar.js          # Top navigation bar
│   │   │   ├── Sidebar.js         # Side navigation
│   │   │   └── Footer.js          # Page footer
│   │   └── video/
│   │       └── VideoCard.js       # Reusable video card
│   ├── context/
│   │   ├── AuthContext.js         # Authentication state
│   │   ├── ToastContext.js        # Toast notifications
│   │   └── ThemeContext.js        # Dark/light mode
│   ├── pages/
│   │   ├── Home.js                # Main feed with categories
│   │   ├── Login.js               # Sign in page
│   │   ├── Register.js            # Sign up page
│   │   ├── Upload.js              # Video upload form
│   │   ├── Watch.js               # Video player + comments
│   │   ├── Search.js              # Search results
│   │   ├── Profile.js             # User dashboard
│   │   ├── Trending.js            # Trending videos
│   │   ├── Saved.js               # Saved videos
│   │   ├── History.js             # Watch history
│   │   ├── Subscriptions.js       # Subscribed channels
│   │   ├── Settings.js            # Account settings
│   │   ├── About.js               # About page
│   │   ├── Contact.js             # Contact form
│   │   └── NotFound.js            # 404 page
│   ├── styles/
│   │   └── global.css             # CSS variables & global styles
│   ├── utils/
│   │   └── storage.js             # localStorage helpers & seed data
│   ├── App.js                     # Router & layout shell
│   └── index.js                   # React entry point
└── package.json
```

---

## 🎓 Academic Requirements Met

- ✅ **React Components** – Functional components throughout
- ✅ **React Router** – Full client-side routing with 14 pages
- ✅ **useState** – Used in every page/component
- ✅ **useEffect** – Data fetching, session restore, side effects
- ✅ **Props** – VideoCard, Navbar, Sidebar all use props
- ✅ **Event Handling** – Forms, buttons, file inputs
- ✅ **Form Handling** – Login, Register, Upload, Comment, Settings
- ✅ **localStorage** – All data persisted (users, videos, likes, comments, history)
- ✅ **Responsive Design** – Mobile-first, works on all screen sizes
- ✅ **Navbar** – Full navigation with search, user menu
- ✅ **Footer** – Site-wide footer with links
- ✅ **Loading States** – Skeleton loaders and spinners
- ✅ **Error Handling** – Form validation, 404 page, try/catch in storage
- ✅ **Real-world Structure** – Context, utils, pages, components separation

---

## 🎨 Design System

- **Font**: Syne (headings) + DM Sans (body)
- **Primary Color**: `#00ff87` (neon green)
- **Background**: `#080808` (near black)
- **Accent**: Green glow effects, smooth transitions
- **Theme**: Dark by default, light mode toggle

---

## 🛠️ Tech Stack

- **React 18** – UI library
- **React Router 6** – Client-side routing
- **CSS Variables** – Theming system
- **localStorage** – Data persistence (no backend needed)

---

## 📦 Deployment

### Vercel
```bash
npm run build
# Drop the /build folder into Vercel, or connect your GitHub repo
```

### Netlify
```bash
npm run build
# Drag and drop the /build folder to Netlify
```

---

## 👥 Demo Account

After starting the app, register a new account **or** use the "Try Demo Account" button on the login page.

The app seeds 8 demo videos automatically on first load.

---

*Built with ❤️ using React – University Group Project 2024*
