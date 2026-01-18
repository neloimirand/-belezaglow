
import React, { useState } from 'react';
import { Icons } from '../constants';
import { PlanTier } from '../types';
import Checkout from './Checkout';

const Finance: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'checkout'>('overview');
  const [selectedPlan, setSelectedPlan] = useState<{id: PlanTier, name: string, price: number} | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      alert("Pedido de saque enviado para conformidade bancária. Prazo: 24h.");
    }, 2000);
  };

  const plans = [
    { id: 'SILVER' as PlanTier, name: 'Silver Glow', price: 15000, benefits: ['Destaque Regional'] },
    { id: 'GOLD' as PlanTier, name: 'Gold Elite', price: 45000, benefits: ['IA Marketing', 'Prioridade'] },
    { id: 'DIAMOND' as PlanTier, name: 'Diamond Pro', price: 150000, benefits: ['Taxa Zero', 'Suporte VIP'] }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
      <div className="flex bg-white dark:bg-darkCard p-2 rounded-[30px] border border-quartz/10 luxury-shadow w-fit mx-auto">
        <button 
          onClick={() => { setActiveView('overview'); setSelectedPlan(null); }}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'overview' ? 'bg-ruby text-white' : 'text-quartz'}`}
        >Cofre Maison</button>
        <button 
          onClick={() => setActiveView('checkout')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'checkout' ? 'bg-ruby text-white' : 'text-quartz'}`}
        >Upgrade Patente</button>
      </div>

      {activeView === 'overview' ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 bg-emerald/5 border border-emerald/10 rounded-[60px] space-y-4 text-center">
              <p className="text-[10px] font-black uppercase text-emerald tracking-widest">Saldo Disponível</p>
              <h3 className="text-6xl font-serif font-black text-emerald leading-none">125.400 <span className="text-sm">Kz</span></h3>
              <button 
                onClick={handleWithdraw} 
                disabled={isWithdrawing}
                className="w-full mt-6 py-5 bg-emerald text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isWithdrawing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Icons.Dollar />}
                {isWithdrawing ? 'Verificando...' : 'Solicitar Saque Express'}
              </button>
            </div>
            
            <div className="p-12 bg-white dark:bg-darkCard border border-quartz/10 rounded-[60px] luxury-shadow flex flex-col justify-between items-center text-center">
              <div>
                <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Glow Rewards</p>
                <h3 className="text-4xl font-serif font-black dark:text-white mt-2">12.500 <span className="text-xs">Pts</span></h3>
              </div>
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest mt-4">Nível de Prestígio: Silver</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {!selectedPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedPlan(p)}
                  className="p-10 rounded-[50px] border-2 border-quartz/10 bg-white dark:bg-darkCard transition-all flex flex-col text-left space-y-6 hover:border-ruby hover:scale-[1.02]"
                >
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif font-black italic leading-none dark:text-white">{p.name}</h4>
                    <p className="text-3xl font-serif font-black text-ruby">{p.price.toLocaleString()} Kz</p>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {p.benefits.map((b, i) => (
                      <li key={i} className="text-[9px] font-bold dark:text-quartz flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-ruby"></div> {b}
                      </li>
                    ))}
                  </ul>
                  <span className="w-full py-4 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[9px] font-black uppercase text-center">Selecionar</span>
                </button>
              ))}
            </div>
          ) : (
            <Checkout plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
          )}
        </div>
      )}
    </div>
  );
};

export default Finance;
