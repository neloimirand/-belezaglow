
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro do Service Worker otimizado para evitar spam de console em dev
if ('serviceWorker' in navigator) {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isHttps = window.location.protocol === 'https:';

  if (isHttps && !isLocal) {
    window.addEventListener('load', () => {
      const swUrl = `${window.location.pathname.replace(/\/$/, '')}/sw.js`.replace(/\/+/g, '/');
      navigator.serviceWorker.register(swUrl)
        .then(reg => {
          // Log apenas em produção ou se necessário
        })
        .catch(() => {
          // Falha silenciosa em dev
        });
    });
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element missing");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
