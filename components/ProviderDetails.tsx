
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
  const [activeTab, setActiveTab] = useState<'services' | 'gallery' | 'about'>('services');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className={`fixed inset-0 z-[5500] bg-onyx transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      <button 
        onClick={onClose} 
        className="fixed top-6 left-6 z-[6000] w-12 h-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all"
      >
        <div className="rotate-180 scale-125"><Icons.ChevronRight /></div>
      </button>

      <div className="h-full overflow-y-auto scrollbar-hide flex flex-col md:flex-row bg-offwhite dark:bg-onyx">
        
        <div className="relative h-[45vh] md:h-full md:w-[500px] shrink-0">
           <img src={provider.portfolio[0]} className="w-full h-full object-cover grayscale-[5%]" alt={provider.businessName} />
           <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent"></div>
           
           <div className="absolute bottom-10 left-8 right-8 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-ruby rounded-full animate-ping"></div>
                 <p className="text-ruby text-[9px] font-black uppercase tracking-[0.5em]">Patente Verificada Ouro</p>
              </div>
              <h2 className="text-4xl md:text-7xl font-serif font-black text-white italic leading-tight tracking-tighter leading-none">{provider.businessName}</h2>
           </div>
        </div>

        <div className="flex-1 bg-offwhite dark:bg-onyx md:rounded-l-[60px] -mt-10 md:mt-0 relative z-10 p-0 md:p-16 pb-48">
           <div className="flex gap-8 mb-8 border-b border-quartz/10 px-8 pt-12 md:pt-0 overflow-x-auto scrollbar-hide whitespace-nowrap">
              <button 
                onClick={() => setActiveTab('services')}
                className={`pb-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-2 ${activeTab === 'services' ? 'border-ruby text-ruby' : 'border-transparent text-quartz'}`}
              >Menu de Rituais</button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`pb-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-2 ${activeTab === 'gallery' ? 'border-ruby text-ruby' : 'border-transparent text-quartz'}`}
              >Galeria Elite</button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`pb-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-2 ${activeTab === 'about' ? 'border-ruby text-ruby' : 'border-transparent text-quartz'}`}
              >Narrativa Pro</button>
           </div>

           {activeTab === 'services' && (
             <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0 animate-fade-in pb-10">
                {provider.services.map((s, idx) => (
                   <div 
                    key={s.id} 
                    onClick={() => onSelectService(s)}
                    className="group bg-white dark:bg-darkCard rounded-[35px] overflow-hidden luxury-shadow border border-quartz/5 hover:border-ruby/40 transition-all flex flex-col active:scale-[0.98] cursor-pointer"
                   >
                      <div className="relative aspect-square w-full overflow-hidden">
                         <img src={s.photoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                         <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white font-serif font-black text-sm md:text-lg italic leading-tight line-clamp-2">{s.name}</p>
                         </div>
                      </div>
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                         <div className="space-y-1">
                            <p className="text-ruby font-black text-lg leading-none">{s.price.toLocaleString()} Kz</p>
                            <p className="text-quartz text-[8px] font-black uppercase tracking-widest">{s.durationMinutes} min</p>
                         </div>
                         <button className="w-full py-3 bg-secondary text-white dark:bg-white dark:text-onyx rounded-xl text-[7px] font-black uppercase tracking-widest group-hover:bg-ruby group-hover:text-white transition-all shadow-lg border border-gold/20">Solicitar Ritual</button>
                      </div>
                   </div>
                ))}
             </div>
           )}

           {activeTab === 'gallery' && (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0 animate-fade-in">
                {provider.portfolio.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImage(img)}
                    className="group relative aspect-[3/4] rounded-[40px] overflow-hidden luxury-shadow border border-quartz/10 cursor-zoom-in"
                  >
                    <img src={img} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <p className="text-white text-[10px] font-black uppercase tracking-widest bg-gold/80 px-4 py-2 rounded-full">Ver em Alta</p>
                    </div>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'about' && (
             <div className="space-y-12 animate-fade-in p-8">
                <div className="space-y-4">
                  <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">A Essência do Atelier</p>
                  <p className="text-xl font-serif italic text-stone-500 leading-relaxed dark:text-quartz">"{provider.bio}"</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3 p-8 bg-white dark:bg-darkCard rounded-[40px] luxury-shadow border border-quartz/5">
                      <p className="text-[9px] font-black uppercase text-ruby tracking-[0.3em]">Endereço de Prestígio</p>
                      <p className="text-sm font-bold dark:text-white">{provider.location.address}</p>
                   </div>
                   <div className="space-y-3 p-8 bg-white dark:bg-darkCard rounded-[40px] luxury-shadow border border-quartz/5">
                      <p className="text-[9px] font-black uppercase text-gold tracking-[0.3em]">Janelas de Ritual</p>
                      <p className="text-sm font-bold dark:text-white">Aberto: {provider.openingHours || '24/7 sob demanda'}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* LIGHTBOX DE LUXO */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[8000] bg-onyx/98 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
           <button className="absolute top-10 right-10 text-white hover:text-ruby transition-colors w-12 h-12 flex items-center justify-center bg-white/10 rounded-full">✕</button>
           <div className="max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center">
              <img src={selectedImage} className="w-full h-full object-contain rounded-[40px] shadow-[0_0_80px_rgba(212,175,55,0.2)]" />
              <div className="mt-8 text-center space-y-2">
                 <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em]">Obra Elite Beleza Glow</p>
                 <p className="text-white font-serif italic text-2xl">Maison: {provider.businessName}</p>
              </div>
           </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-darkCard/95 backdrop-blur-3xl border-t border-quartz/10 flex gap-4 z-[7000] pb-safe shadow-2xl md:hidden">
         <button onClick={onOpenChat} className="flex-1 py-4 bg-offwhite dark:bg-onyx dark:text-white rounded-2xl font-black text-[9px] uppercase border border-quartz/10">Conversar</button>
         <button onClick={() => setActiveTab('services')} className="flex-[2] py-4 bg-ruby text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl border border-gold/20">Menu Especial</button>
      </footer>
    </div>
  );
};

export default ProviderDetails;
