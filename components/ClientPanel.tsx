
import React, { useMemo, useState, useEffect } from 'react';
import { Icons } from '../constants';
import { User, AppointmentStatus, ProviderProfile } from '../types';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { supabase } from '../lib/supabase';

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
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');
  const [smsSignals, setSmsSignals] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchSignals = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setSmsSignals(data);
    };
    
    fetchSignals();

    // ESCUTA REAL-TIME PARA O CLIENTE
    const channel = supabase.channel(`sms-client-${user.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        setSmsSignals(prev => [payload.new, ...prev]);
        onActionNotify("Novo Sinal VIP", payload.new.message, "success");
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const filteredProviders = useMemo(() => {
    let list = [...MOCK_PROVIDERS].filter(p =>
      p.businessName.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, sortBy]);

  return (
    <div className="space-y-12 animate-fade-in pb-40 px-4 md:px-0">
      
      <header className="bg-white dark:bg-darkCard p-8 rounded-[40px] luxury-shadow border border-quartz/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em]">Membro Oficial Glow</p>
          <h2 className="text-4xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
            Olá, <span className="text-gold">{user?.name?.split(' ')[0] || 'Membro'}</span>.
          </h2>
        </div>
        <div className="bg-ruby/10 px-8 py-4 rounded-3xl border border-ruby/10">
           <p className="text-[8px] font-black uppercase text-ruby tracking-[0.2em] mb-1">Meus Glow Points</p>
           <p className="text-3xl font-serif font-black text-ruby leading-none">{user?.glowPoints || 1250}</p>
        </div>
      </header>

      {/* CARROSSEL DE SINAIS SMS DO ADM */}
      {smsSignals.length > 0 && (
        <section className="space-y-6">
           <div className="flex items-center gap-3 ml-4">
              <div className="w-1.5 h-1.5 bg-ruby rounded-full animate-ping"></div>
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-ruby">Sinais de Governança</h3>
           </div>
           <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
              {smsSignals.map((sms) => (
                <div key={sms.id} className="min-w-[300px] snap-center bg-onyx dark:bg-darkCard p-8 rounded-[45px] text-white border border-white/10 luxury-shadow relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-ruby/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                   <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-center">
                         <Icons.Message />
                         <span className="text-[7px] font-black text-quartz uppercase">Enviado em {new Date(sms.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-serif font-black italic text-lg text-gold">{sms.title}</h4>
                      <p className="text-xs text-quartz leading-relaxed line-clamp-3">"{sms.message}"</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* RADAR ELITE */}
      <section className="space-y-10">
        <h3 className="text-3xl font-serif font-black dark:text-white italic px-4">Elite <span className="text-gold">Radar.</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {filteredProviders.map((p, idx) => (
            <article key={p.id} className="group bg-white dark:bg-darkCard rounded-[40px] overflow-hidden luxury-shadow border border-quartz/5 flex flex-col transition-all active:scale-[0.98]">
              <div className="relative aspect-[4/5] overflow-hidden" onClick={() => onSelectProvider(p)}>
                 <img src={p.portfolio[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent"></div>
                 <div className="absolute bottom-5 left-5">
                    <p className="text-gold text-[7px] font-black uppercase mb-1">⭐ {p.rating}</p>
                    <h4 className="text-white font-serif font-black text-sm italic leading-tight truncate">{p.businessName}</h4>
                 </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                 <p className="text-ruby font-black text-sm mb-4">{p.services[0]?.price.toLocaleString()} Kz</p>
                 <button onClick={() => onSelectProvider(p)} className="w-full py-3 bg-onyx dark:bg-white dark:text-onyx text-white rounded-xl text-[7px] font-black uppercase tracking-widest transition-all group-hover:bg-ruby group-hover:text-white">Agendar</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientPanel;
