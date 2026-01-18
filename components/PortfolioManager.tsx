
import React, { useRef } from 'react';
import { Icons } from '../constants';

interface PortfolioManagerProps {
  images: string[];
  onUpdateImages: (images: string[]) => void;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ images, onUpdateImages, onActionNotify }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostWork = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateImages([reader.result as string, ...images]);
        onActionNotify("Obra Publicada", "Seu novo trabalho já está visível no Radar.", "success");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeWork = (index: number) => {
    if (confirm("Remover esta obra da sua galeria pública?")) {
      const updated = [...images];
      updated.splice(index, 1);
      onUpdateImages(updated);
      onActionNotify("Obra Removida", "A galeria foi atualizada.", "info");
    }
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-fade-in pb-40 px-2 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="space-y-1.5">
          <p className="text-ruby text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Aura & Portfólio</p>
          <h3 className="text-4xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter">Galeria <span className="text-gold">Elite.</span></h3>
          <p className="text-quartz text-[9px] md:text-xs font-medium italic opacity-60">Como os clientes enxergam a qualidade do seu toque.</p>
        </div>
        
        <div className="w-full md:w-auto">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:px-10 py-5 bg-onyx dark:bg-white text-white dark:text-onyx rounded-[25px] font-black uppercase tracking-widest text-[9px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            <Icons.Gallery /> Postar Nova Obra
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePostWork} />
        </div>
      </header>

      {/* GRID DE OBRAS (INSPIRED BY LUXURY FEEDS) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="group relative aspect-[3/4] rounded-[30px] md:rounded-[45px] overflow-hidden luxury-shadow border border-quartz/5 bg-offwhite dark:bg-darkCard transition-all hover:scale-[1.02]"
          >
             <img src={img} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt={`Obra ${idx + 1}`} />
             <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 md:p-10">
                <button 
                  onClick={() => removeWork(idx)}
                  className="w-full py-4 bg-red-600/20 backdrop-blur-md text-red-500 rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
                >
                  Remover do Radar
                </button>
             </div>
             {/* Badge de Verificação Visual */}
             <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center text-gold shadow-2xl">
                   <Icons.Star filled className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
             </div>
          </div>
        ))}
        {images.length === 0 && (
           <div className="col-span-full py-32 text-center opacity-20 flex flex-col items-center justify-center gap-6 border-4 border-dashed border-quartz/10 rounded-[60px]">
              <div className="scale-150"><Icons.Gallery /></div>
              <p className="font-serif italic text-3xl">Sua Aura está vazia.</p>
           </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default PortfolioManager;
