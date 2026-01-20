
import React, { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Icons } from '../constants';

interface GlowCarouselProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean) => ReactNode;
  autoPlayInterval?: number;
  className?: string;
}

export function GlowCarousel<T>({ 
  items, 
  renderItem, 
  autoPlayInterval = 6000,
  className = ""
}: GlowCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (items.length <= 1) return;
    setDirection('next');
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    if (items.length <= 1) return;
    setDirection('prev');
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || !autoPlayInterval || items.length <= 1) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isPaused, items.length]);

  // Touch handlers for mobile "spin" experience
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > 50;
    
    if (isSwipe) {
      if (distance > 0) nextSlide();
      else prevSlide();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!items.length) return null;

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-[40px] md:rounded-[60px] bg-onyx luxury-shadow border border-white/5 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative h-[600px] md:h-[700px] w-full">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          const isPrev = idx === (activeIndex - 1 + items.length) % items.length;
          const isNext = idx === (activeIndex + 1) % items.length;

          return (
            <div 
              key={idx}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isActive 
                  ? 'opacity-100 translate-x-0 scale-100 z-20 pointer-events-auto' 
                  : isPrev && direction === 'next'
                  ? 'opacity-0 -translate-x-full scale-110 z-10 pointer-events-none'
                  : isNext && direction === 'prev'
                  ? 'opacity-0 translate-x-full scale-110 z-10 pointer-events-none'
                  : 'opacity-0 scale-95 z-0 pointer-events-none translate-x-20'
              }`}
            >
              {renderItem(item, isActive)}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls - Glossy Glassmorphism */}
      {items.length > 1 && (
        <>
          <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-6 pointer-events-none">
            {/* Indicators Ribbon */}
            <div className="flex gap-2 pointer-events-auto bg-black/40 backdrop-blur-2xl p-3 rounded-full border border-white/10 shadow-2xl">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIndex ? 'next' : 'prev');
                    setActiveIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    i === activeIndex ? 'w-12 bg-ruby shadow-[0_0_15px_rgba(157,23,77,1)]' : 'w-1.5 bg-white/20 hover:bg-white/50'
                  }`}
                  aria-label={`Patente ${i + 1}`}
                />
              ))}
            </div>

            {/* Desktop Arrows */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-10 right-10 justify-between w-[calc(100%-80px)]">
              <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="w-16 h-16 rounded-full bg-onyx/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-ruby hover:border-ruby transition-all active:scale-90 shadow-2xl pointer-events-auto group"
              >
                <div className="rotate-180 group-hover:-translate-x-1 transition-transform"><Icons.ChevronRight /></div>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="w-16 h-16 rounded-full bg-onyx/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-ruby hover:border-ruby transition-all active:scale-90 shadow-2xl pointer-events-auto group"
              >
                <div className="group-hover:translate-x-1 transition-transform"><Icons.ChevronRight /></div>
              </button>
            </div>
          </div>

          {/* Infinity Spin Progress Line */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-ruby/10 w-full z-40">
            <div 
              key={activeIndex}
              className="h-full bg-ruby animate-glow-progress"
              style={{ animationDuration: `${autoPlayInterval}ms` }}
            />
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-progress {
          from { width: 0%; box-shadow: 0 0 0px rgba(157,23,77,0); }
          to { width: 100%; box-shadow: 0 0 10px rgba(157,23,77,0.8); }
        }
        .animate-glow-progress {
          animation-name: glow-progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}} />
    </div>
  );
}
