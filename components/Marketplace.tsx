
import React, { useState, useMemo, useEffect } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, GenderTarget, Employee } from '../types';
import { CATEGORIES } from '../data/categories';
import { MOCK_PROVIDERS } from '../data/mockProviders';

interface MarketplaceProps {
  onSelectProvider: (p: ProviderProfile) => void;
  onViewOnMap: () => void;
}

type SortOption = 'rating' | 'price_low' | 'price_high' | 'reviews';

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectProvider, onViewOnMap }) => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<GenderTarget>('feminino');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const availableCategories = useMemo(() => {
    return CATEGORIES.filter(c => c.publico === gender);
  }, [gender]);

  // Lógica para transformar funcionários em entidades independentes no radar
  const allDiscoverableEntities = useMemo(() => {
    const entities: ProviderProfile[] = [];
    
    MOCK_PROVIDERS.forEach(provider => {
      // Adiciona o Salão/Profissional Principal
      entities.push(provider);

      // Se for um salão com equipe, adiciona cada profissional como entidade indepedente
      if (provider.employees && provider.employees.length > 0) {
        provider.employees.forEach(emp => {
          entities.push({
            id: `emp-${emp.id}`,
            userId: emp.id,
            businessName: emp.name,
            bio: `${emp.role} @ ${provider.businessName}. Especialista elite da nossa equipe.`,
            location: emp.location || provider.location,
            rating: 4.9, // Herdado ou fixo para novos
            reviewCount: 20,
            portfolio: [emp.photoUrl, ...provider.portfolio],
            services: provider.services, // HERANÇA DE SERVIÇOS
            planTier: 'GOLD',
            hasActiveSubscription: true
          });
        });
      }
    });

    return entities;
  }, []);

  const filteredEntities = useMemo(() => {
    return allDiscoverableEntities.filter(p => {
      const matchesSearch = p.businessName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategoryId 
        ? p.services.some(s => s.categoryId === activeCategoryId) 
        : true;
      const providerGenderMatch = gender === 'feminino' 
        ? p.services.some(s => s.categoryId.startsWith('f-'))
        : p.services.some(s => s.categoryId.startsWith('m-'));

      return matchesSearch && matchesCategory && providerGenderMatch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      const aMinPrice = Math.min(...(a.services?.map(s => s.price) || [0]));
      const bMinPrice = Math.min(...(b.services?.map(s => s.price) || [0]));
      return sortBy === 'price_low' ? aMinPrice - bMinPrice : bMinPrice - aMinPrice;
    });
  }, [search, gender, activeCategoryId, sortBy, allDiscoverableEntities]);

  return (
    <div className="space-y-16 pb-40 animate-fade-in">
      {/* HEADER EDITORIAL */}
      <header className="space-y-12 px-4 md:px-0">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-16 h-[2px] bg-ruby"></div>
              <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Curadoria Profissional</p>
           </div>
           <h2 className="text-5xl md:text-9xl font-serif font-black text-onyx dark:text-white leading-[0.8] tracking-tighter">
              Elite <br /> <span className="italic font-normal text-gold underline decoration-gold/10">Directory.</span>
           </h2>
        </div>

        {/* BUSCA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
           <div className="md:col-span-8 relative group">
              <div className="absolute inset-y-0 left-8 flex items-center text-quartz">
                 <Icons.Search />
              </div>
              <input 
                type="text" 
                placeholder="Qual ritual ou artista você deseja?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-darkCard border border-quartz/10 rounded-[40px] py-8 pl-24 pr-10 outline-none focus:ring-[15px] focus:ring-ruby/5 transition-all text-xl dark:text-white shadow-2xl"
              />
           </div>
           <div className="md:col-span-4 flex gap-4">
              <button onClick={() => setGender('feminino')} className={`flex-1 py-6 rounded-[30px] text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'feminino' ? 'bg-ruby text-white' : 'bg-white dark:bg-darkCard text-quartz'}`}>Feminino</button>
              <button onClick={() => setGender('masculino')} className={`flex-1 py-6 rounded-[30px] text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'masculino' ? 'bg-onyx dark:bg-white text-white dark:text-onyx' : 'bg-white dark:bg-darkCard text-quartz'}`}>Masculino</button>
           </div>
        </div>
      </header>

      {/* GRELHA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 px-4 md:px-0">
         {filteredEntities.map((entity, idx) => (
           <div 
             key={entity.id}
             onClick={() => onSelectProvider(entity)}
             className="group cursor-pointer animate-fade-in relative flex flex-col"
             style={{ animationDelay: `${idx * 80}ms` }}
           >
              <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden luxury-shadow border border-quartz/10 dark:border-white/5 bg-offwhite group-hover:border-ruby transition-all duration-700">
                 <img src={entity.portfolio[0]} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/20 to-transparent"></div>
                 
                 <div className="absolute top-6 left-6">
                    <div className="bg-white/10 backdrop-blur-3xl p-4 rounded-[22px] border border-white/20 text-gold">
                       <Icons.Star filled />
                    </div>
                 </div>

                 <div className="absolute bottom-10 left-10 right-10 space-y-2">
                    <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em]">{entity.location.address.split(',')[1] || 'Luanda'}</p>
                    <h3 className="text-2xl font-serif font-black text-white leading-tight italic">{entity.businessName}</h3>
                    {entity.id.startsWith('emp-') && <span className="text-[8px] font-black text-gold uppercase tracking-[0.2em] bg-gold/10 px-3 py-1 rounded-full">Artista Equipe Elite</span>}
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Marketplace;
