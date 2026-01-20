
import React, { useState, useMemo } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, UserRole } from '../types';
import { GlowCarousel } from './GlowCarousel';

interface HomeProps {
  providers: ProviderProfile[];
  onStartExploring: (view?: string) => void;
  onSelectProvider?: (p: ProviderProfile) => void;
  onOpenChat?: (providerName: string) => void;
  userRole?: UserRole;
}

const Home: React.FC<HomeProps> = ({ providers, onStartExploring, onSelectProvider }) => {
  const recommendedProviders = useMemo(() => {
    return providers.filter(p => ['GOLD', 'DIAMOND', 'ANNUAL', 'BLACK'].includes(p.planTier || ''));
  }, [providers]);

  return (
    <div className="space-y-24 md:space-y-32 pb-32">
      {/* CINEMATIC HERO */}
      <section className="relative h-[80vh] md:h-[90vh] rounded-[50px] md:rounded-[70px] overflow-hidden group luxury-shadow border border-quartz/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-[12s] ease-out"
            alt="Elite Beauty"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/30 to-onyx/90"></div>
        </div>
        
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6 space-y-12">
          <div className="space-y-6 max-w-4xl animate-fade-in">
             <div className="flex items-center gap-4 justify-center">
               <span className="w-12 h-[2px] bg-ruby/50"></span>
               <p className="text-ruby text-[10px] md:text-xs font-black uppercase tracking-[0.7em]">Angola Private Network</p>
               <span className="w-12 h-[2px] bg-ruby/50"></span>
             </div>
             <h1 className="text-6xl md:text-[10rem] font-serif font-black text-white leading-[0.9] tracking-tighter">
               Beleza <br />
               <span className="italic font-normal text-gold drop-shadow-2xl">GLOW</span>
             </h1>
             <p className="text-quartz text-sm md:text-xl font-medium max-w-2xl mx-auto italic opacity-80">
                A curadoria definitiva dos rituais mais exclusivos de Luanda.
             </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => onStartExploring('services')}
                className="flex-1 py-6 bg-gold text-onyx rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-gold/20"
              >
                <Icons.Briefcase /> Serviços Elite
              </button>
              <button 
                onClick={() => onStartExploring('discover')}
                className="flex-1 py-6 bg-ruby text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_20px_50px_rgba(157,23,77,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
              >
                <Icons.Search /> Artistas Pro
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => onStartExploring('my-appointments')}
                className="flex-1 py-5 bg-white/10 backdrop-blur-2xl text-white rounded-full font-black uppercase tracking-[0.3em] text-[9px] shadow-2xl hover:bg-ruby transition-all flex items-center justify-center gap-3 border border-white/20 active:scale-95"
              >
                <Icons.Calendar /> Meus Compromissos
              </button>
              <button 
                onClick={() => onStartExploring('map')}
                className="flex-1 py-5 bg-white/10 backdrop-blur-2xl text-white rounded-full font-black uppercase tracking-[0.3em] text-[9px] shadow-2xl hover:bg-white hover:text-onyx transition-all flex items-center justify-center gap-3 border border-white/20 active:scale-95"
              >
                <Icons.Map /> Radar Live
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEASON HIGHLIGHTS */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
           <p className="text-ruby text-[11px] font-black uppercase tracking-[0.8em]">Patentes de Ouro</p>
           <h3 className="text-4xl md:text-8xl font-serif font-black italic dark:text-white leading-none tracking-tighter">Seleção <span className="text-gold">Privada.</span></h3>
        </div>

        <div className="max-w-[1400px] mx-auto">
          {recommendedProviders.length > 0 ? (
            <GlowCarousel<ProviderProfile> 
              items={recommendedProviders}
              renderItem={(provider, isActive) => (
                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                  <div className="relative h-[55%] md:h-full md:w-3/5 overflow-hidden">
                    <img 
                      src={provider.portfolio[0]} 
                      className={`w-full h-full object-cover transition-transform duration-[15s] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`} 
                      alt={provider.businessName} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-onyx/90 via-transparent to-transparent"></div>
                  </div>

                  <div className="h-[45%] md:h-full md:w-2/5 bg-darkCard md:bg-onyx p-10 md:p-20 flex flex-col justify-center text-center md:text-left space-y-8 relative">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                           <span className="text-gold"><Icons.Star filled className="w-4 h-4" /></span>
                           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Membro de Prestígio</span>
                        </div>
                        <h4 className="text-4xl md:text-7xl font-serif font-black text-white italic leading-[0.85] tracking-tighter">{provider.businessName}</h4>
                        <p className="text-quartz text-sm md:text-lg font-medium italic opacity-60 leading-relaxed line-clamp-3">"{provider.bio}"</p>
                     </div>
                     <button 
                        onClick={() => onSelectProvider?.(provider)}
                        className="w-full py-6 bg-ruby text-white rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(157,23,77,0.4)] active:scale-95 hover:brightness-110 transition-all"
                     >Solicitar Ritual</button>
                  </div>
                </div>
              )}
            />
          ) : (
            <div className="py-32 text-center opacity-20 border-4 border-dashed border-quartz/10 rounded-[60px]">
               <p className="font-serif italic text-3xl">Radar em busca de talentos...</p>
            </div>
          )}
        </div>
      </section>

      {/* EXPLORAR TODOS */}
      <section className="space-y-20">
        <div className="text-center space-y-4">
           <h3 className="text-4xl md:text-6xl font-serif font-black italic dark:text-white leading-none">Radar de <span className="text-ruby">Especialistas.</span></h3>
           <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.5em]">Conectando você ao topo da beleza</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 max-w-6xl mx-auto px-4">
          {providers.length > 0 ? providers.map((p) => (
            <div 
              key={p.id} 
              className="group cursor-pointer space-y-6 animate-fade-in" 
              onClick={() => onSelectProvider?.(p)}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[40px] md:rounded-[50px] shadow-2xl border border-quartz/10 bg-darkCard">
                <img src={p.portfolio[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[15%] group-hover:grayscale-0" alt={p.businessName} />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-8 left-8 right-8 text-center md:text-left">
                   <p className="text-gold text-[8px] font-black uppercase tracking-widest mb-1">Elite Certified</p>
                   <h4 className="text-white font-serif font-black text-xl italic leading-tight truncate">{p.businessName}</h4>
                </div>
              </div>
              <button className="w-full py-4 bg-white/5 dark:bg-white/5 text-onyx dark:text-white border border-quartz/20 rounded-full text-[8px] font-black uppercase tracking-[0.3em] hover:bg-ruby hover:text-white transition-all active:scale-95">Ver Biografia</button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center opacity-20 italic font-serif text-2xl">Aguardando sinais do ecossistema...</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
