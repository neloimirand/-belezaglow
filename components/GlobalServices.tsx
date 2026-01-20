
import React, { useState, useMemo } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, Service } from '../types';
import GlowImage from './GlowImage';

interface GlobalServicesProps {
  providers: ProviderProfile[];
  onSelectService: (provider: ProviderProfile, service: Service) => void;
}

const GlobalServices: React.FC<GlobalServicesProps> = ({ providers, onSelectService }) => {
  const [search, setSearch] = useState('');

  const allServices = useMemo(() => {
    const flattened: Array<{ provider: ProviderProfile; service: Service }> = [];
    providers.forEach(p => {
      p.services.forEach(s => {
        flattened.push({ provider: p, service: s });
      });
    });
    
    if (!search.trim()) return flattened;
    
    const term = search.toLowerCase();
    return flattened.filter(item => 
      item.service.name.toLowerCase().includes(term) || 
      item.provider.businessName.toLowerCase().includes(term)
    );
  }, [providers, search]);

  return (
    <div className="space-y-12 pb-40 animate-fade-in">
      <header className="flex flex-col items-center text-center gap-8 px-4">
        <div className="space-y-2">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Catálogo de Experiências</p>
          <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">Menu de <span className="text-gold">Rituais.</span></h2>
        </div>
        
        <div className="w-full max-w-2xl relative group">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-quartz group-focus-within:text-ruby transition-colors"><Icons.Search /></span>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Qual ritual de beleza você busca hoje?" 
            className="w-full rounded-[30px] py-6 pl-16 pr-8 border border-quartz/10 outline-none dark:bg-darkCard dark:text-white font-bold text-base shadow-xl focus:border-ruby transition-all" 
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {allServices.length > 0 ? allServices.map(({ provider, service }) => (
          <article 
            key={`${provider.id}-${service.id}`}
            onClick={() => onSelectService(provider, service)}
            className="group bg-white dark:bg-darkCard rounded-[45px] overflow-hidden luxury-shadow border border-quartz/5 hover:border-ruby/30 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="relative aspect-video overflow-hidden">
               <GlowImage src={service.photoUrl || ''} alt={service.name} variant="prestige" className="w-full h-full" />
               <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent"></div>
               <div className="absolute top-4 left-4">
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border border-white/10">Ritual de Patente</span>
               </div>
            </div>
            
            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl overflow-hidden border border-quartz/10">
                        <img src={provider.portfolio[0]} className="w-full h-full object-cover" />
                     </div>
                     <p className="text-ruby text-[9px] font-black uppercase tracking-widest truncate">{provider.businessName}</p>
                  </div>
                  <h3 className="text-2xl font-serif font-black dark:text-white italic leading-tight">{service.name}</h3>
                  <p className="text-stone-500 dark:text-quartz text-xs line-clamp-2 italic leading-relaxed">{service.specification || "Uma experiência exclusiva desenhada sob medida para realçar sua essência."}</p>
               </div>

               <div className="pt-6 border-t border-quartz/5 flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-2xl font-serif font-black text-gold">{service.price.toLocaleString()} Kz</p>
                     <p className="text-[8px] font-bold text-quartz uppercase tracking-widest">{service.durationMinutes} min de ritual</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectService(provider, service); }}
                    className="px-6 py-3 bg-ruby text-white rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-lg group-hover:scale-105 transition-all"
                  >
                    Agendar
                  </button>
               </div>
            </div>
          </article>
        )) : (
          <div className="col-span-full py-32 text-center opacity-20 border-4 border-dashed border-quartz/10 rounded-[60px]">
             <p className="font-serif italic text-3xl">Nenhum ritual encontrado no radar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalServices;
