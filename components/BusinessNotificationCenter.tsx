
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';

export interface BusinessNotification {
  id: string;
  type: 'SMS' | 'BOOKING' | 'COUPON' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface BusinessNotificationCenterProps {
  onClose: () => void;
  notifications: BusinessNotification[];
  onMarkAsRead: (id: string) => void;
}

const BusinessNotificationCenter: React.FC<BusinessNotificationCenterProps> = ({ 
  onClose, 
  notifications, 
  onMarkAsRead 
}) => {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Som de notificação premium (cristal/luxo)
    soundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
  }, []);

  const getTypeIcon = (type: BusinessNotification['type']) => {
    switch (type) {
      case 'SMS': return <Icons.Message />;
      case 'BOOKING': return <Icons.Calendar />;
      case 'COUPON': return <Icons.Award />;
      default: return <Icons.Star filled />;
    }
  };

  const getTypeColor = (type: BusinessNotification['type']) => {
    switch (type) {
      case 'SMS': return 'text-emerald bg-emerald/10';
      case 'BOOKING': return 'text-ruby bg-ruby/10';
      case 'COUPON': return 'text-gold bg-gold/10';
      default: return 'text-onyx bg-onyx/10 dark:text-white dark:bg-white/10';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-darkCard shadow-2xl z-[8500] animate-slide-in-right border-l border-quartz/10 flex flex-col">
      <header className="p-8 border-b border-quartz/5 bg-offwhite dark:bg-onyx flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-ruby text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Icons.Bell filled />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black dark:text-white italic">Alertas Glow.</h3>
            <p className="text-[8px] font-black uppercase text-quartz tracking-[0.2em]">Fluxo de Atividade Real-Time</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-darkCard rounded-xl hover:text-ruby transition-colors"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`p-6 rounded-[35px] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                n.read 
                  ? 'bg-offwhite dark:bg-onyx/40 border-transparent opacity-60' 
                  : 'bg-white dark:bg-darkCard border-ruby/20 shadow-xl scale-[1.02]'
              }`}
            >
              {!n.read && (
                <div className="absolute top-6 right-6 w-2 h-2 bg-ruby rounded-full animate-ping"></div>
              )}
              
              <div className="flex gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${getTypeColor(n.type)}`}>
                  {getTypeIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[7px] font-black uppercase tracking-widest text-quartz">{n.type} • {n.timestamp}</span>
                  </div>
                  <h4 className="font-serif font-black text-lg dark:text-white italic leading-tight">{n.title}</h4>
                  <p className="text-[10px] text-stone-500 dark:text-quartz leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 text-center px-12">
            <div className="w-20 h-20 bg-quartz/20 rounded-full flex items-center justify-center">
              <Icons.Bell />
            </div>
            <p className="font-serif italic text-2xl">Silêncio Absoluto. <br />Nenhum alerta novo.</p>
          </div>
        )}
      </div>

      <footer className="p-8 border-t border-quartz/5 bg-offwhite dark:bg-onyx text-center shrink-0">
        <p className="text-[8px] font-black uppercase text-quartz tracking-[0.3em]">Beleza Glow Maison • Concierge Pro</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default BusinessNotificationCenter;
