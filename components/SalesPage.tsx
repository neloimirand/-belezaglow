
import React from 'react';
import { Icons } from '../constants';
import GlowImage from './GlowImage';

interface SalesPageProps {
  onPlanSelect: () => void;
  onBack: () => void;
}

const SalesPage: React.FC<SalesPageProps> = ({ onPlanSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-offwhite dark:bg-onyx animate-fade-in pb-40 overflow-x-hidden">
      {/* 1. HERO ESTRATÉGICO */}
      <section className="relative h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 grayscale-[50%]"
            alt="Luxury Salon"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx via-transparent to-onyx"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <button onClick={onBack} className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 hover:text-ruby transition-colors flex items-center gap-2 mx-auto">
             <div className="rotate-180 scale-75"><Icons.ChevronRight /></div> Voltar ao Console
          </button>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-[9rem] font-serif font-black text-white leading-tight tracking-tighter italic">
              Seu Talento, <br />
              <span className="text-ruby drop-shadow-2xl">Elite Global.</span>
            </h1>
            <p className="text-quartz text-lg md:text-3xl font-medium max-w-3xl mx-auto leading-relaxed">
              Deixe de ser apenas um profissional. Torne-se uma <span className="text-gold italic">Maison de Prestígio</span> no radar mais exclusivo de Angola.
            </p>
          </div>
          <div className="pt-10">
            <button 
              onClick={onPlanSelect}
              className="px-16 py-8 bg-ruby text-white rounded-full font-black uppercase tracking-[0.5em] text-[12px] shadow-[0_25px_60px_rgba(157,23,77,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              Escalar meu Faturamento
            </button>
          </div>
        </div>
      </section>

      {/* 2. OS 3 PILARES DA DOMINAÇÃO */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Icons.Map />}
              title="Radar de Atração"
              desc="Sua Maison visível para clientes VIP em um raio de 10km com geolocalização em tempo real."
            />
            <FeatureCard 
              icon={<Icons.Star filled />}
              title="Selo de Patente"
              desc="A autoridade imediata do selo Ouro ou Diamante, elevando seu ticket médio instantaneamente."
            />
            <FeatureCard 
              icon={<Icons.Chart />}
              title="Gestão Blindada"
              desc="Controle total de comissões, faturamento e agenda sem perder um único segundo com planilhas."
            />
         </div>
      </section>

      {/* 3. TRANSFORMAÇÃO VISUAL (DOR VS PRAZER) */}
      <section className="py-24 bg-white dark:bg-darkCard overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <h2 className="text-5xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
                A Diferença <br /><span className="text-ruby underline decoration-ruby/10">Glow Pro.</span>
              </h2>
              <div className="space-y-6">
                 <ComparisonItem type="bad" text="Agendas manuais e esquecimentos de clientes." />
                 <ComparisonItem type="bad" text="Falta de visibilidade no mercado digital de luxo." />
                 <ComparisonItem type="good" text="Notificações automáticas via SMS e Concierge IA." />
                 <ComparisonItem type="good" text="Faturamento direto no cofre com transparência total." />
              </div>
           </div>
           <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
              <GlowImage 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000" 
                alt="Transformation" 
                variant="prestige"
                className="w-full aspect-[4/5] object-cover"
              />
           </div>
        </div>
      </section>

      {/* 4. DEPOIMENTO DE IMPACTO */}
      <section className="py-32 px-6 bg-onyx text-white text-center italic relative">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-gold flex justify-center scale-150 mb-8"><Icons.Star filled /></div>
            <h3 className="text-3xl md:text-5xl font-serif leading-relaxed">
              "Desde que ativamos a Patente Diamante na Maison de l’Ongle, nossa agenda de Talatona esgotou em 15 dias. O Radar Live é o segredo do nosso crescimento em Luanda."
            </h3>
            <div className="space-y-2">
               <p className="font-black uppercase tracking-[0.4em] text-ruby text-sm">Isabel Cruz</p>
               <p className="text-quartz text-xs uppercase font-bold tracking-widest">Founder, Maison de l’Ongle</p>
            </div>
         </div>
      </section>

      {/* 5. CTA FINAL - O FECHAMENTO */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto bg-gradient-to-br from-ruby to-gold p-1 rounded-[60px] shadow-2xl">
            <div className="bg-white dark:bg-darkCard rounded-[58px] p-12 md:p-24 space-y-10">
               <h4 className="text-4xl md:text-6xl font-serif font-black dark:text-white italic">Pronto para a <span className="text-ruby">Grandeza?</span></h4>
               <p className="text-stone-500 dark:text-quartz text-lg">As vagas para o plano anual com taxa zero estão limitadas a 10 novas Maisons este mês.</p>
               <button 
                onClick={onPlanSelect}
                className="w-full py-8 bg-onyx dark:bg-white dark:text-onyx text-white rounded-[35px] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-ruby hover:text-white transition-all shadow-2xl"
               >
                 Ver Planos de Patente
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white dark:bg-darkCard p-12 rounded-[50px] border border-quartz/10 luxury-shadow space-y-6 text-center group hover:border-ruby/30 transition-all">
     <div className="w-20 h-20 bg-ruby/5 text-ruby rounded-3xl flex items-center justify-center mx-auto group-hover:bg-ruby group-hover:text-white transition-all">
        {icon}
     </div>
     <h4 className="text-2xl font-serif font-black dark:text-white italic">{title}</h4>
     <p className="text-stone-500 dark:text-quartz text-sm leading-relaxed">{desc}</p>
  </div>
);

const ComparisonItem = ({ type, text }: { type: 'good' | 'bad', text: string }) => (
  <div className="flex items-center gap-4 p-5 bg-offwhite dark:bg-onyx/30 rounded-3xl border border-quartz/5 shadow-sm">
     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${type === 'good' ? 'bg-emerald/10 text-emerald' : 'bg-ruby/10 text-ruby'}`}>
        {type === 'good' ? '✓' : '✕'}
     </div>
     <p className={`text-sm font-bold ${type === 'good' ? 'dark:text-white' : 'text-stone-400'}`}>{text}</p>
  </div>
);

export default SalesPage;
