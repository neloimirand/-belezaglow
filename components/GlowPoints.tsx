
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User } from '../types';

interface Reward {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  image: string;
  category: 'Upgrade' | 'Cortesia' | 'Produto';
}

interface GlowPointsProps {
  user: User | null;
  onNavigateToBooking: () => void;
}

const GlowPoints: React.FC<GlowPointsProps> = ({ user, onNavigateToBooking }) => {
  const currentPoints = user?.glowPoints || 1250;
  const pointsToNextLevel = 2500;
  const progress = (currentPoints / pointsToNextLevel) * 100;

  const rewards: Reward[] = [
    {
      id: 'r1',
      title: 'Upgrade p/ Lavagem VIP',
      pointsCost: 500,
      description: 'Massagem capilar estendida com óleos essenciais.',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400',
      category: 'Upgrade'
    },
    {
      id: 'r2',
      title: 'Corte de Cortesia',
      pointsCost: 2000,
      description: 'Um ritual completo de corte por nossa conta.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400',
      category: 'Cortesia'
    },
    {
      id: 'r3',
      title: 'Champagne no Ritual',
      pointsCost: 800,
      description: 'Uma taça de Veuve Clicquot durante seu atendimento.',
      image: 'https://images.unsplash.com/photo-1594411133917-80540d998d30?q=80&w=400',
      category: 'Upgrade'
    },
    {
      id: 'r4',
      title: 'Kit Travel L’Occitane',
      pointsCost: 1500,
      description: 'Produtos exclusivos para seus rituais em casa.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400',
      category: 'Produto'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-fade-in pb-40 px-4 md:px-0">
      
      {/* 1. HERO: O COFRE DE PONTOS */}
      <header className="relative bg-onyx rounded-[60px] p-10 md:p-20 overflow-hidden border border-gold/30 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-80 -mt-80 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-ruby/10 rounded-full blur-[80px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
               <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center text-gold shadow-lg">
                  <Icons.Star filled />
               </div>
               <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em]">Clube de Fidelidade Glow</p>
            </div>
            <h2 className="text-5xl md:text-8xl font-serif font-black text-white italic tracking-tighter leading-none">
              Seu Saldo <br /><span className="text-gold">Privado.</span>
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl p-10 md:p-14 rounded-[50px] border border-white/10 text-center space-y-4 min-w-[320px] shadow-2xl">
             <p className="text-quartz text-[11px] font-black uppercase tracking-widest">Glow Points Disponíveis</p>
             <h3 className="text-6xl md:text-8xl font-serif font-black text-gold drop-shadow-lg">{currentPoints.toLocaleString()}</h3>
             <div className="pt-8 space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-quartz">
                   <span>Patente Silver</span>
                   <span className="text-gold">Rumo ao Gold</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-gold transition-all duration-1000 shadow-[0_0_15px_#D4AF37]" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest italic">Faltam {(pointsToNextLevel - currentPoints).toLocaleString()} pontos para elevar seu nível.</p>
             </div>
          </div>
        </div>
      </header>

      {/* 2. COMO GANHAR */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-darkCard p-8 rounded-[40px] border border-quartz/10 luxury-shadow flex items-center gap-6 group">
            <div className="w-14 h-14 bg-ruby/5 rounded-2xl flex items-center justify-center text-ruby group-hover:bg-ruby group-hover:text-white transition-all">
               <Icons.Calendar />
            </div>
            <div>
               <p className="text-onyx dark:text-white font-black text-xs">Agende Rituais</p>
               <p className="text-[9px] text-stone-500 font-bold uppercase">Ganhe 10% do valor em pontos</p>
            </div>
         </div>
         <div className="bg-white dark:bg-darkCard p-8 rounded-[40px] border border-quartz/10 luxury-shadow flex items-center gap-6 group">
            <div className="w-14 h-14 bg-gold/5 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-onyx transition-all">
               <Icons.Star filled />
            </div>
            <div>
               <p className="text-onyx dark:text-white font-black text-xs">Avalie a Maison</p>
               <p className="text-[9px] text-stone-500 font-bold uppercase">+50 pontos por avaliação</p>
            </div>
         </div>
         <div className="bg-white dark:bg-darkCard p-8 rounded-[40px] border border-quartz/10 luxury-shadow flex items-center gap-6 group">
            <div className="w-14 h-14 bg-emerald/5 rounded-2xl flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-white transition-all">
               <Icons.Share />
            </div>
            <div>
               <p className="text-onyx dark:text-white font-black text-xs">Convide Amigas</p>
               <p className="text-[9px] text-stone-500 font-bold uppercase">+500 pontos por ativação</p>
            </div>
         </div>
      </section>

      {/* 3. CATÁLOGO DE RECOMPENSAS */}
      <section className="space-y-10">
         <div className="flex justify-between items-end px-4">
            <div className="space-y-1">
               <p className="text-ruby text-[9px] font-black uppercase tracking-widest">Privilégios Exclusivos</p>
               <h4 className="text-3xl font-serif font-black dark:text-white italic">Trocar <span className="text-gold">Vantagens.</span></h4>
            </div>
            <button className="text-ruby font-black text-[9px] uppercase tracking-widest underline decoration-ruby/20">Ver Tudo</button>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {rewards.map(reward => {
              const canAfford = currentPoints >= reward.pointsCost;
              return (
                <article key={reward.id} className="group bg-white dark:bg-darkCard rounded-[45px] overflow-hidden luxury-shadow border border-quartz/5 flex flex-col transition-all hover:scale-[1.02]">
                   <div className="relative aspect-square overflow-hidden">
                      <img src={reward.image} className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${!canAfford ? 'grayscale brightness-50' : ''}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-4 left-4">
                         <span className="bg-onyx/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">{reward.category}</span>
                      </div>
                      {!canAfford && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-white">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                           </div>
                        </div>
                      )}
                   </div>
                   <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                         <h5 className="font-serif font-black text-base dark:text-white italic leading-tight">{reward.title}</h5>
                         <p className="text-[9px] text-stone-500 font-medium line-clamp-2">{reward.description}</p>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <span className={`font-black text-lg ${canAfford ? 'text-gold' : 'text-stone-400'}`}>{reward.pointsCost} <span className="text-[8px] uppercase tracking-widest">PTS</span></span>
                         </div>
                         <button 
                          disabled={!canAfford}
                          className={`w-full py-3 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${
                            canAfford 
                              ? 'bg-ruby text-white shadow-lg active:scale-95' 
                              : 'bg-offwhite dark:bg-onyx text-quartz opacity-50 cursor-not-allowed'
                          }`}
                         >
                           {canAfford ? 'Resgatar Agora' : 'Pontos Insuficientes'}
                         </button>
                      </div>
                   </div>
                </article>
              );
            })}
         </div>
      </section>

      {/* 4. BANNER FINAL */}
      <div className="bg-ruby p-12 rounded-[50px] text-white flex flex-col md:flex-row justify-between items-center gap-8 luxury-shadow relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-3xl font-serif font-black italic">Quer acelerar seus pontos?</h4>
            <p className="text-white/60 text-sm max-w-md">Membros Ouro ganham pontos em dobro em qualquer ritual realizado às terças e quartas-feiras.</p>
         </div>
         <button 
          onClick={onNavigateToBooking}
          className="px-12 py-5 bg-white text-ruby rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
         >Agendar Ritual Especial</button>
      </div>

    </div>
  );
};

export default GlowPoints;
