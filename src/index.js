import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { seedDemoUser } from './utils/seedDemo';

// Seed demo account on first load
seedDemoUser();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
