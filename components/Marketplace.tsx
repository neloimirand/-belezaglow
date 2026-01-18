
import React, { useState, useMemo, useEffect } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, GenderTarget, PlanTier } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import GlowImage from './GlowImage';

interface MarketplaceProps {
  onSelectProvider: (p: ProviderProfile) => void;
  onViewOnMap: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectProvider, onViewOnMap }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [gender, setGender] = useState<GenderTarget>('feminino');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredEntities = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return MOCK_PROVIDERS.filter((p) => {
      const matchesSearch = p.businessName.toLowerCase().includes(normalizedSearch);
      const matchesGender = p.services?.some((s) =>
        gender === 'feminino' ? s.categoryId.startsWith('f-') : s.categoryId.startsWith('m-')
      );
      return matchesSearch && matchesGender;
    });
  }, [search, gender]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse text-ruby uppercase tracking-[0.5em] text-[10px] font-black">Sincronizando Radar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-14 pb-40 animate-fade-in px-4">
      <header className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Catálogo de Prestígio</p>
            <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tight dark:text-white italic">Elite <span className="text-gold">Radar.</span></h2>
          </div>
          <button onClick={onViewOnMap} className="p-5 bg-white dark:bg-darkCard rounded-2xl text-ruby border border-quartz/10 shadow-xl active:scale-90 transition-all"><Icons.Map /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-quartz"><Icons.Search /></span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar rituais ou ateliers..." className="w-full rounded-[25px] py-6 pl-16 pr-6 border border-quartz/10 outline-none dark:bg-darkCard dark:text-white font-medium focus:ring-4 focus:ring-ruby/5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setGender('feminino')} className={`rounded-2xl py-4 text-[9px] font-black tracking-widest uppercase transition-all ${gender === 'feminino' ? 'bg-ruby text-white shadow-lg' : 'bg-white dark:bg-darkCard text-quartz'}`}>Feminino</button>
            <button onClick={() => setGender('masculino')} className={`rounded-2xl py-4 text-[9px] font-black tracking-widest uppercase transition-all ${gender === 'masculino' ? 'bg-onyx dark:bg-white text-white dark:text-onyx shadow-lg' : 'bg-white dark:bg-darkCard text-quartz'}`}>Masculino</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {filteredEntities.map((entity, idx) => (
          <article key={entity.id} onClick={() => onSelectProvider(entity)} className="group cursor-pointer flex flex-col gap-5 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[45px] shadow-2xl border border-quartz/5">
              <GlowImage src={entity.portfolio[0]} alt={entity.businessName} variant="prestige" className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-gold text-[7px] font-black uppercase tracking-[0.3em] mb-1">⭐ {entity.rating}</p>
                <h3 className="text-white font-serif font-black italic text-lg leading-tight truncate">{entity.businessName}</h3>
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-onyx text-white dark:bg-white dark:text-onyx text-[9px] font-black uppercase tracking-widest transition-all group-hover:bg-ruby group-hover:text-white shadow-xl">Solicitar Ritual</button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
