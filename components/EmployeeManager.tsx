
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { Employee, Service, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface EmployeeManagerProps {
  employees: Employee[];
  salonServices: Service[];
  onUpdateEmployees: (employees: Employee[]) => void;
  onActionNotify: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  salonServices,
  onUpdateEmployees,
  onActionNotify
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<Employee> | null>(null);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [isLocating, setIsLocating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const openNewEmployee = () => {
    setEditing({
      name: '',
      role: '',
      phone: '',
      photoUrl: 'https://i.pravatar.cc/150',
      commissionPercent: 30,
      active: true,
      services: [],
      location: { address: 'Luanda, Angola', latitude: -8.8383, longitude: 13.2344 }
    });
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    if (!editing?.name || !editing.role) {
      onActionNotify('Campos Obrigatórios', 'Preencha o nome e a patente do artista.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // 1. REGISTRAR NA TABELA PROFILES (REGRA DO CLIENTE)
      const profileId = editing.id || `pro_${Date.now()}`;
      
      const { error } = await supabase.from('profiles').upsert({
        id: profileId,
        full_name: editing.name,
        role: 'PROFESSIONAL',
        phone: editing.phone,
        photo_url: editing.photoUrl,
        lat: editing.location?.latitude,
        lng: editing.location?.longitude,
        bio: editing.role,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      // 2. ATUALIZAR LISTA LOCAL
      onUpdateEmployees([]); // Força refresh se houver fetch, ou atualiza lista manual
      onActionNotify('Artista Sincronizado', `${editing.name} agora está ativo no radar.`, 'success');
      setIsModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      onActionNotify('Erro de Sincronização', 'Falha ao registrar profissional no banco de dados.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && editing && mapContainerRef.current && (window as any).L) {
      const timer = setTimeout(() => {
        const L = (window as any).L;
        if (mapInstance.current) mapInstance.current.remove();

        const map = L.map(mapContainerRef.current, {
          center: [editing.location?.latitude || -8.8383, editing.location?.longitude || 13.2344],
          zoom: 16,
          zoomControl: false,
          attributionControl: false
        });
        mapInstance.current = map;

        const url = mapMode === 'streets' 
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

        L.tileLayer(url).addTo(map);

        const customIcon = L.divIcon({
          className: 'custom-pin-emp',
          html: `<div class="w-10 h-10 bg-gold border-4 border-white rounded-full shadow-2xl"></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        markerInstance.current = L.marker([editing.location?.latitude || -8.8383, editing.location?.longitude || 13.2344], { 
          icon: customIcon, 
          draggable: true 
        }).addTo(map);

        markerInstance.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          setEditing(prev => prev ? { ...prev, location: { ...prev.location!, latitude: pos.lat, longitude: pos.lng } } : null);
        });
        
        map.invalidateSize();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, mapMode]);

  return (
    <div className="space-y-12 animate-fade-in px-4">
      <header className="flex flex-col items-center text-center gap-6">
        <div className="space-y-2">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Gestão de Capital Humano</p>
          <h2 className="text-5xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter leading-none">Membros da <span className="text-gold">Maison.</span></h2>
        </div>
        <button onClick={openNewEmployee} className="px-12 py-5 bg-ruby text-white rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10">
          <Icons.Plus /> Registrar Novo Artista
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed border-quartz/20 rounded-[50px]">
            <p className="font-serif italic text-2xl dark:text-white">Nenhum artista vinculado ainda.</p>
          </div>
        ) : employees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-darkCard p-8 rounded-[45px] luxury-shadow border border-quartz/10 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-[30px] overflow-hidden border-2 border-gold/30 shadow-xl">
               <img src={emp.photoUrl} className="w-full h-full object-cover" alt={emp.name} />
            </div>
            <div>
               <h3 className="font-serif font-black text-2xl dark:text-white italic leading-tight">{emp.name}</h3>
               <p className="text-ruby text-[9px] font-black uppercase tracking-widest mt-1">{emp.role}</p>
            </div>
            <button onClick={() => { setEditing(emp); setIsModalOpen(true); }} className="w-full py-4 bg-offwhite dark:bg-onyx dark:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-ruby transition-all border border-quartz/10">Editar Perfil</button>
          </div>
        ))}
      </div>

      {isModalOpen && editing && (
        <div className="fixed inset-0 z-[10000] bg-onyx flex flex-col animate-fade-in overflow-hidden">
          <header className="shrink-0 p-6 border-b border-white/10 bg-white/5 backdrop-blur-2xl flex justify-between items-center safe-top">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
                   <Icons.User />
                </div>
                <div>
                   <h3 className="text-xl font-serif font-black text-white italic leading-none">Ficha do Artista</h3>
                   <p className="text-[7px] font-black uppercase text-gold tracking-[0.3em] mt-1">Sincronização Profissional Pro</p>
                </div>
             </div>
             <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-ruby transition-all active:scale-90">✕</button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10 scrollbar-hide pb-44">
             <div className="max-w-xl mx-auto space-y-12">
                
                {/* UPLOAD AVATAR ARTISTA */}
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-36 h-36 rounded-[45px] overflow-hidden bg-white/10 border-2 border-dashed border-ruby/40 flex items-center justify-center cursor-pointer group hover:scale-105 transition-all"
                  >
                     {editing.photoUrl ? <img src={editing.photoUrl} className="w-full h-full object-cover" /> : <Icons.Gallery />}
                  </div>
                  <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Foto de Patente</p>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setEditing({...editing, photoUrl: reader.result as string});
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>

                <div className="space-y-6">
                   <div className="bg-white p-2 rounded-full shadow-2xl">
                      <label className="text-[9px] font-black uppercase text-ruby ml-8 mt-4 block tracking-widest">Nome do Profissional</label>
                      <input 
                        value={editing.name} 
                        onChange={e => setEditing({...editing, name: e.target.value})} 
                        placeholder="Ex: Carlos Cabeleireiro"
                        className="w-full h-14 px-8 outline-none text-onyx font-bold text-center text-base bg-transparent" 
                      />
                   </div>
                   <div className="bg-white p-2 rounded-full shadow-2xl">
                      <label className="text-[9px] font-black uppercase text-gold ml-8 mt-4 block tracking-widest">Especialidade / Bio Curta</label>
                      <input 
                        value={editing.role} 
                        onChange={e => setEditing({...editing, role: e.target.value})} 
                        placeholder="Ex: Master em Mechas Platinadas"
                        className="w-full h-14 px-8 outline-none text-onyx font-bold text-center text-base bg-transparent" 
                      />
                   </div>
                </div>

                {/* MAPA DE ATUAÇÃO INDIVIDUAL */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase text-quartz text-center tracking-widest">Geolocalização do Artista</p>
                   <div className="h-72 w-full rounded-[45px] overflow-hidden border border-white/10 luxury-shadow relative">
                      <div ref={mapContainerRef} className="h-full w-full z-0" />
                      <button onClick={() => setMapMode(m => m === 'streets' ? 'satellite' : 'streets')} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-ruby shadow-xl"><Icons.Gallery /></button>
                   </div>
                </div>
             </div>
          </div>

          <footer className="shrink-0 p-8 border-t border-white/10 bg-onyx/90 backdrop-blur-2xl safe-bottom">
             <div className="max-w-xl mx-auto flex flex-col gap-4">
                <button 
                  onClick={handleSaveEmployee} 
                  disabled={isSaving}
                  className="w-full py-6 bg-emerald text-white rounded-full font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10"
                >
                   {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sincronizar Artista'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="w-full text-quartz font-black uppercase text-[8px] tracking-[0.4em] py-2 text-center">Cancelar Registro</button>
             </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
