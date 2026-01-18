
import React, { useState, useRef } from 'react';
import { Icons } from '../constants';
import { Service, User } from '../types';
import { GoogleGenAI } from "@google/genai";

interface RitualCuratorProps {
  user: User | null;
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const RitualCurator: React.FC<RitualCuratorProps> = ({ user, services, onUpdateServices, onActionNotify }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const ritualFileInputRef = useRef<HTMLInputElement>(null);

  const handleOptimizeDescription = async () => {
    if (!editingService?.name) return alert("Defina o nome do ritual primeiro.");
    setIsOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Crie uma descrição técnica e luxuosa para o serviço de beleza "${editingService.name}". Use tom sofisticado, português de Angola, mencione exclusividade. Máximo 150 caracteres.`,
      });
      setEditingService(prev => ({ ...prev, specification: response.text }));
      onActionNotify("Glow IA Optimizer", "Narrativa técnica aprimorada.", "success");
    } catch (err) {
      onActionNotify("Erro IA", "Indisponível no momento.", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingService(prev => prev ? { ...prev, photoUrl: reader.result as string } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!editingService?.name || !editingService?.price) {
        onActionNotify("Erro", "Nome e preço são obrigatórios.", "error");
        return;
    }
    if (editingService.id) {
      onUpdateServices(services.map(s => s.id === editingService.id ? editingService as Service : s));
    } else {
      const newS: Service = {
        ...editingService as Service,
        id: 's' + Date.now(),
        providerId: user?.id || 'pro',
        categoryId: 'geral',
        photoUrl: editingService.photoUrl || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400'
      };
      onUpdateServices([newS, ...services]);
    }
    setIsAdding(false);
    setEditingService(null);
    onActionNotify("Menu Atualizado", "Ritual publicado no catálogo.", "success");
  };

  return (
    <div className="space-y-10 animate-fade-in pb-40 px-2 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
        <div className="space-y-2">
          <p className="text-ruby text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Curadoria de Serviços</p>
          <h3 className="text-4xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter">Menu de <span className="text-gold">Rituais.</span></h3>
        </div>
        <button 
          onClick={() => { setEditingService({ name: '', price: 0, durationMinutes: 60, specification: '' }); setIsAdding(true); }}
          className="w-full md:w-auto px-10 py-5 bg-ruby text-white rounded-[25px] font-black uppercase tracking-widest text-[9px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4"
        >
          <Icons.Plus /> Novo Ritual
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed border-quartz/20 rounded-[45px]">
            <p className="font-serif italic text-2xl">Nenhum ritual cadastrado.</p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-ruby">Toque no botão acima para começar</p>
          </div>
        )}
        {services.map(s => (
          <div key={s.id} className="bg-white dark:bg-darkCard rounded-[40px] md:rounded-[45px] overflow-hidden luxury-shadow border border-quartz/10 group flex flex-col active:scale-[0.98] transition-all">
            <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => { setEditingService(s); setIsAdding(true); }}>
               <img src={s.photoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 left-8 text-white italic font-serif font-black text-xl">{s.name}</div>
            </div>
            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
               <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-ruby font-black text-xl md:text-2xl">{s.price.toLocaleString()} Kz</p>
                    <p className="text-[8px] font-black text-quartz uppercase tracking-widest">{s.durationMinutes} MIN</p>
                  </div>
                  <p className="text-quartz text-[10px] font-medium line-clamp-2 italic leading-relaxed">{s.specification || 'Refine este ritual com a nossa IA.'}</p>
               </div>
               <button onClick={() => { setEditingService(s); setIsAdding(true); }} className="w-full py-4 bg-offwhite dark:bg-onyx text-quartz rounded-2xl text-[8px] font-black uppercase tracking-widest hover:text-ruby transition-colors border border-quartz/5">Refinar Ritual</button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && editingService && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center p-0 md:p-4 backdrop-blur-3xl bg-onyx/95 overflow-y-auto">
          <div className="bg-white dark:bg-darkCard w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-[60px] p-6 md:p-16 space-y-8 shadow-2xl animate-fade-in md:my-8 relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-offwhite dark:bg-onyx flex items-center justify-center hover:text-ruby transition-all z-10">✕</button>

            <header className="text-center pt-8 md:pt-0">
              <h3 className="text-3xl font-serif font-black dark:text-white italic">{editingService.id ? 'Refinar' : 'Novo'} <span className="text-ruby">Ritual.</span></h3>
            </header>
            
            <div className="space-y-6">
               <div 
                  onClick={() => ritualFileInputRef.current?.click()}
                  className="relative w-full aspect-video rounded-[35px] overflow-hidden bg-offwhite dark:bg-onyx border-2 border-dashed border-quartz/20 flex items-center justify-center cursor-pointer group"
               >
                  {editingService.photoUrl ? (
                     <img src={editingService.photoUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                     <div className="text-center space-y-2 opacity-40">
                        <Icons.Gallery />
                        <p className="text-[8px] font-black uppercase tracking-widest">Capa do Ritual</p>
                     </div>
                  )}
                  <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">Trocar</span>
                  </div>
               </div>
               <input type="file" ref={ritualFileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase text-quartz ml-4 tracking-widest">Nome Público</label>
                     <input value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} placeholder="Ex: Corte Sculpting Pro" className="w-full bg-offwhite dark:bg-onyx p-5 rounded-[22px] border border-quartz/10 dark:text-white font-bold shadow-inner" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase text-quartz ml-4 tracking-widest">Valor (Kz)</label>
                        <input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} className="w-full bg-offwhite dark:bg-onyx p-5 rounded-[22px] border border-quartz/10 dark:text-white font-bold shadow-inner" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase text-quartz ml-4 tracking-widest">Tempo (min)</label>
                        <input type="number" value={editingService.durationMinutes} onChange={e => setEditingService({...editingService, durationMinutes: Number(e.target.value)})} className="w-full bg-offwhite dark:bg-onyx p-5 rounded-[22px] border border-quartz/10 dark:text-white font-bold shadow-inner" />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[8px] font-black uppercase text-quartz tracking-widest">Narrativa Elite (IA)</label>
                    <button onClick={handleOptimizeDescription} disabled={isOptimizing} className="text-ruby text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all">
                      {isOptimizing ? 'Otimizando...' : <><Icons.Star filled className="w-2.5 h-2.5" /> Glow Optimizer</>}
                    </button>
                  </div>
                  <textarea 
                    value={editingService.specification} 
                    onChange={e => setEditingService({...editingService, specification: e.target.value})} 
                    placeholder="Como você descreveria este ritual para um cliente VIP?"
                    className="w-full bg-offwhite dark:bg-onyx p-5 rounded-[25px] border border-quartz/10 dark:text-white font-medium h-32 md:h-40 resize-none text-xs md:text-sm shadow-inner" 
                  />
               </div>
            </div>

            <div className="pt-4">
               <button onClick={handleSave} className="w-full py-6 md:py-8 bg-ruby text-white rounded-[30px] md:rounded-[40px] font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] shadow-2xl active:scale-95 transition-all border border-white/10">Publicar Ritual no Radar</button>
               <button onClick={() => setIsAdding(false)} className="w-full py-4 text-quartz font-black uppercase text-[8px] tracking-[0.3em] mt-2 md:hidden">Cancelar e Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RitualCurator;
