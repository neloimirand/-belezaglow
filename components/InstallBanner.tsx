
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Escuta o evento nativo de instalação do Chrome/Android/Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('Glow Install Logic Triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // 2. Detecta se já está rodando como APP (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Forçar visibilidade se o navegador for compatível mas o evento demorar
    const timer = setTimeout(() => {
      if (!isInstalled && !isStandalone) {
        setIsVisible(true);
      }
    }, 6000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    // Tenta disparar o prompt nativo (Download Direto)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Se não houver prompt nativo, detecta se é iOS para mostrar o guia
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIos) {
        setShowIosGuide(true);
      } else {
        alert("Siga as instruções do seu navegador para 'Instalar' ou 'Adicionar à Tela de Início'.");
        setIsVisible(false);
      }
    }
  };

  if (isInstalled) return null;
  if (!isVisible && !showIosGuide) return null;

  return (
    <>
      {/* BANNER PRINCIPAL DE DOWNLOAD */}
      {isVisible && !showIosGuide && (
        <div className="fixed bottom-24 right-4 md:right-12 z-[9999] w-[310px] md:w-[380px] animate-slide-in">
          <div className="bg-onyx/98 backdrop-blur-3xl border-2 border-gold/40 p-7 rounded-[45px] shadow-[0_35px_80px_rgba(0,0,0,0.8)] flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/20 rounded-full blur-2xl animate-pulse"></div>
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center p-1 border border-gold/30 shadow-inner shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent"></div>
                <div className="text-gold font-serif font-black italic text-2xl relative z-10">BG</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[7px] font-black uppercase text-gold tracking-[0.5em] mb-1">Glow Private App</p>
                <h4 className="text-white font-serif font-black italic text-base leading-tight">Descarregar App Oficial</h4>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-ping"></div>
                   <p className="text-quartz text-[7px] font-bold uppercase tracking-widest">Acesso Direto e Rápido</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
               <button 
                onClick={handleInstallClick}
                className="flex-[2] py-5 bg-white text-onyx rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold transition-all shadow-xl active:scale-95 border border-white/20"
               >
                 Instalar Agora
               </button>
               <button 
                onClick={() => setIsVisible(false)}
                className="flex-1 py-5 bg-white/5 text-quartz rounded-2xl text-[8px] font-black uppercase border border-white/5 hover:text-white transition-colors"
               >
                Depois
               </button>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-gold/10 w-full">
               <div className="h-full bg-gold animate-progress-line"></div>
            </div>
          </div>
        </div>
      )}

      {/* GUIA ASSISTIDO PARA IOS (IPHONE) */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[10000] bg-onyx/95 backdrop-blur-2xl flex items-end md:items-center justify-center p-4 animate-fade-in">
           <div className="bg-white dark:bg-darkCard w-full max-w-md rounded-[50px] p-10 md:p-14 luxury-shadow border border-gold/30 space-y-10 relative text-center">
              <button onClick={() => setShowIosGuide(false)} className="absolute top-8 right-8 text-quartz">✕</button>
              
              <div className="w-20 h-20 bg-onyx rounded-[30px] flex items-center justify-center mx-auto border border-gold/20 shadow-2xl">
                 <span className="text-3xl font-serif font-black text-gold italic">BG</span>
              </div>

              <div className="space-y-4">
                 <h3 className="text-2xl font-serif font-black dark:text-white italic">Instalar no seu iPhone.</h3>
                 <p className="text-stone-500 dark:text-quartz text-sm font-medium leading-relaxed">
                   A Apple exige um ritual manual para apps de elite. Siga os passos abaixo:
                 </p>
              </div>

              <div className="space-y-4 text-left">
                 <div className="flex items-center gap-5 p-5 bg-offwhite dark:bg-onyx rounded-3xl border border-quartz/5">
                    <div className="w-10 h-10 bg-ruby/10 text-ruby rounded-xl flex items-center justify-center font-black">1</div>
                    <p className="text-xs font-bold dark:text-white">Toque no ícone de <span className="text-ruby">Compartilhar</span> (quadrado com seta).</p>
                 </div>
                 <div className="flex items-center gap-5 p-5 bg-offwhite dark:bg-onyx rounded-3xl border border-quartz/5">
                    <div className="w-10 h-10 bg-ruby/10 text-ruby rounded-xl flex items-center justify-center font-black">2</div>
                    <p className="text-xs font-bold dark:text-white">Role para baixo e selecione <span className="text-gold">"Adicionar à Tela de Início"</span>.</p>
                 </div>
              </div>

              <button 
                onClick={() => setShowIosGuide(false)}
                className="w-full py-6 bg-ruby text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95"
              >
                Entendi, Vou Instalar
              </button>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @keyframes progress-line { from { width: 100%; } to { width: 0%; } }
        .animate-progress-line { animation: progress-line 20s linear forwards; }
      `}} />
    </>
  );
};

export default InstallBanner;
