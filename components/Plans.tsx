
import React, { useState } from 'react';
import { Icons } from '../constants';
import { PlanTier } from '../types';
import Checkout from './Checkout';

interface PlanOption {
  id: PlanTier;
  name: string;
  price: number;
  period: string;
  benefits: string[];
  description: string;
  highlight?: boolean;
  color: string;
}

const Plans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);

  const planOptions: PlanOption[] = [
    {
      id: 'SILVER',
      name: 'Silver Glow',
      price: 15000,
      period: 'Mês',
      description: 'Essencial para profissionais que estão começando a brilhar no radar.',
      color: 'from-stone-300 to-stone-500',
      benefits: ['Destaque Regional', 'Até 10 Serviços', 'Suporte Via Chat', 'Agenda Digital']
    },
    {
      id: 'GOLD',
      name: 'Gold Elite',
      price: 45000,
      period: 'Mês',
      description: 'O padrão ouro para as Maisons que dominam o mercado de Luanda.',
      highlight: true,
      color: 'from-gold/80 to-gold',
      benefits: ['Prioridade Máxima no Radar', 'Selo Verificado Ouro', 'IA de Marketing Glow', 'Equipe Ilimitada', 'Consultoria Semanal']
    },
    {
      id: 'DIAMOND',
      name: 'Diamond Pro',
      price: 150000,
      period: 'Mês',
      description: 'Para o topo da pirâmide. Experiência omnicanal e comissões zeradas.',
      color: 'from-ruby/60 to-ruby',
      benefits: ['Taxa Zero de Agendamento', 'Suporte VIP 24/7', 'Gestor de Conta Humano', 'Anúncios Exclusivos', 'Acesso Antecipado']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-fade-in pb-40 px-4 md:px-0">
      
      {/* Editorial Header */}
      {!selectedPlan && (
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-[1px] bg-gold/30"></div>
            <p className="text-gold text-[10px] font-black uppercase tracking-[0.6em]">Investimento em Prestígio</p>
            <div className="w-12 h-[1px] bg-gold/30"></div>
          </div>
          <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
            Sua Patente <br /><span className="text-ruby">Elite.</span>
          </h2>
          <p className="text-stone-500 dark:text-quartz text-lg md:text-2xl font-medium max-w-2xl mx-auto italic">
            Escolha o nível de influência que sua marca exercerá no Radar de Beleza de Angola.
          </p>
        </header>
      )}

      {/* Plans Grid */}
      {!selectedPlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {planOptions.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`group relative p-1 bg-gradient-to-br transition-all duration-700 cursor-pointer rounded-[60px] hover:scale-[1.02] ${plan.highlight ? 'from-gold via-gold/50 to-gold/10 shadow-xl' : 'from-quartz/20 to-transparent'}`}
            >
              <div className="bg-white dark:bg-darkCard h-full w-full rounded-[58px] p-10 md:p-14 flex flex-col justify-between space-y-12">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className={`px-5 py-2 rounded-full bg-gradient-to-r text-white text-[8px] font-black uppercase tracking-widest ${plan.color}`}>
                      {plan.id} Tier
                    </div>
                    {plan.highlight && (
                      <div className="flex items-center gap-1 text-gold">
                        <Icons.Star filled />
                        <span className="text-[9px] font-black uppercase tracking-widest">Recomendado</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-4xl font-serif font-black dark:text-white italic leading-none">{plan.name}</h4>
                    <p className="text-stone-500 dark:text-quartz text-sm font-medium leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="pt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-black text-ruby">{plan.price.toLocaleString()}</span>
                    <span className="text-xs font-black uppercase text-quartz tracking-widest">Kz / {plan.period}</span>
                  </div>

                  <ul className="space-y-4 pt-4 border-t border-quartz/10">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-stone-600 dark:text-quartz text-sm font-bold italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-ruby/50"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  className="w-full py-5 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-ruby hover:text-white"
                >
                  Selecionar Patente
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* NOVO COMPONENTE DE CHECKOUT */
        <Checkout 
          plan={selectedPlan} 
          onBack={() => setSelectedPlan(null)} 
          onSuccess={() => console.log("Pagamento iniciado")}
        />
      )}
    </div>
  );
};

export default Plans;
