
import React, { useMemo, useState } from 'react';
import { Icons } from '../constants';
import { User, AppointmentStatus, ProviderProfile } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';

interface ClientPanelProps {
  user: User | null;
  bookings: any[];
  onNavigate: (tab: string) => void;
  onSelectProvider: (p: ProviderProfile) => void;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const ClientPanel: React.FC<ClientPanelProps> = ({ 
  user, 
  bookings, 
  onNavigate, 
  onSelectProvider, 
  onActionNotify 
}) => {
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');
  const [favorites, setFavorites] = useState<string[]>([]);

  const nextBooking = useMemo(() => 
    bookings.find(b => b.status === AppointmentStatus.CONFIRMED),
  [bookings]);

  const filteredProviders = useMemo(() => {
    let list = [...MOCK_PROVIDERS].filter(p =>
      p.businessName.toLowerCase().includes(search.toLowerCase()) &&
      (filterService ? p.services.some(s => s.name.includes(filterService)) : true)
    );

    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price') list.sort((a, b) => (a.services[0]?.price || 0) - (b.services[0]?.price || 0));
    if (sortBy === 'distance') list.sort((a, b) => Number(a.id) - Number(b.id));

    return list;
  }, [search, filterService, sortBy]);

  const toggleFavorite = (providerId: string, name: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(providerId);
      onActionNotify(
        isFav ? "Removido" : "Favoritado", 
        `${name} ${isFav ? 'saiu do seu radar.' : 'agora é um favorito.'}`, 
        isFav ? "info" : "success"
      );
      return isFav ? prev.filter(id => id !== providerId) : [...prev, providerId];
    });
  };

  return (
    <div className="space-y-16 animate-fade-in pb-40 px-4 md:px-0">
      
      {/* HEADER EM GRELHA */}
      <header className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white dark:bg-darkCard p-8 rounded-[40px] luxury-shadow border border-quartz/10 transition-all">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em]">Experiência Customizada</p>
          <h2 className="text-4xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
            Olá, <span className="text-gold">{user?.name?.split(' ')[0] || 'Membro'}</span>.
          </h2>
          <p className="text-quartz text-[10px] font-medium mt-2">Bem-vindo à sua central de rituais exclusivos.</p>
        </div>
        <div className="flex justify-center md:justify-end gap-10 border-t md:border-t-0 md:border-l border-quartz/10 pt-6 md:pt-0 md:pl-10">
           <div className="text-center md:text-right">
              <p className="text-[8px] font-black uppercase text-quartz tracking-[0.2em] mb-1">Glow Points</p>
              <p className="text-3xl font-serif font-black text-ruby leading-none">{user?.glowPoints || 1250}</p>
           </div>
        </div>
      </header>

      {/* PRÓXIMO AGENDAMENTO */}
      {nextBooking && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-4">
             <div className="w-2 h-2 bg-ruby rounded-full animate-ping"></div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ruby">Seu Próximo Ritual</h3>
          </div>
          <div className="bg-onyx dark:bg-darkCard p-10 rounded-[45px] text-white luxury-shadow relative overflow-hidden border border-white/5 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter leading-none">{nextBooking.serviceName}</h4>
                <p className="text-gold text-sm font-bold uppercase tracking-[0.3em]">{nextBooking.providerName}</p>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                 <div className="col-span-2 md:col-span-1">
                    <p className="text-[8px] font-black uppercase text-quartz mb-1 tracking-widest">Horário Marcado</p>
                    <p className="font-bold text-lg">{nextBooking.date} • {nextBooking.time}</p>
                 </div>
                 <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                    <button 
                      onClick={() => onNavigate('bookings')}
                      className="w-full py-4 bg-white text-onyx rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Icons.Calendar /> Remarcar
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GRELHA DE RADAR */}
      <section className="space-y-10">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-3xl font-serif font-black dark:text-white italic tracking-tighter">Elite <span className="text-gold">Radar.</span></h3>
           <div className="flex gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-onyx dark:bg-white text-white dark:text-onyx px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
              >
                <option value="rating">Top Avaliados</option>
                <option value="price">Menor Preço</option>
              </select>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {filteredProviders.map((p, idx) => (
            <article 
              key={p.id} 
              className="group bg-white dark:bg-darkCard rounded-[40px] overflow-hidden luxury-shadow border border-quartz/5 flex flex-col animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden" onClick={() => onSelectProvider(p)}>
                 <img src={p.portfolio[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent"></div>
                 <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id, p.businessName); }}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
                    favorites.includes(p.id) ? 'bg-ruby text-white' : 'bg-white/20 text-white hover:bg-white/40'
                  }`}
                 >
                    <Icons.Heart filled={favorites.includes(p.id)} />
                 </button>
                 <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-gold text-[7px] font-black uppercase tracking-widest mb-1">⭐ {p.rating}</p>
                    <h4 className="text-white font-serif font-black text-base italic leading-tight truncate">{p.businessName}</h4>
                 </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                 <p className="text-ruby font-black text-sm mb-4">{p.services[0]?.price.toLocaleString()} Kz</p>
                 <button 
                  onClick={() => onSelectProvider(p)}
                  className="w-full py-3 bg-onyx dark:bg-white dark:text-onyx text-white rounded-xl text-[7px] font-black uppercase tracking-widest transition-all group-hover:bg-ruby group-hover:text-white"
                 >Agendar</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientPanel;
