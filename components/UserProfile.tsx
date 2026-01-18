
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { User, UserRole } from '../types';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
  onNavigateToSupport?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user?.name || 'Membro Elite');
  const [phone, setPhone] = useState(user?.phone || '+244 ');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200');
  const [location, setLocation] = useState({ lat: -8.8383, lng: 13.2344, address: 'Luanda, Angola' });
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  // Inicialização do Mapa
  useEffect(() => {
    if (mapContainerRef.current) {
      const timer = setTimeout(() => {
        const L = (window as any).L;
        if (!L) return;

        if (mapInstance.current) mapInstance.current.remove();

        mapInstance.current = L.map(mapContainerRef.current, {
          center: [location.lat, location.lng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false
        });

        const url = mapMode === 'streets' 
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

        tileLayerRef.current = L.tileLayer(url).addTo(mapInstance.current);

        const customIcon = L.divIcon({
          className: 'custom-pin',
          html: `<div class="w-10 h-10 bg-ruby border-2 border-white rounded-full shadow-2xl flex items-center justify-center animate-bounce"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        markerInstance.current = L.marker([location.lat, location.lng], { 
          icon: customIcon, 
          draggable: true 
        }).addTo(mapInstance.current);

        markerInstance.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          setLocation(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mapMode]);

  const toggleMapMode = () => setMapMode(prev => prev === 'streets' ? 'satellite' : 'streets');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Identidade e Localização sincronizadas com o ecossistema Glow.");
    }, 1000);
  };

  const getRoleLabel = () => {
    if (user?.role === UserRole.PROFESSIONAL) return 'Artista Glow';
    if (user?.role === UserRole.SALON) return 'Gestor Maison';
    return 'Membro Elite';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-40 px-4 md:px-0">
      {/* HEADER DE IDENTIDADE */}
      <header className="flex flex-col md:flex-row items-center gap-10 p-10 bg-white dark:bg-darkCard rounded-[50px] luxury-shadow border border-quartz/10 relative overflow-hidden transition-all text-center md:text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="relative group shrink-0" onClick={() => fileInputRef.current?.click()}>
           <div className="w-36 h-36 rounded-[45px] border-4 border-offwhite dark:border-onyx overflow-hidden shadow-2xl cursor-pointer relative overflow-hidden">
              <img src={photoUrl} className="w-full h-full object-cover" alt="Perfil" />
              <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                 <Icons.Plus />
                 <span className="text-[8px] font-black text-white uppercase tracking-widest mt-1">Alterar</span>
              </div>
           </div>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className="flex-1 relative z-10">
           <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em] mb-1">Membro Oficial</p>
           <h2 className="text-4xl md:text-6xl font-serif font-black dark:text-white italic tracking-tighter leading-none">{name}</h2>
           <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start">
              <span className="bg-gold/10 text-gold px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gold/10">{getRoleLabel()}</span>
              <span className="bg-emerald/10 text-emerald px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald/10">Verificado</span>
           </div>
        </div>
      </header>

      {/* DADOS GERAIS E LOCALIZAÇÃO */}
      <div className="bg-white dark:bg-darkCard rounded-[50px] p-10 md:p-14 luxury-shadow border border-quartz/10 space-y-12">
         <div className="flex justify-between items-center border-b border-quartz/5 pb-8">
            <h3 className="text-3xl font-serif font-black dark:text-white italic">Dados <span className="text-ruby">Gerais.</span></h3>
            <div className="hidden md:flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-ruby rounded-full animate-pulse"></div>
               <span className="text-[8px] font-black text-quartz uppercase tracking-widest">Sincronização Live</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">Nome Público</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl py-5 px-8 outline-none font-bold text-sm dark:text-white shadow-inner focus:border-ruby transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">Contacto Directo</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl py-5 px-8 outline-none font-bold text-sm dark:text-white shadow-inner focus:border-ruby transition-all" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-4">E-mail Registrado</label>
              <input type="text" value={user?.email || ''} readOnly className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl py-5 px-8 outline-none font-bold text-sm opacity-50 dark:text-white" />
            </div>
         </div>

         {/* INTEGRAÇÃO DE MAPA NA FICHA */}
         <div className="space-y-6 pt-6">
            <div className="flex justify-between items-center px-4">
               <div>
                  <p className="text-[9px] font-black uppercase text-ruby tracking-[0.3em]">Minha Localização no Radar</p>
                  <p className="text-[10px] text-stone-500 font-medium">Arraste o PIN para sua morada exacta</p>
               </div>
               <button 
                  onClick={toggleMapMode}
                  className="bg-onyx dark:bg-white text-white dark:text-onyx px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
               >
                  <Icons.Map /> {mapMode === 'streets' ? 'Satélite' : 'Mapa'}
               </button>
            </div>
            
            <div className="relative h-72 md:h-96 w-full rounded-[40px] overflow-hidden border border-quartz/10 luxury-shadow group">
               <div ref={mapContainerRef} className="h-full w-full z-0" />
               <div className="absolute bottom-6 right-6 z-10 bg-onyx/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-white font-mono text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                  LAT: {location.lat.toFixed(5)} | LNG: {location.lng.toFixed(5)}
               </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4 pt-8">
            <button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 py-7 bg-ruby text-white rounded-[30px] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all border border-white/10">
              {isSaving ? 'Sincronizando Identidade...' : 'Guardar Alterações'}
            </button>
            <button onClick={onLogout} className="flex-1 py-7 bg-onyx text-white dark:bg-white dark:text-onyx rounded-[30px] font-black uppercase text-[10px] tracking-[0.3em] border border-white/5 active:scale-95 transition-all">
              Terminar Sessão
            </button>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
         .custom-pin { filter: drop-shadow(0 15px 15px rgba(0,0,0,0.4)); }
         .leaflet-container { background: #0F0F14 !important; }
      `}} />
    </div>
  );
};

export default UserProfile;
