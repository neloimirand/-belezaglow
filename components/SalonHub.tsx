
import React, { useState } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, Service, UserRole } from '../types';
import GlowImage from './GlowImage';

interface SalonHubProps {
  salon: ProviderProfile;
  onClose: () => void;
  userRole?: UserRole; 
  onSelectService?: (service: Service) => void;
  onOpenChat?: () => void;
  onOpenDashboard?: () => void;
}

const SalonHub: React.FC<SalonHubProps> = ({ salon, onClose, userRole, onSelectService, onOpenDashboard }) => {
  const [tab, setTab] = useState<'dashboard' | 'services' | 'staff'>('dashboard');
  const isBusinessUser = userRole === UserRole.SALON || userRole === UserRole.PROFESSIONAL;

  const handleWhatsApp = () => {
    // Busca do perfil ou fallback padrão
    const phone = (salon as any).whatsapp || "942644781";
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/244${cleanPhone.length > 9 ? cleanPhone.slice(-9) : cleanPhone}`, '_blank');
  };

  const handleCall = () => {
    const phone = (salon as any).phone || "942644781";
    const cleanPhone = phone.replace(/\D/g, '');
    window.location.href = `tel:+244${cleanPhone.length > 9 ? cleanPhone.slice(-9) : cleanPhone}`;
  };

  return (
    <div className="fixed inset-0 z-[5500] bg-onyx text-white flex flex-col overflow-hidden animate-fade-in">
      <header className="shrink-0 bg-onyx/90 backdrop-blur-3xl border-b border-white/5 px-6 py-5 safe-top flex justify-between items-center">
          <button onClick={onClose} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-ruby transition-all"><div className="rotate-180 scale-110"><Icons.ChevronRight /></div></button>
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg md:text-2xl font-serif font-black italic tracking-tighter truncate uppercase">{salon.businessName}</h1>
            <p className="text-gold text-[7px] font-black uppercase tracking-[0.3em] mt-1 opacity-70">Experiência de Elite Glow</p>
          </div>
          <button onClick={() => {}} className="w-10 h-10 bg-ruby/20 border border-ruby/30 rounded-xl flex items-center justify-center text-ruby"><Icons.Share /></button>
      </header>

      <nav className="shrink-0 bg-onyx/95 border-b border-white/5 overflow-x-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto flex justify-center md:justify-around px-6 gap-6">
          {[ ['dashboard', 'Início'], ['services', 'Rituais'], ['staff', 'Time'] ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as any)} className={`uppercase text-[9px] tracking-[0.2em] font-black py-5 transition-all whitespace-nowrap border-b-2 ${tab === id ? 'border-ruby text-ruby' : 'border-transparent text-quartz'}`}>{label}</button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto scrollbar-hide px-6 py-8">
        <div className="max-w-md mx-auto w-full animate-fade-in space-y-10 pb-20">
          {tab === 'dashboard' && (
            <div className="space-y-8">
              <div className="relative aspect-video rounded-[45px] overflow-hidden luxury-shadow border border-white/5 group">
                 <GlowImage src={salon.portfolio[0]} alt={salon.businessName} variant="prestige" className="w-full h-full" />
                 <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-80"></div>
                 <div className="absolute bottom-6 left-8"><h3 className="text-2xl font-serif font-black italic">Bem-vindo à <br /><span className="text-ruby">Maison.</span></h3></div>
              </div>

              {/* CONTACTOS DIRECTOS */}
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={handleWhatsApp} className="py-5 bg-emerald text-white rounded-[25px] font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                   <Icons.Message /> WhatsApp
                 </button>
                 <button onClick={handleCall} className="py-5 bg-white text-onyx rounded-[25px] font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Ligar
                 </button>
              </div>

              <div className="bg-darkCard p-8 rounded-[40px] border border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-quartz">Avaliação Elite</p>
                  <p className="text-4xl font-serif font-black italic leading-none text-ruby">{salon.rating}</p>
                </div>
                <div className="text-gold scale-150 opacity-40"><Icons.Star filled /></div>
              </div>

              <div className="space-y-4">
                 <p className="text-[9px] font-black uppercase tracking-widest text-quartz ml-4">Narrativa da Maison</p>
                 <p className="text-sm font-medium italic text-quartz leading-relaxed bg-white/5 p-6 rounded-[30px] border border-white/5">"{salon.bio}"</p>
              </div>
            </div>
          )}

          {tab === 'services' && (
            <div className="grid grid-cols-2 gap-4">
              {salon.services.map(s => (
                <div key={s.id} onClick={() => onSelectService?.(s)} className="bg-darkCard rounded-[30px] overflow-hidden border border-white/5 flex flex-col cursor-pointer group transition-all">
                  <div className="aspect-square w-full overflow-hidden">
                    <GlowImage src={s.photoUrl || ''} alt={s.name} variant="prestige" className="w-full h-full" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-serif font-black italic text-[11px] truncate">{s.name}</h3>
                    <p className="text-ruby font-black text-[10px] mt-1">{s.price.toLocaleString()} Kz</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="shrink-0 bg-onyx/90 backdrop-blur-3xl border-t border-white/5 p-6 pb-safe">
        <div className="max-w-md mx-auto">
          {isBusinessUser ? (
            <button onClick={() => { onClose(); onOpenDashboard?.(); }} className="w-full py-5 bg-white text-onyx rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              <Icons.Chart /> Console Profissional
            </button>
          ) : (
            <button onClick={() => setTab('services')} className="w-full py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl">
              <Icons.Calendar /> Reservar Ritual Agora
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default SalonHub;
