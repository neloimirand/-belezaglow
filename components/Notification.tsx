
import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';

export interface NotificationProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  title, 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - (100 / (duration / 100))));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose, duration]);

  const config = {
    success: {
      border: 'border-emerald/50',
      icon: <div className="text-emerald"><Icons.Star filled /></div>,
      bg: 'bg-emerald/10'
    },
    error: {
      border: 'border-ruby/50',
      icon: <div className="text-ruby"><Icons.Trash /></div>,
      bg: 'bg-ruby/10'
    },
    info: {
      border: 'border-gold/50',
      icon: <div className="text-gold"><Icons.Star filled /></div>,
      bg: 'bg-gold/10'
    }
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md animate-notification-in">
      <div className={`glass-dark rounded-[30px] border-2 shadow-2xl overflow-hidden ${config[type].border}`}>
        <div className="p-6 flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${config[type].bg}`}>
            {config[type].icon}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <h4 className="font-serif font-black text-white italic text-lg leading-tight truncate">{title}</h4>
            <p className="text-quartz text-[10px] font-medium mt-1 leading-relaxed">{message}</p>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-quartz/40 hover:text-white transition-colors active:scale-75"
          >
            ✕
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1 w-full bg-white/5">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${
              type === 'success' ? 'bg-emerald' : type === 'error' ? 'bg-ruby' : 'bg-gold'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes notification-in {
          0% { transform: translate(-50%, -20px) scale(0.95); opacity: 0; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-notification-in { animation: notification-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}} />
    </div>
  );
};

export default Notification;
