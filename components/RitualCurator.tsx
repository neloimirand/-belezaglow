
import React, { useState, useRef } from 'react';
import { Icons } from '../constants';
import { Service, User } from '../types';
import { supabase } from '../lib/supabase';

interface RitualCuratorProps {
  user: User | null;
  services: Service[];
  onUpdateServices: () => void;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const RitualCurator: React.FC<RitualCuratorProps> = ({ user, services, onUpdateServices, onActionNotify }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const ritualFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!editingService?.name || !editingService?.price || !user) {
        onActionNotify("Campos Obrigatórios", "Defina o Nome e o Valor do ritual.", "error");
        return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: editingService.id || undefined,
        provider_id: user.id,
        name: editingService.name,
        price: Number(editingService.price),
        duration: Number(editingService.durationMinutes),
        description: editingService.specification,
        photo_url: editingService.photoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600',
        category_id: 'geral'
      };

      const { error } = await supabase.from('services').upsert(payload);
      if (error) throw error;

      onActionNotify("Ritual Sincronizado", "Publicado com sucesso no Radar Global.", "success");
      onUpdateServices(); 
      setIsAdding(false);
      setEditingService(null);
    } catch (err) {
      onActionNotify("Erro de Sincronização", "Verifique sua conexão.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingService(prev => prev ? { ...prev, photoUrl: event.target.result as string } : prev);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-32">
      <header className="flex flex-col items-center text-center gap-8 px-4">
        <div className="space-y-3">
          <p className="text-ruby text-[11px] font-black uppercase tracking-[0.6em]">Catálogo de Experiências</p>
          <h3 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">Meus <span className="text-gold">Rituais.</span></h3>
        </div>
        <button 
          onClick={() => { setEditingService({ name: '', price: 0, durationMinutes: 60, specification: '' }); setIsAdding(true); }}
          className="w-full md:w-auto px-16 py-6 bg-ruby text-white rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10"
        >
          <Icons.Plus /> Criar Novo Ritual Elite
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
        {services.length === 0 ? (
          <div className="col-span-full py-32 text-center opacity-30 border-2 border-dashed border-quartz/20 rounded-[60px]">
            <p className="font-serif italic text-3xl dark:text-white">Seu menu de rituais está vazio.</p>
          </div>
        ) : services.map(s => (
          <div key={s.id} className="bg-white dark:bg-darkCard rounded-[50px] overflow-hidden luxury-shadow border border-quartz/10 flex flex-col h-full group transition-all">
            <div className="aspect-[16/10] w-full overflow-hidden">
               <img src={s.photoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400'} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
               <div className="text-center">
                  <h4 className="font-serif font-black text-2xl italic dark:text-white leading-tight">{s.name}</h4>
                  <p className="text-ruby font-black text-2xl mt-3">{s.price.toLocaleString()} Kz</p>
                  <p className="text-quartz text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">{s.durationMinutes} minutos de ritual</p>
               </div>
               <button onClick={() => { setEditingService(s); setIsAdding(true); }} className="w-full py-5 bg-offwhite dark:bg-onyx text-onyx dark:text-white rounded-[25px] text-[10px] font-black uppercase tracking-widest border border-quartz/10 hover:text-ruby transition-all">Editar Ritual</button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && editingService && (
        <div className="fixed inset-0 z-[10000] bg-onyx flex flex-col animate-fade-in overflow-hidden">
          
          <header className="shrink-0 p-6 border-b border-white/10 bg-white/5 backdrop-blur-2xl flex justify-between items-center safe-top">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ruby/10 rounded-2xl flex items-center justify-center text-ruby border border-ruby/20">
                   <Icons.Plus />
                </div>
                <div>
                   <h3 className="text-xl font-serif font-black text-white italic leading-none">Editor de Ritual</h3>
                   <p className="text-[8px] font-black uppercase text-gold tracking-[0.3em] mt-1">Sincronização Radar Pro</p>
                </div>
             </div>
             <button onClick={() => setIsAdding(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-ruby transition-all active:scale-90">✕</button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-10 space-y-12 scrollbar-hide pb-44 bg-onyx">
            <div className="max-w-xl mx-auto space-y-12">
              
              <div className="space-y-4 text-center">
                <p className="text-[10px] font-black uppercase text-quartz tracking-[0.4em]">Capa do Serviço</p>
                <div 
                  onClick={() => ritualFileInputRef.current?.click()}
                  className="relative w-full aspect-video rounded-[50px] overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer group hover:border-ruby/40 transition-all"
                >
                  {editingService.photoUrl ? (
                    <img src={editingService.photoUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="text-center opacity-30 text-white space-y-4">
                      <div className="flex justify-center scale-150"><Icons.Gallery /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Selecione uma imagem de impacto</p>
                    </div>
                  )}
                  <input type="file" ref={ritualFileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-2 rounded-full shadow-2xl">
                   <label className="text-[10px] font-black uppercase text-ruby ml-8 mt-4 block tracking-[0.3em]">Identidade do Ritual</label>
                   <input 
                    value={editingService.name} 
                    onChange={e => setEditingService({...editingService, name: e.target.value})} 
                    placeholder="Ex: Corte Artístico Elite" 
                    className="w-full h-16 px-10 outline-none text-onyx font-bold text-center text-lg bg-transparent" 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-2 rounded-full shadow-2xl">
                    <label className="text-[10px] font-black uppercase text-gold ml-8 mt-4 block tracking-[0.3em]">Valor (Kz)</label>
                    <input 
                      type="number" 
                      value={editingService.price} 
                      onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} 
                      placeholder="0" 
                      className="w-full h-16 px-10 outline-none text-onyx font-bold text-center text-lg bg-transparent" 
                    />
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-2xl">
                    <label className="text-[10px] font-black uppercase text-emerald ml-8 mt-4 block tracking-[0.3em]">Minutos</label>
                    <input 
                      type="number" 
                      value={editingService.durationMinutes} 
                      onChange={e => setEditingService({...editingService, durationMinutes: Number(e.target.value)})} 
                      placeholder="60" 
                      className="w-full h-16 px-10 outline-none text-onyx font-bold text-center text-lg bg-transparent" 
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-[45px] shadow-2xl">
                  <label className="text-[10px] font-black uppercase text-quartz ml-8 mt-4 block tracking-[0.3em] text-center">Narrativa do Ritual</label>
                  <textarea 
                    value={editingService.specification} 
                    onChange={e => setEditingService({...editingService, specification: e.target.value})} 
                    placeholder="Descreva a experiência luxuosa para o cliente..." 
                    className="w-full h-44 px-8 py-6 outline-none text-onyx font-medium text-center text-base bg-transparent resize-none leading-relaxed" 
                  />
                </div>
              </div>
            </div>
          </div>

          <footer className="shrink-0 p-8 border-t border-white/10 bg-onyx/90 backdrop-blur-2xl safe-bottom">
             <div className="max-w-xl mx-auto flex flex-col gap-4">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full py-7 bg-ruby text-white rounded-full font-black uppercase tracking-[0.5em] text-[12px] shadow-[0_30px_70px_rgba(157,23,77,0.5)] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 border border-white/10"
                >
                    {isSaving ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sincronizar Ritual'}
                </button>
                <button onClick={() => setIsAdding(false)} className="w-full py-2 text-quartz font-black uppercase text-[9px] tracking-[0.4em] hover:text-white transition-all text-center">Cancelar</button>
             </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default RitualCurator;
