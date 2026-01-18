
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
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
  autoPlayInterval = 5000,
  className = ""
}: GlowCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || !autoPlayInterval) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isPaused]);

  if (!items.length) return null;

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-[50px] bg-onyx luxury-shadow border border-white/5 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative h-[500px] md:h-[650px] w-full">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              idx === activeIndex 
                ? 'opacity-100 scale-100 z-10 translate-x-0' 
                : idx < activeIndex 
                  ? 'opacity-0 scale-95 z-0 -translate-x-10' 
                  : 'opacity-0 scale-95 z-0 translate-x-10'
            }`}
          >
            {renderItem(item, idx === activeIndex)}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-10 right-10 z-30 flex justify-between items-center pointer-events-none">
        {/* Indicators (Dots) */}
        <div className="flex gap-3 pointer-events-auto bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-12 bg-ruby shadow-[0_0_10px_rgba(157,23,77,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows (Desktop Only) */}
        <div className="hidden md:flex gap-4 pointer-events-auto">
          <button 
            onClick={prevSlide}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-ruby hover:border-ruby transition-all active:scale-90"
          >
            <div className="rotate-180"><Icons.ChevronRight /></div>
          </button>
          <button 
            onClick={nextSlide}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-ruby hover:border-ruby transition-all active:scale-90"
          >
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* Auto-play Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-ruby/30 w-full z-40">
        <div 
          key={activeIndex}
          className="h-full bg-ruby animate-progress-bar"
          style={{ animationDuration: `${autoPlayInterval}ms` }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-bar {
          animation-name: progress-bar;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}} />
    </div>
  );
}
