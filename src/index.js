import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Styles
import './index.css';
import './App.css';

/**
 * ZENITH FILE MANAGER - CORE RENDERER
 * React 18+ syntax ka use kiya gaya hai desktop optimization ke liye.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);