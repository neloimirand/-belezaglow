
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onUpdateUser }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200');
  const [location, setLocation] = useState({ lat: user?.lat || -8.8383, lng: user?.lng || 13.2344, address: 'Luanda, Angola' });
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [isLocating, setIsLocating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      if (user.photoUrl) setPhotoUrl(user.photoUrl);
      if (user.lat && user.lng) setLocation(prev => ({ ...prev, lat: user.lat!, lng: user.lng! }));
    }
  }, [user]);

  useEffect(() => {
    const initMap = () => {
      if (!mapContainerRef.current || !(window as any).L) return;
      const L = (window as any).L;

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      try {
        const map = L.map(mapContainerRef.current, {
          center: [location.lat, location.lng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
          tap: false
        });

        mapInstance.current = map;
        const url = mapMode === 'streets' 
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        
        L.tileLayer(url).addTo(map);

        const customIcon = L.divIcon({
          className: 'custom-pin-pro',
          html: `<div class="relative flex items-center justify-center"><div class="absolute w-12 h-12 bg-ruby/20 rounded-full animate-ping"></div><div class="w-10 h-10 bg-ruby border-4 border-white rounded-full shadow-2xl"></div></div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        markerInstance.current = L.marker([location.lat, location.lng], { 
          icon: customIcon, 
          draggable: true 
        }).addTo(map);

        markerInstance.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          setLocation(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
        });

        setTimeout(() => map.invalidateSize(), 400);
      } catch (e) {
        console.warn("Map Init Silent Error:", e);
      }
    };

    const timer = setTimeout(initMap, 500);
    return () => {
      clearTimeout(timer);
      if (mapInstance.current) mapInstance.current.remove();
    };
  }, [mapMode, location.lat, location.lng]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      // 1. Sincronizar com o Supabase
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: name,
        phone: phone,
        photo_url: photoUrl,
        lat: location.lat,
        lng: location.lng,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      
      // 2. Criar objeto de usuário atualizado
      const updatedUser: User = { 
        ...user, 
        name, 
        phone, 
        photoUrl,
        lat: location.lat,
        lng: location.lng
      };
      
      // 3. Atualizar estado global (isso sincroniza a Home/Header automaticamente)
      onUpdateUser(updatedUser);
      
      alert("Perfil Elite actualizado globalmente. Sua foto de patente já está visível em todo o ecossistema.");
    } catch (err) {
      console.error(err);
      alert("Erro ao sincronizar perfil. Verifique seu sinal de rede.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
        mapInstance.current?.flyTo([latitude, longitude], 17);
        markerInstance.current?.setLatLng([latitude, longitude]);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-40 px-4">
      <header className="flex flex-col items-center text-center space-y-8 p-10 md:p-14 bg-white dark:bg-darkCard rounded-[50px] md:rounded-[60px] luxury-shadow border border-quartz/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-ruby"></div>
        
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
           <div className="w-44 h-44 rounded-[50px] border-4 border-offwhite dark:border-onyx overflow-hidden shadow-2xl relative transition-all active:scale-95 group-hover:brightness-90">
              <img src={photoUrl} className="w-full h-full object-cover" alt="Perfil" />
              <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                 <div className="text-white scale-150"><Icons.Plus /></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest mt-3">Mudar Foto</span>
              </div>
           </div>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
           
           <div className="absolute -bottom-2 -right-2 bg-emerald text-white p-2.5 rounded-2xl shadow-xl border-2 border-white">
              <Icons.Star filled className="w-5 h-5" />
           </div>
        </div>

        <div className="space-y-3 w-full">
           <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Membro de Prestígio</p>
           <h2 className="text-4xl md:text-6xl font-serif font-black dark:text-white italic tracking-tighter leading-none truncate px-4">{name || 'Membro Elite'}</h2>
           <div className="flex justify-center gap-2">
              <span className="bg-gold/10 text-gold px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gold/10 shadow-sm">Patente Verificada</span>
           </div>
        </div>
      </header>

      <div className="bg-white dark:bg-darkCard rounded-[50px] md:rounded-[60px] p-8 md:p-16 luxury-shadow border border-quartz/10 space-y-12">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 text-center md:text-left">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ruby ml-1">Identidade do Perfil</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo" className="w-full bg-offwhite border-2 border-transparent focus:border-ruby rounded-full py-5 px-8 outline-none font-bold text-onyx text-center md:text-left transition-all shadow-inner text-lg" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ruby ml-1">Contacto VIP</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nº de Telemóvel" className="w-full bg-offwhite border-2 border-transparent focus:border-ruby rounded-full py-5 px-8 outline-none font-bold text-onyx text-center md:text-left transition-all shadow-inner text-lg" />
            </div>
         </div>

         <div className="space-y-8">
            <div className="text-center space-y-2">
               <h3 className="text-3xl font-serif font-black dark:text-white italic tracking-tight">Onde você <span className="text-ruby">Atua.</span></h3>
               <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em]">Posicione o Radar para novos clientes</p>
            </div>
            <div className="relative h-[450px] w-full rounded-[45px] overflow-hidden border border-quartz/10 luxury-shadow group">
               <div ref={mapContainerRef} className="h-full w-full z-0" />
               <div className="absolute top-6 right-6 z-10 flex flex-col gap-4">
                  <button onClick={() => setMapMode(m => m === 'streets' ? 'satellite' : 'streets')} className="w-14 h-14 bg-white/95 dark:bg-darkCard/95 rounded-2xl shadow-2xl flex items-center justify-center text-ruby active:scale-90 transition-all border border-quartz/10"><Icons.Gallery /></button>
                  <button onClick={handleLocateMe} disabled={isLocating} className="w-14 h-14 bg-white/95 dark:bg-darkCard/95 rounded-2xl shadow-2xl flex items-center justify-center text-emerald active:scale-90 transition-all border border-quartz/10">
                    {isLocating ? <div className="w-6 h-6 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin"></div> : <Icons.Map />}
                  </button>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-5 pt-6 max-w-xl mx-auto">
            <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-7 bg-ruby text-white rounded-full font-black uppercase text-[12px] tracking-[0.5em] shadow-[0_25px_60px_rgba(157,23,77,0.4)] active:scale-95 transition-all border border-white/10 flex items-center justify-center gap-4">
              {isSaving ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sincronizar no Radar'}
            </button>
            <button onClick={onLogout} className="w-full py-4 text-quartz font-black uppercase text-[9px] tracking-[0.5em] hover:text-ruby transition-colors text-center active:scale-95">Terminar Sessão Segura</button>
         </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
         .custom-pin-pro { filter: drop-shadow(0 15px 30px rgba(157,23,77,0.4)); }
         .leaflet-container { background: #0F0F14 !important; border-radius: 45px; cursor: crosshair !important; }
      `}} />
    </div>
  );
};

export default UserProfile;
