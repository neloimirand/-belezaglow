
import React, { useState } from 'react';
import { Icons } from '../constants';
import TermsOfUse from './TermsOfUse';
import GlowImage from './GlowImage';
import TeamSection from './TeamSection';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'client' | 'pro' | 'salon'>('client');

  return (
    <div className="relative min-h-screen bg-offwhite dark:bg-onyx overflow-x-hidden selection:bg-ruby selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <GlowImage 
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2000" 
            alt="Luxury Beauty" 
            variant="hero"
            priority={true}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-transparent to-onyx"></div>
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-[1px] bg-gold/50"></div>
              <p className="text-gold text-[9px] font-black uppercase tracking-[0.6em]">Ecossistema de Elite</p>
              <div className="w-8 h-[1px] bg-gold/50"></div>
            </div>
            <h1 className="text-5xl md:text-9xl font-serif font-black text-white leading-tight md:leading-[0.85] tracking-tighter italic">
              BELEZA <br />
              <span className="text-ruby drop-shadow-[0_0_30px_rgba(157,23,77,0.4)] uppercase">GLOW</span>
            </h1>
          </div>
          
          <p className="text-quartz text-base md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
            A solução definitiva em estética disponível 24/24. Conectando o desejo à realização em um único toque.
          </p>

          <div className="flex flex-col items-center gap-4 pt-6">
             <button 
                onClick={onStart}
                className="w-full md:w-auto px-12 py-6 bg-ruby text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all"
             >
                Explorar Agora
             </button>
             <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full">
                <div className="w-2 h-2 bg-emerald rounded-full animate-ping"></div>
                <span className="text-[8px] text-white font-black uppercase tracking-widest">Sincronização Live Luanda</span>
             </div>
          </div>
        </div>
      </section>

      {/* 2. O PROBLEMA (DOR E CONTRASTE) */}
      <section className="py-24 px-6 bg-white dark:bg-darkCard">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-6xl font-serif font-black dark:text-white italic leading-tight">
              Sua agenda não deveria <br /> ser um <span className="text-ruby underline decoration-ruby/20">obstáculo.</span>
            </h2>
            <p className="text-stone-500 dark:text-quartz text-sm italic">Gestão confusa, perda de tempo e clientes sem resposta acabam aqui.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-left max-w-md mx-auto">
            <PainPoint icon="✕" text="Dificuldade para encontrar especialistas de confiança." />
            <PainPoint icon="✕" text="Conflitos de horários e gestão manual ineficiente." />
            <PainPoint icon="✕" text="Falta de visibilidade e controle financeiro real." />
          </div>

          <div className="relative pt-10 group">
             <div className="max-w-md mx-auto overflow-hidden">
                <GlowImage 
                  src="https://images.unsplash.com/photo-1595476108010-b4d1f8717358?q=80&w=1000" 
                  alt="Organization Gap" 
                  variant="prestige"
                  className="aspect-[4/3] w-full"
                />
             </div>
          </div>
        </div>
      </section>

      {/* 3. A EQUIPE (NOVO COMPONENTE) */}
      <TeamSection />

      {/* 4. A SOLUÇÃO (UNIFICAÇÃO) */}
      <section className="py-24 bg-onyx text-white relative overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-0 left-0 w-96 h-96 bg-ruby rounded-full blur-[150px]"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-8xl font-serif font-black italic tracking-tighter">O Universo <span className="text-gold">Glow.</span></h2>
            <p className="text-quartz text-base md:text-xl">Três pilares unidos em uma tecnologia de luxo.</p>
          </div>

          <div className="flex flex-col gap-10">
            <SolutionCard 
              title="Marketplace Global" 
              desc="Radar Live integrado com geolocalização em tempo real para busca instantânea." 
              icon={<Icons.Map />}
            />
            <SolutionCard 
              title="Concierge Digital" 
              desc="Inteligência Artificial que entende sua necessidade e sugere o ritual perfeito." 
              icon={<Icons.Star filled />}
            />
            <SolutionCard 
              title="Cofre Financeiro" 
              desc="Gestão de pagamentos, comissões e faturamento com total transparência." 
              icon={<Icons.Dollar />}
            />
          </div>
        </div>
      </section>

      {/* 5. BENEFÍCIOS SEGMENTADOS */}
      <section className="py-24 px-6 bg-offwhite dark:bg-onyx">
        <div className="max-w-4xl mx-auto space-y-12">
          <h3 className="text-center text-3xl font-serif font-black dark:text-white italic">Escolha seu <span className="text-ruby">Papel.</span></h3>
          
          <div className="flex justify-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {(['client', 'pro', 'salon'] as const).map(s => (
              <button 
                key={s}
                onClick={() => setActiveSegment(s)}
                className={`shrink-0 px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSegment === s ? 'bg-ruby text-white shadow-xl' : 'bg-white dark:bg-darkCard text-quartz border border-quartz/10'}`}
              >
                {s === 'client' ? 'Clientes' : s === 'pro' ? 'Artistas' : 'Salões'}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-darkCard p-8 rounded-[50px] shadow-2xl border border-quartz/5 transition-all animate-fade-in">
             {activeSegment === 'client' && (
               <SegmentView 
                 title="MEMBRO ELITE" 
                 price="Livre"
                 features={['Radar Live 24/7', 'Chat SMS Direto', 'Favoritos e Histórico', 'Pagamento Seguro']}
                 image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600"
               />
             )}
             {activeSegment === 'pro' && (
               <SegmentView 
                 title="ARTISTA PRO" 
                 price="1.500 Kz"
                 features={['Agenda Inteligente', 'Perfil no Radar', 'Glow Ads Incluído', 'Controle de Ganhos']}
                 image="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600"
               />
             )}
             {activeSegment === 'salon' && (
               <SegmentView 
                 title="MAISON GLOW" 
                 price="2.000 Kz"
                 features={['Gestão de Equipe', 'Comissões Automáticas', 'Relatórios Dash', 'Prioridade VIP']}
                 image="https://images.unsplash.com/photo-1512690196152-74472f1289df?q=80&w=600"
               />
             )}
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-32 px-6 text-center bg-white dark:bg-darkCard">
         <div className="max-w-2xl mx-auto space-y-12 pb-20">
            <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-tight">
               O futuro da sua <br /> beleza é <span className="text-ruby underline decoration-ruby/10">agora.</span>
            </h2>
            <p className="text-stone-500 dark:text-quartz text-lg font-medium">
               Não perca mais tempo com soluções fragmentadas. <br />
               Eleve-se ao padrão Glow.
            </p>
         </div>
      </section>

      {/* RODAPÉ MÍNIMO */}
      <footer className="py-12 border-t border-quartz/10 bg-white dark:bg-onyx text-center opacity-30 px-6">
         <p className="text-[9px] font-bold uppercase tracking-widest">&copy; 2024 BELEZA GLOW • ALL RIGHTS RESERVED</p>
      </footer>

      {/* 📱 BOTÃO FIXO (STICKY CONVERSION) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[9500] pointer-events-none flex justify-center">
         <div className="max-w-sm w-full pointer-events-auto">
            <button 
              onClick={onStart}
              className="w-full py-6 bg-ruby text-white rounded-[30px] font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_25px_60px_rgba(157,23,77,0.6)] border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
              Começar Agora
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <Icons.ChevronRight />
              </div>
            </button>
         </div>
      </div>

      {isTermsOpen && <TermsOfUse onClose={() => setIsTermsOpen(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

/* COMPONENTES INTERNOS DE SUPORTE */

const PainPoint = ({ icon, text }: any) => (
  <div className="flex items-center gap-4 p-4 bg-offwhite dark:bg-onyx/30 rounded-2xl border border-quartz/5">
     <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-black text-xs shrink-0">{icon}</span>
     <p className="text-stone-600 dark:text-quartz font-medium text-sm leading-tight">{text}</p>
  </div>
);

const SolutionCard = ({ title, desc, icon }: any) => (
  <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 text-center space-y-3 transition-all hover:border-gold/30">
     <div className="text-gold flex justify-center scale-125 mb-4">{icon}</div>
     <h4 className="text-xl font-serif font-black italic">{title}</h4>
     <p className="text-quartz text-[10px] font-medium leading-relaxed uppercase tracking-widest px-4">{desc}</p>
  </div>
);

const SegmentView = ({ title, price, features, image }: any) => (
  <div className="flex flex-col items-center text-center space-y-10 group">
     <div className="aspect-[4/3] w-full max-w-xs overflow-hidden">
        <GlowImage 
          src={image} 
          alt={title} 
          variant="prestige" 
          className="w-full h-full"
        />
     </div>
     <div className="space-y-6">
        <div className="space-y-1">
           <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em]">{title}</p>
           <h3 className="text-5xl font-serif font-black italic dark:text-white leading-none">{price}</h3>
           <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mt-1">Sincronização Mensal</p>
        </div>
        <ul className="space-y-3 max-w-xs mx-auto">
           {features.map((f: string, i: number) => (
             <li key={i} className="flex items-center justify-center gap-3 text-stone-600 dark:text-quartz font-bold italic text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div> {f}
             </li>
           ))}
        </ul>
     </div>
  </div>
);

export default LandingPage;
