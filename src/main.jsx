// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css';
import { PodcastProvider } from './PodcastContext';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PodcastProvider>
      <Router>
        <App />
      </Router>
    </PodcastProvider>
  </React.StrictMode>
);
