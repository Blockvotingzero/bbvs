
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeLocalStorage } from './data/staticData';

// Initialize static data in local storage
initializeLocalStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
