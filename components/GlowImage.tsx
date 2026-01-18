
import React, { useState, useEffect } from 'react';

interface GlowImageProps {
  src: string;
  alt: string;
  className?: string;
  variant?: 'standard' | 'prestige' | 'avatar' | 'hero' | 'minimal';
  priority?: boolean;
}

const GlowImage: React.FC<GlowImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  variant = 'standard',
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Efeito de transição suave ao carregar
  const baseStyles = "transition-all duration-[1500ms] ease-out object-cover";
  
  const variants = {
    standard: "rounded-2xl",
    prestige: "rounded-[45px] md:rounded-[60px] grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 shadow-2xl border border-white/5",
    avatar: "rounded-[35px] border-2 border-ruby/20 shadow-xl scale-95 group-hover:scale-100",
    hero: "brightness-[0.4] scale-105 animate-slow-zoom",
    minimal: "rounded-3xl"
  };

  return (
    <div className={`relative overflow-hidden bg-onyx/10 dark:bg-white/5 ${className} ${variants[variant]}`}>
      {/* 1. SHIMMER LOADING STATE */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
          <div className="w-full h-full bg-quartz/10 animate-pulse" />
        </div>
      )}

      {/* 2. FALLBACK ICON (ERROR STATE) */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center h-full w-full bg-onyx/5 text-quartz space-y-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span className="text-[7px] font-black uppercase tracking-widest opacity-40">Asset Indisponível</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`
            ${baseStyles} 
            ${isLoaded ? 'opacity-100' : 'opacity-0'} 
            ${variant === 'hero' ? 'animate-ken-burns' : ''}
            h-full w-full
          `}
        />
      )}
      
      {/* 3. LUXURY OVERLAY FOR PRESTIGE VARIANT */}
      {variant === 'prestige' && (
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
      `}} />
    </div>
  );
};

export default GlowImage;
