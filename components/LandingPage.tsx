
import React, { useState } from 'react';
import { Icons } from '../constants';
import PolicyModal from './PolicyModal';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[8000] bg-onyx overflow-y-auto scrollbar-hide text-white selection:bg-ruby selection:text-white font-sans">
      
      {/* SEÇÃO 1: HERO CINEMATOGRÁFICO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000" 
            className="w-full h-full object-cover grayscale opacity-40 scale-110 animate-ken-burns" 
            alt="Beleza de Elite" 
           />
           {/* Gradiente de Profundidade */}
           <div className="absolute inset-0 bg-gradient-to-b from-onyx/95 via-transparent to-onyx"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-onyx/40 via-transparent to-onyx/40"></div>
        </div>

        <div className="relative z-10 px-6 text-center space-y-12 max-w-6xl">
           <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-center gap-6 mb-8">
                <span className="h-[1px] w-20 bg-gold/40"></span>
                <p className="text-gold text-[10px] font-black uppercase tracking-[1em]">O Padrão Ouro da Beleza</p>
                <span className="h-[1px] w-20 bg-gold/40"></span>
              </div>
              
              <h1 className="text-6xl md:text-[13rem] font-serif font-black leading-[0.75] tracking-tighter italic">
                Sedução. <br /> Poder. <br /> <span className="text-ruby drop-shadow-[0_0_40px_rgba(157,23,77,0.5)]">Glow.</span>
              </h1>
           </div>
           
           <p className="text-quartz text-xl md:text-3xl font-light max-w-3xl mx-auto leading-relaxed italic opacity-80 animate-fade-in delay-500">
             Não é apenas um agendamento. É a celebração da sua identidade em seu estado mais sublime.
           </p>

           <div className="pt-12 animate-fade-in delay-1000">
              <button 
                onClick={onStart}
                className="group relative px-20 py-10 bg-white text-onyx rounded-full font-black uppercase tracking-[0.6em] text-[11px] shadow-[0_0_70px_rgba(255,255,255,0.15)] hover:bg-ruby hover:text-white transition-all duration-1000 flex items-center gap-10 mx-auto active:scale-95 border border-white/10"
              >
                Começar Agora
                <div className="w-12 h-12 bg-onyx/5 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all rotate-0 group-hover:rotate-45">
                   <Icons.ChevronRight />
                </div>
              </button>
           </div>
        </div>

        {/* Detalhes de Rodapé Hero */}
        <div className="absolute bottom-12 left-12 hidden md:flex flex-col gap-4 opacity-40 text-[9px] font-black uppercase tracking-[0.5em]">
           <span className="text-gold">Luanda • Talatona</span>
           <span className="h-[1px] w-12 bg-white"></span>
           <span>Angola Prestige</span>
        </div>

        <div className="absolute bottom-12 right-12 hidden md:block opacity-20">
            <p className="text-[8px] font-black uppercase tracking-widest text-right leading-relaxed">
              Copyright © 2024<br />Beleza Glow Ecosystem
            </p>
        </div>
      </section>

      {/* SEÇÃO 2: MANIFESTO EDITORIAL */}
      <section className="py-40 px-6 md:px-24 bg-white text-onyx relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-offwhite -skew-x-12 translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-[2px] bg-ruby"></div>
                      <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">A Filosofia</p>
                   </div>
                   <h2 className="text-5xl md:text-8xl font-serif font-black leading-tight italic tracking-tighter">A Arte de <br /><span className="text-gold">Ser Inesquecível.</span></h2>
                   <p className="text-stone-500 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
                     Nossa curadoria seleciona apenas os artistas que dominam a fusão entre técnica milenar e tendências globais.
                   </p>
                   <div className="flex gap-12 pt-8">
                      <div>
                        <p className="text-4xl font-serif font-black">150+</p>
                        <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Ateliers Elite</p>
                      </div>
                      <div>
                        <p className="text-4xl font-serif font-black">24/7</p>
                        <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Concierge</p>
                      </div>
                   </div>
                </div>

                <div className="relative">
                   <div className="aspect-[4/5] rounded-[80px] overflow-hidden luxury-shadow border-[15px] border-white relative z-10 group">
                      <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Estética" />
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-ruby rounded-[60px] -z-0 opacity-10 animate-pulse"></div>
                </div>
            </div>
         </div>
      </section>

      {/* SEÇÃO 3: RITUAIS - GRELHA LUXUOSA */}
      <section className="py-40 px-6 bg-onyx border-t border-white/5">
         <div className="max-w-7xl mx-auto text-center space-y-20">
            <h3 className="text-4xl md:text-7xl font-serif font-black italic text-white">Rituais que <span className="text-ruby underline decoration-ruby/20">Seduzem.</span></h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { title: "Visagismo Pro", cat: "Cabelo & Barba", img: "https://images.unsplash.com/photo-1599351431247-f10b21ce963f?q=80&w=800" },
                 { title: "Glow Skin 24k", cat: "Estética Facial", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800" },
                 { title: "Aura Nails", cat: "Design de Unhas", img: "https://images.unsplash.com/photo-1604654894610-df490668711d?q=80&w=800" }
               ].map((item, i) => (
                 <div key={i} className="group relative aspect-[3/4] rounded-[60px] overflow-hidden luxury-shadow border border-white/5">
                    <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-10 text-left space-y-2">
                       <p className="text-ruby text-[9px] font-black uppercase tracking-widest">{item.cat}</p>
                       <h4 className="text-3xl font-serif font-bold text-white italic">{item.title}</h4>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* SEÇÃO FINAL: CHAMADA AO IMPÉRIO */}
      <section className="relative py-48 px-6 bg-onyx text-center overflow-hidden">
         <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ruby/40 via-transparent to-transparent"></div>
         </div>

         <div className="relative z-10 space-y-16">
            <div className="space-y-4">
              <h4 className="text-5xl md:text-[8rem] font-serif font-black italic tracking-tighter text-white/5 underline decoration-white/5">Your Kingdom.</h4>
              <p className="text-2xl md:text-5xl font-serif font-black italic text-white leading-tight">Prepare-se para brilhar como <br /> <span className="text-gold">nunca antes.</span></p>
            </div>
            
            <button 
              onClick={onStart}
              className="px-24 py-10 bg-ruby text-white rounded-full font-black uppercase tracking-[0.5em] text-[11px] shadow-[0_25px_60px_rgba(157,23,77,0.4)] hover:scale-110 active:scale-95 transition-all duration-500 border border-white/10"
            >
              Entrar no Universo
            </button>
         </div>
      </section>

      {/* FOOTER LUXURY */}
      <footer className="py-20 px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 opacity-40">
         <h1 className="text-2xl font-serif font-black tracking-tighter">GLOW <span className="italic font-normal">ELITE</span></h1>
         <div className="flex gap-10 text-[9px] font-black uppercase tracking-widest">
            <button onClick={() => setIsPolicyOpen(true)} className="hover:text-gold transition-colors uppercase">Termos de Luxo</button>
            <button onClick={() => setIsPolicyOpen(true)} className="hover:text-gold transition-colors uppercase">Privacidade</button>
            <a href="#" className="hover:text-gold transition-colors">Parcerias</a>
         </div>
         <p className="text-[9px] font-black uppercase tracking-widest">Luanda, Angola</p>
      </footer>

      {isPolicyOpen && <PolicyModal onClose={() => setIsPolicyOpen(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ken-burns {
          0% { transform: scale(1.1) translate(0,0); }
          100% { transform: scale(1.3) translate(-2%, -2%); }
        }
        .animate-ken-burns {
          animation: ken-burns 40s infinite alternate ease-in-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}} />
    </div>
  );
};

export default LandingPage;
