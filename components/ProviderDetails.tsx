
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, Service } from '../types';

interface ProviderDetailsProps {
  provider: ProviderProfile;
  onClose: () => void;
  onSelectService: (service: Service) => void;
  onOpenChat: () => void;
}

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ provider, onClose, onSelectService, onOpenChat }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'about'>('services');

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className={`fixed inset-0 z-[5500] bg-onyx transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* BOTÃO VOLTAR - Otimizado para Toque */}
      <button 
        onClick={onClose} 
        className="fixed top-6 left-6 z-[6000] w-14 h-14 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all"
      >
        <div className="rotate-180 scale-125"><Icons.ChevronRight /></div>
      </button>

      <div className="h-full overflow-y-auto scrollbar-hide flex flex-col md:flex-row bg-offwhite dark:bg-onyx">
        
        {/* HERO HEADER - Full Bleed Mobile */}
        <div className="relative h-[50vh] md:h-full md:w-[500px] shrink-0">
           <img src={provider.portfolio[0]} className="w-full h-full object-cover grayscale-[5%]" alt={provider.businessName} />
           <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/20 to-transparent"></div>
           
           <div className="absolute bottom-12 left-8 right-8 space-y-5">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-ruby rounded-full animate-ping"></div>
                 <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Verified Elite Artist</p>
              </div>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-white italic leading-none tracking-tighter">{provider.businessName}</h2>
              <p className="text-quartz text-sm font-medium italic leading-relaxed border-l-3 border-gold pl-6 opacity-90 line-clamp-2">"{provider.bio}"</p>
           </div>
        </div>

        {/* ÁREA DE CONTEÚDO - Zero Gap Mobile */}
        <div className="flex-1 bg-offwhite dark:bg-onyx md:rounded-l-[70px] -mt-12 md:mt-0 relative z-10 p-0 md:p-20 pb-48 overflow-hidden">
           
           {/* NAVEGAÇÃO INTERNA */}
           <div className="flex gap-10 mb-8 border-b border-quartz/10 px-8 pt-10 md:pt-0">
              <button 
                onClick={() => setActiveTab('services')}
                className={`pb-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-3 ${activeTab === 'services' ? 'border-ruby text-ruby' : 'border-transparent text-quartz'}`}
              >Catálogo de Serviços</button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`pb-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-3 ${activeTab === 'about' ? 'border-ruby text-ruby' : 'border-transparent text-quartz'}`}
              >O Espaço</button>
           </div>

           {activeTab === 'services' && (
             <div className="flex flex-col gap-px md:grid md:grid-cols-2 md:gap-8 animate-fade-in bg-quartz/10 md:bg-transparent">
                {provider.services.map((s, idx) => (
                   <div 
                    key={s.id} 
                    onClick={() => onSelectService(s)}
                    className="group bg-white dark:bg-darkCard md:rounded-[45px] overflow-hidden luxury-shadow border-b md:border border-quartz/5 hover:border-ruby/30 transition-all flex flex-col active:scale-[0.98]"
                    style={{ animationDelay: `${idx * 50}ms` }}
                   >
                      <div className="relative h-56 w-full overflow-hidden">
                         <img src={s.photoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400'} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt={s.name} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                         <div className="absolute bottom-6 left-8 pr-10">
                            <p className="text-white font-serif font-black text-2xl md:text-3xl italic leading-none tracking-tight">{s.name}</p>
                         </div>
                      </div>

                      <div className="p-8 space-y-5 flex-1 flex flex-col justify-between">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="text-ruby font-black text-2xl font-serif italic">{s.price.toLocaleString()} Kz</span>
                               <span className="text-quartz text-[10px] font-black uppercase flex items-center gap-2"><Icons.Clock /> {s.durationMinutes} min</span>
                            </div>
                            {/* ESPECIFICAÇÕES DO SERVIÇO EM DESTAQUE */}
                            <p className="text-stone-500 dark:text-quartz/70 text-xs leading-relaxed font-medium italic pr-4">
                               {s.specification || "Serviço personalizado de alta performance utilizando técnicas de visagismo exclusivas."}
                            </p>
                         </div>
                         <button className="w-full py-5 bg-offwhite dark:bg-onyx dark:text-white rounded-[25px] text-[10px] font-black uppercase tracking-[0.3em] group-hover:bg-ruby group-hover:text-white transition-all border border-quartz/5 mt-4">
                            Selecionar Serviço
                         </button>
                      </div>
                   </div>
                ))}
             </div>
           )}

           {activeTab === 'about' && (
             <div className="space-y-12 animate-fade-in p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Localização Curada</p>
                      <p className="text-2xl font-bold dark:text-white leading-tight">{provider.location.address}</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Disponibilidade Elite</p>
                      <p className="text-2xl font-bold dark:text-white leading-tight">Dom-Sex: 24 Horas <br /> Sábado: a partir das 19:00</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {provider.portfolio.map((img, i) => (
                     <img key={i} src={img} className="rounded-[40px] w-full aspect-square object-cover shadow-2xl border border-white/5 transition-transform hover:scale-105" alt="Portfolio" />
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* BARRA DE AÇÃO FIXA - Mobile Bottom */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-darkCard/95 backdrop-blur-3xl border-t border-quartz/10 flex gap-4 z-[7000] pb-safe shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
         <button 
          onClick={onOpenChat}
          className="flex-1 py-5 bg-offwhite dark:bg-onyx dark:text-white rounded-[25px] font-black text-[10px] uppercase tracking-widest shadow-inner flex items-center justify-center gap-3 border border-quartz/5 active:scale-95 transition-all"
         >
           <Icons.Message /> Chat
         </button>
         <button 
          onClick={() => setActiveTab('services')}
          className="flex-[2] py-5 bg-ruby text-white rounded-[25px] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_15px_30px_rgba(157,23,77,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4"
         >
           Agendar Agora <Icons.Star filled />
         </button>
      </footer>
    </div>
  );
};

export default ProviderDetails;
