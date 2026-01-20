
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icons } from '../constants';
import { UserRole, Service, Employee, User } from '../types';
import Finance from './Finance';
import RitualCurator from './RitualCurator';
import PortfolioManager from './PortfolioManager';
import EmployeeManager from './EmployeeManager';
import { supabase } from '../lib/supabase';

type TabKey = 'Dashboard' | 'Agenda' | 'Rituais' | 'Finanças' | 'Galeria' | 'Team' | 'SMS';

interface ProviderManagementProps {
  user: User | null;
  role: UserRole;
  onLogout?: () => void;
  onActionNotify?: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  onOpenChatWithClient?: (name: string) => void;
  onNavigate?: (tab: string) => void;
}

const ProviderManagement: React.FC<ProviderManagementProps> = ({ 
  user,
  onActionNotify, 
  role,
  onNavigate
}) => {
  const isSalon = role === UserRole.SALON;
  const [activeTab, setActiveTab] = useState<TabKey>('Dashboard');
  const [receivedSms, setReceivedSms] = useState<any[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchProfessionalContext = useCallback(async () => {
    if (!user) return;
    try {
      const { data: sms } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (sms) setReceivedSms(sms);

      const { data: svs } = await supabase.from('services').select('*').eq('provider_id', user.id);
      if (svs) {
        setServices(svs.map(s => ({
          id: s.id,
          providerId: s.provider_id,
          name: s.name,
          price: s.price,
          durationMinutes: s.duration,
          categoryId: s.category_id,
          specification: s.description,
          photoUrl: s.photo_url
        })));
      }

      const { data: emps } = await supabase.from('profiles').select('*').eq('role', 'PROFESSIONAL');
      if (emps) {
        setEmployees(emps.map(e => ({
          id: e.id,
          name: e.full_name,
          role: e.bio || 'Artista Elite',
          photoUrl: e.photo_url,
          commissionPercent: 30,
          active: true,
          services: [],
          location: { address: e.address || '', latitude: e.lat || 0, longitude: e.lng || 0 }
        })));
      }

    } catch (err) {
      console.error("Erro na sincronização:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchProfessionalContext();
  }, [fetchProfessionalContext]);

  const quickActions = [
    { id: 'Agenda', label: 'Meus Compromissos', icon: <Icons.Calendar />, color: 'from-ruby to-pink-600' },
    { id: 'SMS', label: 'Sinais SMS', icon: <Icons.Message />, color: 'from-onyx to-stone-800' },
    { id: 'Rituais', label: 'Menu Rituais', icon: <Icons.Plus />, color: 'from-gold to-amber-700' },
    { id: 'Team', label: 'Equipe Maison', icon: <Icons.User />, color: 'from-purple-600 to-indigo-800' },
    { id: 'Finanças', label: 'Cofre Maison', icon: <Icons.Dollar />, color: 'from-blue-700 to-indigo-900' },
    { id: 'Galeria', label: 'Portfólio', icon: <Icons.Gallery />, color: 'from-purple-700 to-fuchsia-900' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Rituais': return <RitualCurator user={user} services={services} onUpdateServices={fetchProfessionalContext} onActionNotify={onActionNotify!} />;
      case 'Galeria': return <PortfolioManager images={portfolio} onUpdateImages={setPortfolio} onActionNotify={onActionNotify!} />;
      case 'Finanças': return <Finance />;
      case 'Team': return <EmployeeManager employees={employees} salonServices={services} onUpdateEmployees={fetchProfessionalContext} onActionNotify={onActionNotify!} />;
      case 'Agenda': return <div className="py-20 text-center italic opacity-30">A aba de compromissos globais está sendo usada.</div>;
      case 'SMS': return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto px-4">
           <header className="text-center space-y-2">
              <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Governança Central</p>
              <h3 className="text-3xl font-serif font-black dark:text-white italic">Sinais Recentes</h3>
           </header>
           {receivedSms.length > 0 ? receivedSms.map(sms => (
             <div key={sms.id} className="p-8 bg-white dark:bg-darkCard rounded-[40px] border border-quartz/10 shadow-xl">
                <p className="text-ruby font-black text-[9px] uppercase mb-2">{new Date(sms.created_at).toLocaleDateString()}</p>
                <h4 className="font-serif font-black text-xl italic dark:text-white">{sms.title}</h4>
                <p className="text-stone-500 dark:text-quartz text-sm mt-2 italic leading-relaxed">"{sms.message}"</p>
             </div>
           )) : <div className="py-20 text-center opacity-30 italic font-serif text-xl">Nenhum sinal no radar.</div>}
        </div>
      );
      default: return <div className="py-20 text-center opacity-30 italic font-serif text-2xl">Módulo em sincronização...</div>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-40 overflow-hidden">
      
      {activeTab === 'Dashboard' && (
        <header className="flex flex-col items-center justify-center p-12 md:p-20 text-center gap-8">
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[45px] overflow-hidden border-4 border-gold/30 shadow-2xl relative z-10">
              <img src={user?.photoUrl || 'https://images.unsplash.com/photo-1512690196152-74472f1289df?q=80&w=400'} className="w-full h-full object-cover" alt="Perfil" />
            </div>
            <div className="absolute inset-0 bg-gold/20 rounded-[45px] blur-2xl animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">{isSalon ? 'Maison Glow Pro' : 'Artista Glow Pro'}</p>
            <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
              Olá, <span className="text-gold">{user?.name?.split(' ')[0]}</span>.
            </h2>
            <p className="text-quartz text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Status: Online & Ativo</p>
          </div>
        </header>
      )}

      <main>
        {activeTab === 'Dashboard' ? (
          <div className="space-y-24">
            <section className="space-y-10">
               <div className="text-center space-y-2">
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">Terminal de Comando</p>
                  <h3 className="text-3xl md:text-5xl font-serif font-black dark:text-white italic">Gestão <span className="text-ruby italic">Elite.</span></h3>
               </div>

               <div className="relative w-full">
                 <div ref={carouselRef} className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-[25vw] py-12">
                    {quickActions.map(action => (
                      <button 
                        key={action.id} 
                        onClick={() => {
                          if (action.id === 'Agenda') {
                            if (onNavigate) {
                              onNavigate('my-appointments');
                            } else {
                              // Fallback caso a prop não exista (não deve ocorrer agora)
                              window.dispatchEvent(new CustomEvent('changeTab', { detail: 'my-appointments' }));
                            }
                          } else {
                            setActiveTab(action.id as TabKey);
                          }
                        }} 
                        className="min-w-[160px] md:min-w-[240px] snap-center bg-white dark:bg-darkCard p-10 rounded-[50px] luxury-shadow border border-quartz/10 flex flex-col items-center gap-6 transition-all active:scale-90 group hover:border-ruby/40 hover:-translate-y-2"
                      >
                        <div className={`w-18 h-18 bg-gradient-to-br ${action.color} rounded-[30px] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform`}>
                          {action.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-onyx dark:text-white whitespace-nowrap">{action.label}</span>
                      </button>
                    ))}
                    <div className="min-w-[25vw] shrink-0"></div>
                 </div>
               </div>
            </section>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in px-4">
             <div className="flex flex-col items-center gap-4">
                <button onClick={() => setActiveTab('Dashboard')} className="px-10 py-4 bg-white dark:bg-darkCard rounded-full text-[9px] font-black uppercase tracking-widest text-ruby border border-quartz/10 shadow-xl active:scale-95 transition-all">← Console de Comando</button>
                <div className="h-[1px] w-20 bg-ruby/20"></div>
             </div>
             <div className="min-h-[500px]">{renderActiveTab()}</div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
      `}} />
    </div>
  );
};

export default ProviderManagement;
