
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
      
      // Auto-ocultar após 7 segundos como solicitado
      setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-8 z-[1000] animate-fade-in pointer-events-auto">
      <div className="bg-onyx/90 backdrop-blur-xl border border-ruby/30 text-white px-8 py-5 rounded-[30px] shadow-2xl flex items-center gap-6 group hover:scale-105 transition-all">
        <div className="w-12 h-12 bg-ruby rounded-2xl flex items-center justify-center shadow-lg shadow-ruby/20">
          <Icons.Star filled />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">App Disponível</p>
          <button 
            onClick={handleInstallClick}
            className="text-sm font-serif font-bold text-white group-hover:text-ruby transition-colors flex items-center gap-2"
          >
            Baixar agora
            <Icons.ChevronRight />
          </button>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 p-2 text-quartz hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
