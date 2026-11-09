import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import axios from 'axios';

// In production the API is served from the same origin as the app, so the
// default is an empty base URL (relative "/api/..." requests). For a split
// deploy (frontend and backend on different hosts) set VITE_API_URL at build
// time to the backend's public URL, e.g. https://my-api.onrender.com
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
