
import React, { useState, useEffect, useMemo } from 'react';
import { Icons, COLORS } from '../constants';
import { getBeautyRecommendations } from '../services/geminiService';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { ProviderProfile } from '../types';

interface HomeProps {
  onStartExploring: (view?: string) => void;
  onSelectProvider?: (p: ProviderProfile) => void;
}

const Home: React.FC<HomeProps> = ({ onStartExploring, onSelectProvider }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const recommendedProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter(p => p.planTier === 'GOLD' || p.planTier === 'ANNUAL' || p.planTier === 'SILVER');
  }, []);

  useEffect(() => {
    if (recommendedProviders.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recommendedProviders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [recommendedProviders.length]);

  const handleAiConsult = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    const goldProviders = MOCK_PROVIDERS.filter(p => p.planTier === 'GOLD' || p.planTier === 'ANNUAL');
    const response = await getBeautyRecommendations(aiPrompt, goldProviders);
    setAiResponse(response || '');
    setIsAiLoading(false);
  };

  const isSalon = (provider: ProviderProfile) => {
    const name = provider.businessName.toLowerCase();
    return name.includes('salon') || name.includes('atelier') || name.includes('maison') || name.includes('club') || name.includes('centro') || (provider.employees && provider.employees.length > 1);
  };

  const handleProviderClick = (provider: ProviderProfile, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectProvider) {
      onSelectProvider(provider);
    }
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-32">
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[85vh] md:h-[95vh] -mt-12 -mx-4 md:-mx-12 overflow-hidden flex items-center justify-center group rounded-b-[40px] md:rounded-none">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale-[30%] group-hover:scale-110 transition-transform duration-[10s] ease-out"
            alt="Elite Beauty"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/60 via-onyx/40 to-onyx"></div>
        </div>
        
        <div className="relative z-10 px-6 md:px-24 max-w-6xl space-y-8 md:space-y-12 animate-fade-in text-center md:text-left flex flex-col items-center md:items-start">
          <div className="space-y-4 md:space-y-6">
             <div className="flex items-center gap-4 justify-center md:justify-start">
               <span className="w-8 md:w-12 h-[2px] bg-ruby"></span>
               <p className="text-ruby text-[9px] md:text-xs font-black uppercase tracking-[0.5em]">A Rede de Beleza de Prestígio</p>
             </div>
             <h1 className="text-5xl md:text-[10rem] font-serif font-black text-white leading-tight md:leading-[0.8] tracking-tighter">
               Beleza <br className="hidden md:block" />
               <span className="italic font-normal text-gold">GLOW</span>
             </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 pt-4 w-full md:w-auto px-10 md:px-0">
            <button 
              onClick={() => onStartExploring('discover')}
              className="group relative px-10 py-5 md:px-12 md:py-7 bg-ruby text-white rounded-[20px] md:rounded-[25px] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4"><Icons.Search /> Encontre Profissionais</span>
            </button>
            <button 
              onClick={() => onStartExploring('map')}
              className="px-10 py-5 md:px-12 md:py-7 bg-white/10 backdrop-blur-md text-white rounded-[20px] md:rounded-[25px] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-white hover:text-onyx transition-all flex items-center justify-center gap-4 border border-white/20"
            >
              <Icons.Map /> Localizar no mapa
            </button>
          </div>
        </div>
      </section>

      {/* 2. SEASON HIGHLIGHTS - CARROSSEL INFINITO */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex flex-col gap-2">
           <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em] ml-2">Season Highlights</p>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-gold rounded-full animate-ping"></div>
              <h3 className="text-3xl md:text-6xl font-serif font-black italic dark:text-white">Os Mais <span className="text-gold">Recomendados.</span></h3>
           </div>
        </div>

        <div className="relative h-[450px] md:h-[600px] overflow-hidden rounded-[50px] bg-onyx luxury-shadow border border-white/5">
           {recommendedProviders.length > 0 ? (
             <div className="absolute inset-0">
               {recommendedProviders.map((provider, idx) => (
                 <div 
                   key={provider.id}
                   className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col md:flex-row ${idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}
                 >
                   {/* Visual Area */}
                   <div className="relative md:w-2/3 h-full overflow-hidden">
                     <img src={provider.portfolio[0]} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000" alt={provider.businessName} />
                     <div className="absolute inset-0 bg-gradient-to-r from-onyx/90 via-onyx/30 to-transparent"></div>
                     
                     <div className="absolute top-8 left-8 flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                        {isSalon(provider) ? (
                          <div className="flex items-center gap-3 text-white">
                            <Icons.Home /> <span className="text-[10px] font-black uppercase tracking-widest">Salão de Elite</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-gold">
                            <Icons.User /> <span className="text-[10px] font-black uppercase tracking-widest text-white">Profissional Pro</span>
                          </div>
                        )}
                     </div>
                   </div>

                   {/* Content Area */}
                   <div className="md:w-1/3 bg-onyx dark:bg-darkCard p-10 md:p-16 flex flex-col justify-center space-y-8 relative">
                      <div className="space-y-4">
                         <h4 className="text-4xl md:text-6xl font-serif font-black text-white italic leading-tight tracking-tighter">{provider.businessName}</h4>
                         <p className="text-quartz text-sm md:text-base font-medium leading-relaxed line-clamp-4 italic opacity-80">"{provider.bio}"</p>
                      </div>

                      <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gold">
                               <Icons.Star filled />
                               <span className="text-2xl font-black">{provider.rating}</span>
                            </div>
                            <div className="text-[10px] font-black text-quartz/50 uppercase tracking-widest">Destaque Verificado</div>
                         </div>
                         <button 
                           onClick={(e) => handleProviderClick(provider, e)}
                           className="w-full py-6 bg-ruby text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-onyx transition-all shadow-2xl active:scale-95"
                         >
                           {isSalon(provider) ? 'Explorar Salão' : 'Solicitar Reserva'}
                         </button>
                      </div>
                   </div>
                 </div>
               ))}

               <div className="absolute bottom-10 left-10 md:left-auto md:right-10 z-20 flex gap-4">
                  {recommendedProviders.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-16 bg-ruby' : 'w-4 bg-white/20'}`}
                    />
                  ))}
               </div>
             </div>
           ) : (
             <div className="flex items-center justify-center h-full text-quartz italic">Preparando curadoria elite...</div>
           )}
        </div>
      </section>

      {/* 3. EXPLORAR TODOS OS TALENTOS - GRELHA GERAL */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="flex flex-col gap-2">
           <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em] ml-2">Directório Completo</p>
           <div className="flex items-center gap-6">
              <div className="w-12 h-[2px] bg-ruby"></div>
              <h3 className="text-3xl md:text-5xl font-serif font-black italic dark:text-white">Explorar Todos <span className="text-ruby">os Talentos.</span></h3>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {MOCK_PROVIDERS.map((provider, idx) => {
            const salon = isSalon(provider);
            return (
              <div 
                key={provider.id} 
                className="group cursor-pointer space-y-6 flex flex-col items-center animate-fade-in transition-all active:scale-[0.98]" 
                onClick={(e) => handleProviderClick(provider, e)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[40px] md:rounded-[55px] shadow-2xl border border-quartz/10 dark:border-white/5 bg-offwhite group-hover:border-ruby transition-all">
                  <img src={provider.portfolio[0]} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" alt={provider.businessName} />
                  
                  <div className="absolute top-6 left-6 z-10">
                     <div className={`p-4 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl transition-all group-hover:scale-110 ${salon ? 'bg-onyx/80 text-white' : 'bg-ruby/80 text-white'}`}>
                        {salon ? <Icons.Home /> : <Icons.User />}
                     </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                     <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <p className="text-ruby text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">{salon ? 'Unidade Física' : 'Especialista Solo'}</p>
                           <h4 className="text-sm md:text-3xl font-serif font-black text-white leading-tight tracking-tighter">{provider.businessName}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-gold bg-onyx/40 px-3 py-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                           <Icons.Star filled />
                           <span className="text-[10px] font-black text-white">{provider.rating}</span>
                        </div>
                     </div>
                  </div>
                </div>
                
                <div className="px-4 space-y-2 text-center group-hover:-translate-y-2 transition-transform duration-500 w-full">
                  <button 
                    onClick={(e) => handleProviderClick(provider, e)}
                    className="w-full py-4 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl group-hover:bg-ruby group-hover:text-white transition-all active:scale-95"
                  >
                    {salon ? 'Solicitar Reserva' : 'Agendar Agora'}
                  </button>
                  <p className="text-quartz text-[8px] font-black uppercase tracking-widest">{provider.reviewCount} Experiências</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI CONCIERGE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-onyx dark:bg-darkCard rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px] border border-white/5">
          <div className="lg:w-1/2 p-10 md:p-24 bg-gradient-to-br from-onyx to-ruby/20 flex flex-col justify-center space-y-10 text-center md:text-left items-center md:items-start">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                 <div className="w-2 h-2 bg-ruby rounded-full animate-ping"></div>
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tighter italic">Concierge IA</h2>
              </div>
              <p className="text-quartz text-base md:text-xl font-medium leading-relaxed max-w-sm">
                Descreva seu estilo e nosso oráculo digital encontrará o especialista perfeito entre nossos parceiros Elite.
              </p>
            </div>
            
            <div className="relative group w-full max-w-md">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: 'Visual moderno para evento VIP em Luanda...'"
                className="w-full bg-white/5 text-white rounded-[30px] p-8 border border-white/10 outline-none focus:ring-4 focus:ring-ruby/20 min-h-[180px] text-base font-medium resize-none placeholder:text-stone-700 transition-all shadow-inner"
              />
              <button 
                onClick={handleAiConsult}
                disabled={isAiLoading}
                className="absolute bottom-6 right-6 p-5 bg-ruby text-white rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all disabled:opacity-50"
              >
                {isAiLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icons.ChevronRight />}
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 p-10 md:p-24 bg-white dark:bg-onyx flex flex-col justify-center relative overflow-hidden items-center md:items-start text-center md:text-left">
            {aiResponse ? (
              <div className="animate-fade-in space-y-8 md:space-y-10 w-full">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ruby">Sugestão de Prestígio</p>
                <div className="text-xl md:text-3xl leading-relaxed text-onyx dark:text-white font-serif font-bold italic border-l-4 border-ruby pl-6 md:pl-10">
                  "{aiResponse}"
                </div>
                <div className="flex flex-col md:flex-row gap-4 pt-6">
                   <button onClick={() => onStartExploring('discover')} className="px-10 py-4 bg-onyx dark:bg-ruby text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Seguir Sugestão</button>
                   <button onClick={() => setAiResponse('')} className="px-10 py-4 bg-quartz/10 text-onyx dark:text-quartz rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-quartz/20 transition-all">Nova Consulta</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 py-10 opacity-30">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-offwhite dark:bg-darkCard rounded-full flex items-center justify-center text-ruby border border-quartz/10">
                  <Icons.Star filled />
                </div>
                <p className="font-serif italic text-xl md:text-2xl text-onyx dark:text-white font-bold">Aguardando instruções.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
