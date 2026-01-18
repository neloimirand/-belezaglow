
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User, Service, AppointmentStatus } from '../types';

interface ProfessionalPanelProps {
  user: User | null;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  onNavigate: (tab: string) => void;
}

const ProfessionalPanel: React.FC<ProfessionalPanelProps> = ({ user, onActionNotify, onNavigate }) => {
  const stats = [
    { label: 'Hoje', value: '32.500 Kz', icon: <Icons.Dollar />, color: 'text-emerald' },
    { label: 'Pedidos', value: '4', icon: <Icons.Message />, color: 'text-ruby' },
    { label: 'Visitas', value: '128', icon: <Icons.Search />, color: 'text-gold' },
    { label: 'Rating', value: '5.0', icon: <Icons.Star filled />, color: 'text-onyx dark:text-white' },
  ];

  const quickActions = [
    { id: 'bookings', label: 'Minha Agenda', icon: <Icons.Calendar />, color: 'bg-ruby' },
    { id: 'finance', label: 'Finanças', icon: <Icons.Dollar />, color: 'bg-emerald' },
    { id: 'marketing', label: 'Glow Ads', icon: <Icons.Award />, color: 'bg-gold' },
    { id: 'profile', label: 'Meu Perfil', icon: <Icons.User />, color: 'bg-onyx dark:bg-white dark:text-onyx' },
  ];

  const handleApplyStrategy = () => {
    onActionNotify("Estratégia Aplicada", "O Glow Ads foi otimizado para sua categoria 'Corte Masculino'.", "success");
  };

  return (
    <div className="space-y-10 animate-fade-in pb-40">
      <header className="flex justify-between items-center px-4">
        <div className="space-y-1">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.4em]">Console do Artista</p>
          <h2 className="text-4xl font-serif font-black dark:text-white italic tracking-tighter">
            Olá, <span className="text-gold">{user?.name?.split(' ')[0] || 'Expert'}</span>.
          </h2>
          {(!user?.planTier || user?.planTier === 'FREE') && (
            <button 
              onClick={() => onNavigate('plans')}
              className="mt-2 flex items-center gap-2 bg-ruby text-white px-5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest animate-bounce shadow-xl"
            >
              <Icons.Star filled /> Ativar Patente Pro
            </button>
          )}
        </div>
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-ruby shadow-xl">
           <img src={user?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200'} className="w-full h-full object-cover" />
        </div>
      </header>

      <section className="px-4">
         <div className="bg-onyx dark:bg-darkCard p-8 rounded-[45px] text-white luxury-shadow relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10 space-y-6">
               <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 bg-ruby/20 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-ruby">
                     <div className="w-1.5 h-1.5 bg-ruby rounded-full animate-ping"></div> Agora
                  </span>
                  <p className="text-quartz text-[9px] font-black uppercase">Faltam 15min</p>
               </div>
               <div>
                  <h3 className="text-3xl font-serif font-black italic">Ana Manuel</h3>
                  <p className="text-gold text-xs font-bold uppercase tracking-widest">Ritual: Corte Sculpting Premium</p>
               </div>
               <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-white text-onyx rounded-2xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Iniciar Ritual</button>
                  <button onClick={() => onNavigate('messages')} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 active:scale-95 transition-all">
                     <Icons.Message />
                  </button>
               </div>
            </div>
         </div>
      </section>

      <section className="px-4">
         <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
               <div key={i} className="bg-white dark:bg-darkCard p-6 rounded-[35px] luxury-shadow border border-quartz/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[8px] font-black uppercase text-quartz tracking-widest">{s.label}</span>
                     <div className={`${s.color} scale-75`}>{s.icon}</div>
                  </div>
                  <p className={`text-2xl font-serif font-black dark:text-white ${s.color}`}>{s.value}</p>
               </div>
            ))}
         </div>
      </section>

      <section className="px-4 space-y-6">
         <h3 className="text-2xl font-serif font-black dark:text-white italic ml-2">Gestão <span className="text-ruby">Glow.</span></h3>
         <div className="grid grid-cols-2 gap-4">
            {quickActions.map(action => (
               <button 
                key={action.id}
                onClick={() => onNavigate(action.id === 'bookings' ? 'bookings' : action.id === 'finance' ? 'management' : action.id)}
                className="bg-white dark:bg-darkCard p-8 rounded-[40px] luxury-shadow border border-quartz/5 flex flex-col items-center gap-4 transition-all active:scale-95 group"
               >
                  <div className={`w-16 h-16 ${action.color} rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform`}>
                     {action.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-onyx dark:text-white">{action.label}</span>
               </button>
            ))}
         </div>
      </section>

      <section className="px-4">
         <div className="bg-gradient-to-br from-ruby/5 to-gold/5 p-10 rounded-[50px] border border-ruby/10 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-ruby text-white rounded-xl flex items-center justify-center shadow-lg"><Icons.Star filled /></div>
               <p className="text-[10px] font-black uppercase text-ruby tracking-widest">Glow Business IA</p>
            </div>
            <p className="text-lg font-serif italic text-stone-600 dark:text-quartz leading-relaxed">
              "Seu faturamento aumentou 12% esta semana. Sugerimos ativar o <b>Glow Ads</b> para sua categoria 'Corte Masculino' nas próximas 48h para maximizar a agenda de fim de semana."
            </p>
            <button 
              onClick={handleApplyStrategy}
              className="text-ruby font-black uppercase text-[9px] tracking-[0.3em] underline underline-offset-8 hover:text-ruby/70 transition-colors"
            >
              Aplicar estratégia agora
            </button>
         </div>
      </section>
    </div>
  );
};

export default ProfessionalPanel;
