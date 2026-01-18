
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { Employee, Service } from '../types';

interface EmployeeManagerProps {
  employees: Employee[];
  salonServices: Service[];
  onUpdateEmployees: (employees: Employee[]) => void;
  onActionNotify: (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  salonServices,
  onUpdateEmployees,
  onActionNotify
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const openNewEmployee = () => {
    setEditing({
      id: '',
      name: '',
      role: '',
      phone: '',
      photoUrl: '',
      commissionPercent: 30,
      active: true,
      services: salonServices,
      location: { 
        address: 'Ponto de Presença', 
        latitude: -8.8383, 
        longitude: 13.2344 
      }
    });
    setIsModalOpen(true);
  };

  // Alternar camadas do mapa dinamicamente
  const toggleMapMode = () => {
    const newMode = mapMode === 'streets' ? 'satellite' : 'streets';
    setMapMode(newMode);
    
    if (mapInstance.current && (window as any).L) {
      const L = (window as any).L;
      if (tileLayerRef.current) {
        mapInstance.current.removeLayer(tileLayerRef.current);
      }
      
      const url = newMode === 'streets' 
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      
      tileLayerRef.current = L.tileLayer(url).addTo(mapInstance.current);
    }
  };

  useEffect(() => {
    if (isModalOpen && editing && mapContainerRef.current) {
      const timer = setTimeout(() => {
        const L = (window as any).L;
        if (!L) return;

        if (mapInstance.current) {
          mapInstance.current.remove();
        }

        const lat = editing.location?.latitude || -8.8383;
        const lng = editing.location?.longitude || 13.2344;

        mapInstance.current = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 16,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false
        });

        // Layer Inicial (Streets Light para melhor visibilidade)
        const initialUrl = mapMode === 'streets' 
          ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

        tileLayerRef.current = L.tileLayer(initialUrl).addTo(mapInstance.current);

        const customIcon = L.divIcon({
          className: 'custom-pin',
          html: `<div class="w-12 h-12 bg-ruby border-4 border-gold rounded-full shadow-[0_10px_30px_rgba(157,23,77,0.6)] flex items-center justify-center animate-bounce"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 48]
        });

        markerInstance.current = L.marker([lat, lng], { 
          icon: customIcon, 
          draggable: true 
        }).addTo(mapInstance.current);

        markerInstance.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          setEditing(prev => prev ? {
            ...prev,
            location: { ...prev.location!, latitude: pos.lat, longitude: pos.lng }
          } : null);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const saveEmployee = () => {
    if (!editing?.name || !editing.role) {
      onActionNotify('Campos pendentes', 'Nome e especialidade são obrigatórios.', 'error');
      return;
    }

    let updated: Employee[];
    if (editing.id) {
      updated = employees.map(e => (e.id === editing.id ? editing : e));
      onActionNotify('Talento Refinado', 'Sincronização com o Radar concluída.', 'success');
    } else {
      updated = [
        ...employees,
        { ...editing, id: `emp_${Date.now()}` }
      ];
      onActionNotify('Novo Talento', 'O artista agora está visível no ecossistema.', 'success');
    }

    onUpdateEmployees(updated);
    setIsModalOpen(false);
    setEditing(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditing(prev => (prev ? { ...prev, photoUrl: reader.result as string } : prev));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-12 pb-40 animate-fade-in px-4 md:px-0">
      <header className="flex justify-between items-center bg-white/50 dark:bg-darkCard/50 backdrop-blur-xl p-6 rounded-[35px] border border-quartz/10">
        <div className="space-y-1">
          <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em]">Membro de Equipe</p>
          <h2 className="text-3xl md:text-6xl font-serif font-black dark:text-white italic tracking-tighter">
            Seu <span className="text-gold">Time.</span>
          </h2>
        </div>
        <button
          onClick={openNewEmployee}
          className="w-14 h-14 bg-ruby text-white rounded-[22px] flex items-center justify-center shadow-xl active:scale-90 transition-all border border-white/20"
        >
          <Icons.Plus />
        </button>
      </header>

      {/* GRID DE TALENTOS EXISTENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-darkCard p-8 rounded-[45px] luxury-shadow border border-quartz/10 group transition-all hover:border-ruby/30">
            <div className="flex items-center gap-6">
               <div className="relative w-20 h-20 shrink-0">
                  <img src={emp.photoUrl || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-[25px] object-cover border-2 border-gold/20 shadow-xl" />
                  <div className="absolute -top-2 -right-2 bg-emerald text-white p-1.5 rounded-full shadow-lg border border-white"><Icons.Star filled className="w-3 h-3" /></div>
               </div>
               <div className="overflow-hidden">
                  <h3 className="font-serif font-black text-xl dark:text-white italic truncate">{emp.name}</h3>
                  <p className="text-ruby text-[9px] font-black uppercase tracking-[0.2em]">{emp.role}</p>
               </div>
            </div>
            <button
              onClick={() => { setEditing(emp); setIsModalOpen(true); }}
              className="w-full mt-8 py-4 bg-offwhite dark:bg-onyx dark:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all shadow-sm border border-quartz/5"
            >Refinar Ficha</button>
          </div>
        ))}
      </div>

      {/* MODAL FULL-SCREEN COM ENQUADRAMENTO ESTRATÉGICO */}
      {isModalOpen && editing && (
        <div className="fixed inset-0 bg-onyx z-[9000] flex flex-col backdrop-blur-3xl animate-fade-in">
          
          {/* HEADER DO FORMULÁRIO */}
          <header className="p-6 border-b border-quartz/10 bg-white/10 backdrop-blur-xl flex justify-between items-center shrink-0">
             <div className="flex items-center gap-4">
                <button onClick={() => setIsModalOpen(false)} className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 border border-white/10"><div className="rotate-180"><Icons.ChevronRight /></div></button>
                <div>
                   <h3 className="text-lg font-serif font-black text-white italic leading-none">Cadastro de Talento</h3>
                   <p className="text-[7px] font-black uppercase text-gold tracking-widest mt-1">Status: Sincronização Global</p>
                </div>
             </div>
             <button onClick={saveEmployee} className="px-6 py-3 bg-emerald text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Sincronizar</button>
          </header>

          {/* ÁREA DE SCROLL COM CARDS ESTRATÉGICOS */}
          <div className="flex-1 overflow-y-auto px-4 py-10 space-y-12 pb-44 scrollbar-hide">
             <div className="max-w-xl mx-auto space-y-12">
                
                {/* BLOCO 1: IDENTIDADE VISUAL */}
                <section className="bg-white dark:bg-darkCard p-8 rounded-[50px] border border-quartz/10 luxury-shadow space-y-8">
                   <div className="flex flex-col items-center gap-6">
                      <p className="text-[9px] font-black uppercase text-quartz tracking-[0.4em]">01. Aura do Artista</p>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-36 h-36 rounded-[45px] overflow-hidden bg-onyx border-2 border-dashed border-ruby/40 flex items-center justify-center cursor-pointer group shadow-2xl"
                      >
                         {editing.photoUrl ? (
                           <img src={editing.photoUrl} className="w-full h-full object-cover" />
                         ) : (
                           <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity">
                              <Icons.Gallery />
                              <p className="text-[8px] font-black uppercase mt-1">Carregar Foto</p>
                           </div>
                         )}
                         <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-ruby/80 px-4 py-2 rounded-full">Trocar</span>
                         </div>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-stone-400 ml-4 tracking-widest">Nome do Profissional</label>
                        <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} placeholder="Ex: Mauro Vaz" className="w-full h-16 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-3xl px-8 outline-none dark:text-white font-bold text-base focus:border-ruby transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-stone-400 ml-4 tracking-widest">Especialidade Elite</label>
                        <input value={editing.role} onChange={e => setEditing({...editing, role: e.target.value})} placeholder="Ex: Master Colorista" className="w-full h-16 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-3xl px-8 outline-none dark:text-white font-bold text-base focus:border-ruby transition-all shadow-inner" />
                      </div>
                   </div>
                </section>

                {/* BLOCO 2: FINANCEIRO & CONTACTO */}
                <section className="bg-white dark:bg-darkCard p-8 rounded-[50px] border border-quartz/10 luxury-shadow grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-stone-400 ml-4 tracking-widest">Comissão (%)</label>
                      <input type="number" value={editing.commissionPercent} onChange={e => setEditing({...editing, commissionPercent: Number(e.target.value)})} className="w-full h-16 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-3xl px-8 outline-none dark:text-white font-bold text-base focus:border-ruby transition-all shadow-inner" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-stone-400 ml-4 tracking-widest">Telemóvel</label>
                      <input value={editing.phone} onChange={e => setEditing({...editing, phone: e.target.value})} placeholder="9xx xxx xxx" className="w-full h-16 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-3xl px-8 outline-none dark:text-white font-bold text-base focus:border-ruby transition-all shadow-inner" />
                   </div>
                </section>

                {/* BLOCO 3: GEO-RADAR (MELHORADO) */}
                <section className="bg-white dark:bg-darkCard p-1 rounded-[55px] border border-quartz/10 luxury-shadow overflow-hidden group">
                   <div className="p-8 pb-4 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black uppercase text-ruby tracking-[0.4em]">03. Geo-Radar Individual</p>
                        <p className="text-[10px] text-stone-500 font-bold uppercase mt-1">Sincronização GPS Luanda</p>
                      </div>
                      <button 
                        onClick={toggleMapMode}
                        className="bg-onyx dark:bg-white text-white dark:text-onyx px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                      >
                         <Icons.Map /> {mapMode === 'streets' ? 'Ver Satélite' : 'Ver Mapa'}
                      </button>
                   </div>
                   
                   <div className="relative h-80 md:h-[400px] w-full">
                      <div ref={mapContainerRef} className="h-full w-full z-0" />
                      
                      {/* OVERLAY DE COORDENADAS */}
                      <div className="absolute bottom-6 left-6 z-10 bg-white/90 dark:bg-onyx/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-ruby/20 shadow-2xl">
                         <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase text-ruby tracking-widest">Ponto de Sincronia</span>
                            <span className="text-[10px] font-mono font-black dark:text-white">LAT: {editing.location?.latitude.toFixed(5)}</span>
                            <span className="text-[10px] font-mono font-black dark:text-white">LNG: {editing.location?.longitude.toFixed(5)}</span>
                         </div>
                      </div>

                      {/* GUIA VISUAL */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="bg-ruby text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                           <Icons.Plus /> Arraste o PIN para ajustar
                         </div>
                      </div>
                   </div>
                   
                   <p className="p-8 text-[11px] text-stone-500 font-medium italic text-center leading-relaxed">
                     Esta localização será usada pelo **Concierge IA** para sugerir este profissional aos clientes mais próximos em tempo real.
                   </p>
                </section>

                {/* BLOCO 4: CATÁLOGO HERDADO */}
                <section className="bg-white dark:bg-darkCard p-8 rounded-[50px] border border-quartz/10 luxury-shadow space-y-6">
                   <p className="text-[9px] font-black uppercase text-quartz tracking-[0.4em]">04. Rituais Herdados</p>
                   <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                      {salonServices.map(s => (
                        <div key={s.id} className="bg-offwhite dark:bg-onyx p-5 rounded-2xl border border-quartz/5 flex items-center justify-between group transition-all hover:border-gold/30">
                           <div className="flex items-center gap-4">
                              <div className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_#D4AF37]"></div>
                              <span className="text-xs font-bold dark:text-white uppercase">{s.name}</span>
                           </div>
                           <span className="text-[10px] font-black text-ruby uppercase tracking-widest">{s.price.toLocaleString()} Kz</span>
                        </div>
                      ))}
                   </div>
                </section>

             </div>
          </div>

          {/* BOTÃO SALVAR FIXO (MOBILE STRATEGY) */}
          <footer className="shrink-0 p-8 bg-white dark:bg-darkCard border-t border-quartz/10 pb-safe z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
             <div className="max-w-xl mx-auto">
                <button
                  onClick={saveEmployee}
                  className="w-full h-20 bg-ruby text-white rounded-[35px] font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_50px_rgba(157,23,77,0.5)] active:scale-95 transition-all border border-white/20 hover:brightness-110"
                >
                  Confirmar Cadastro Elite
                </button>
             </div>
          </footer>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-pin { filter: drop-shadow(0 15px 15px rgba(0,0,0,0.3)); }
        .leaflet-container { background: #f8f9fa !important; }
      `}} />
    </div>
  );
};

export default EmployeeManager;
