
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Usando caminho relativo para evitar conflitos de origem em ambientes de preview/proxy.
    // O './sw.js' garante que ele seja buscado na mesma origem e subpasta do app.
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Glow PWA Active:', reg.scope))
      .catch(err => {
        // Log apenas como aviso, pois em certos ambientes de desenvolvimento o SW pode ser bloqueado intencionalmente
        console.warn('Glow PWA registration note:', err.message);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element missing");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
