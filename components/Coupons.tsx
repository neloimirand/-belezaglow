
import React, { useState } from 'react';
import { Icons } from '../constants';

interface CouponItem {
  id: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  category: 'PRIME' | 'WELCOME' | 'MAISON';
  isUsed?: boolean;
}

interface CouponsProps {
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const Coupons: React.FC<CouponsProps> = ({ onActionNotify }) => {
  const [activeFilter, setActiveFilter] = useState<'available' | 'used'>('available');

  const coupons: CouponItem[] = [
    {
      id: 'c1',
      code: 'GLOWELITE20',
      discount: '20%',
      description: 'Válido para qualquer ritual de cabelo nas Maisons Ouro.',
      validUntil: '30 Mai, 2024',
      category: 'PRIME'
    },
    {
      id: 'c2',
      code: 'BEMVINDO',
      discount: '5.000 Kz',
      description: 'Sua primeira experiência na rede Beleza Glow.',
      validUntil: '15 Jun, 2024',
      category: 'WELCOME'
    },
    {
      id: 'c3',
      code: 'MAISONGLOW',
      discount: '10%',
      description: 'Exclusivo para agendamentos feitos via Radar Live.',
      validUntil: '20 Mai, 2024',
      category: 'MAISON'
    },
    {
      id: 'c4',
      code: 'BLACKCARD',
      discount: '50%',
      description: 'Upgrade para membros de Patente Diamante.',
      validUntil: '01 Jul, 2024',
      category: 'PRIME'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    onActionNotify("Código Copiado", `O cupom ${code} está pronto para ser aplicado no checkout.`, "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in pb-40 px-4">
      
      {/* HEADER EDITORIAL */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
           <div className="w-12 h-[1px] bg-ruby/30"></div>
           <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Vantagens Exclusivas</p>
           <div className="w-12 h-[1px] bg-ruby/30"></div>
        </div>
        <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
          Meus <span className="text-gold">Benefícios.</span>
        </h2>
        <p className="text-quartz text-lg md:text-2xl font-medium max-w-xl mx-auto italic">
          Rituais de economia para a elite da beleza em Luanda.
        </p>
      </header>

      {/* FILTER TABS */}
      <div className="flex bg-white dark:bg-darkCard p-2 rounded-[30px] border border-quartz/10 luxury-shadow w-fit mx-auto">
        <button 
          onClick={() => setActiveFilter('available')}
          className={`px-10 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'available' ? 'bg-ruby text-white shadow-lg' : 'text-quartz'}`}
        >Disponíveis</button>
        <button 
          onClick={() => setActiveFilter('used')}
          className={`px-10 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'used' ? 'bg-ruby text-white shadow-lg' : 'text-quartz'}`}
        >Histórico</button>
      </div>

      {/* LISTA DE CUPONS COM ESTÉTICA DE BILHETE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coupons.map((coupon) => (
          <article 
            key={coupon.id} 
            className="relative flex h-48 bg-white dark:bg-darkCard rounded-[40px] luxury-shadow border border-quartz/10 overflow-hidden group hover:scale-[1.02] transition-all"
          >
            {/* Lado Esquerdo: Valor (Perfurado) */}
            <div className={`w-1/3 flex flex-col items-center justify-center border-r-2 border-dashed border-quartz/10 relative ${coupon.category === 'PRIME' ? 'bg-gold/5' : 'bg-ruby/5'}`}>
               {/* Meias luas de perfuração */}
               <div className="absolute -top-3 -right-3 w-6 h-6 bg-offwhite dark:bg-onyx rounded-full"></div>
               <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-offwhite dark:bg-onyx rounded-full"></div>
               
               <p className="text-[8px] font-black uppercase tracking-widest text-quartz mb-2">{coupon.category}</p>
               <h3 className={`text-3xl font-serif font-black italic ${coupon.category === 'PRIME' ? 'text-gold' : 'text-ruby'}`}>{coupon.discount}</h3>
               <p className="text-[7px] font-black uppercase text-quartz mt-2">OFF</p>
            </div>

            {/* Lado Direito: Info */}
            <div className="flex-1 p-8 flex flex-col justify-between overflow-hidden">
               <div className="space-y-2">
                  <div className="flex justify-between items-start">
                     <h4 className="font-serif font-black text-xl dark:text-white italic truncate">{coupon.code}</h4>
                     <button 
                      onClick={() => handleCopy(coupon.code)}
                      className="p-2 bg-offwhite dark:bg-onyx rounded-xl text-ruby hover:bg-ruby hover:text-white transition-all shadow-sm"
                     >
                        <Icons.Edit />
                     </button>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-quartz leading-relaxed font-medium line-clamp-2">{coupon.description}</p>
               </div>
               
               <div className="flex justify-between items-center pt-4 border-t border-quartz/5">
                  <div className="flex items-center gap-2">
                     <Icons.Clock />
                     <span className="text-[8px] font-black uppercase text-quartz">Expira em {coupon.validUntil}</span>
                  </div>
                  <div className="w-2 h-2 bg-emerald rounded-full animate-pulse shadow-[0_0_8px_#1F7A5C]"></div>
               </div>
            </div>

            {/* Selo Holográfico Prime */}
            {coupon.category === 'PRIME' && (
              <div className="absolute top-0 left-0">
                 <div className="bg-gold text-onyx px-4 py-1 rounded-br-2xl text-[7px] font-black uppercase tracking-widest shadow-lg">Elite Only</div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="bg-onyx p-12 rounded-[50px] text-white flex flex-col md:flex-row justify-between items-center gap-8 luxury-shadow border border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-3xl font-serif font-black italic text-white">Ganhe mais <span className="text-gold">Vantagens.</span></h4>
            <p className="text-quartz text-sm max-w-md">Ao completar 5 rituais de beleza, você desbloqueia automaticamente um cupom de 50% de desconto.</p>
         </div>
         <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-3xl border border-white/10">
            <span className="text-gold"><Icons.Star filled /></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Progressão: 2/5</span>
         </div>
      </div>

    </div>
  );
};

export default Coupons;
