import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Trending from './pages/Trending';
import Saved from './pages/Saved';
import History from './pages/History';
import Subscriptions from './pages/Subscriptions';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

import './styles/global.css';
import './App.css';

const FULL_WIDTH_PAGES = ['/login', '/register'];

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-root">
      <Navbar
        onMenuToggle={() => setSidebarOpen(o => !o)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="page-with-sidebar">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/history" element={<History />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
