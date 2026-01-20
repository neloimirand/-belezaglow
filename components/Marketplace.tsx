
import React, { useState, useMemo } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, GenderTarget } from '../types';
import GlowImage from './GlowImage';

interface MarketplaceProps {
  onSelectProvider: (p: ProviderProfile) => void;
  onViewOnMap: () => void;
  providers: ProviderProfile[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectProvider, onViewOnMap, providers }) => {
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return providers.filter(p => p.businessName.toLowerCase().includes(term));
  }, [search, providers]);

  return (
    <div className="space-y-12 pb-40 animate-fade-in">
      <header className="flex flex-col items-center text-center gap-8 px-4">
        <div className="space-y-2">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Ecossistema Sincronizado</p>
          <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">Elite <span className="text-gold">Radar.</span></h2>
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-quartz group-focus-within:text-ruby transition-colors"><Icons.Search /></span>
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Encontrar Maison ou Artista..." 
              className="w-full rounded-[25px] py-5 pl-16 pr-6 border border-quartz/10 outline-none dark:bg-darkCard dark:text-white font-bold text-sm shadow-xl focus:border-ruby transition-all" 
            />
          </div>
          <button 
            onClick={onViewOnMap} 
            className="w-full py-5 bg-ruby text-white rounded-[25px] font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            <Icons.Map /> Visualizar no Mapa Live
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-2">
        {filtered.map((p) => (
          <article 
            key={p.id} 
            onClick={() => onSelectProvider(p)} 
            className="group cursor-pointer flex flex-col gap-4 animate-fade-in"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[35px] md:rounded-[45px] luxury-shadow border border-quartz/5 bg-darkCard">
              <GlowImage src={p.portfolio[0]} alt={p.businessName} variant="prestige" className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-gold text-[8px] font-black uppercase tracking-widest mb-1">⭐ {p.rating}</p>
                <h3 className="text-white font-serif font-black italic text-base md:text-xl leading-tight truncate">{p.businessName}</h3>
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-onyx text-white dark:bg-white dark:text-onyx text-[8px] font-black uppercase tracking-widest shadow-lg group-hover:bg-ruby group-hover:text-white transition-all">Perfil Completo</button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
