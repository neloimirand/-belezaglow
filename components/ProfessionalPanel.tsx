
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { User, Service, AppointmentStatus } from '../types';
import { supabase } from '../lib/supabase';

interface ProfessionalPanelProps {
  user: User | null;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  onNavigate: (tab: string) => void;
}

const ProfessionalPanel: React.FC<ProfessionalPanelProps> = ({ user, onActionNotify, onNavigate }) => {
  const [governanceSms, setGovernanceSms] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchSms = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setGovernanceSms(data);
    };
    fetchSms();
  }, [user]);

  const quickActions = [
    { id: 'bookings', label: 'Minha Agenda', icon: <Icons.Calendar />, color: 'bg-ruby' },
    { id: 'sms_hub', label: 'Sinais SMS', icon: <Icons.Message />, color: 'bg-onyx text-white dark:bg-white dark:text-onyx' },
    { id: 'management', label: 'Cofre Glow', icon: <Icons.Dollar />, color: 'bg-emerald' },
    { id: 'profile', label: 'Meu Perfil', icon: <Icons.User />, color: 'bg-gold' },
  ];

  const handleAction = (id: string) => {
    if (id === 'sms_hub') {
        onNavigate('management'); // Redireciona para o hub de gestão onde os sinais estão agora
    } else {
        onNavigate(id);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-40">
      <header className="flex justify-between items-center px-4">
        <div className="space-y-1">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.4em]">Console do Artista</p>
          <h2 className="text-4xl font-serif font-black dark:text-white italic tracking-tighter">
            Olá, <span className="text-gold">{user?.name?.split(' ')[0] || 'Expert'}</span>.
          </h2>
        </div>
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-ruby shadow-xl">
           <img src={user?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200'} className="w-full h-full object-cover" />
        </div>
      </header>

      {/* SINAIS DO ADM PARA O PROFISSIONAL */}
      {governanceSms.length > 0 && (
        <section className="px-4">
           <div className="bg-ruby/5 border border-ruby/20 p-8 rounded-[45px] space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                 <Icons.Message />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-ruby">Último Sinal da Governança</h4>
              </div>
              <p className="font-serif italic font-bold text-lg dark:text-white leading-tight">"{governanceSms[0].title}"</p>
              <button onClick={() => onNavigate('management')} className="text-ruby font-black uppercase text-[8px] tracking-widest underline underline-offset-4">Abrir Central de Sinais</button>
           </div>
        </section>
      )}

      <section className="px-4 space-y-6">
         <h3 className="text-2xl font-serif font-black dark:text-white italic ml-2">Ações Rápidas <span className="text-ruby">Glow.</span></h3>
         <div className="grid grid-cols-2 gap-4">
            {quickActions.map(action => (
               <button 
                key={action.id}
                onClick={() => handleAction(action.id)}
                className="bg-white dark:bg-darkCard p-8 rounded-[40px] luxury-shadow border border-quartz/5 flex flex-col items-center gap-4 transition-all active:scale-95 group"
               >
                  <div className={`w-16 h-16 ${action.color} rounded-3xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform`}>
                     {action.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-onyx dark:text-white">{action.label}</span>
               </button>
            ))}
         </div>
      </section>
    </div>
  );
};

export default ProfessionalPanel;
