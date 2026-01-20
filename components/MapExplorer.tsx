
import React, { useEffect, useRef, useState } from 'react';
import { ProviderProfile, UserRole } from '../types';
import { Icons } from '../constants';

interface MapExplorerProps {
  onSelectProvider: (p: ProviderProfile) => void;
  providers: ProviderProfile[];
}

const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectProvider, providers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  
  const [selectedInMap, setSelectedInMap] = useState<ProviderProfile | null>(null);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState('Luanda');

  // Função para buscar o nome da cidade/província via Reverse Geocoding
  const fetchCityName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Angola';
      setLocationName(city);
    } catch (err) {
      console.warn("Falha ao identificar cidade, mantendo padrão.");
    }
  };

  // Inicialização Robusta do Mapa com Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || !(window as any).L || mapInstanceRef.current) return;

    const L = (window as any).L;
    try {
      const map = L.map(mapContainerRef.current, {
        center: [-8.8383, 13.2344], 
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        tap: false 
      });

      mapInstanceRef.current = map;
      const url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current = L.tileLayer(url).addTo(map);
      markerLayerRef.current = L.featureGroup().addTo(map);

      // Tenta obter localização inicial
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          fetchCityName(pos.coords.latitude, pos.coords.longitude);
        });
      }

      setTimeout(() => { map.invalidateSize(); }, 500);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (e) {
      console.error("Leaflet Init Error:", e);
    }
  }, []);

  // Sincronização Dinâmica de Talentos no Mapa
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    const markerLayer = markerLayerRef.current;

    if (!map || !L || !markerLayer) return;

    markerLayer.clearLayers();

    providers.forEach(p => {
      const lat = p.location?.latitude;
      const lng = p.location?.longitude;
      if (!lat || !lng || (lat === 0 && lng === 0)) return;

      const customIcon = L.divIcon({
        className: 'glow-marker',
        html: `
          <div class="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95">
            <div class="w-16 h-16 bg-onyx border-2 border-ruby rounded-[22px] flex items-center justify-center shadow-[0_20px_40px_rgba(157,23,77,0.4)] overflow-hidden">
              <img src="${p.portfolio[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200'}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald rounded-full border-2 border-white flex items-center justify-center">
               <div class="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        `,
        iconSize: [64, 64],
        iconAnchor: [32, 64]
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .on('click', () => {
          setSelectedInMap(p);
          map.flyTo([lat, lng], 16, { duration: 1.5 });
        });
      
      markerLayer.addLayer(marker);
    });

    const bounds = markerLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    }
  }, [providers]);

  const toggleMapMode = () => {
    const newMode = mapMode === 'streets' ? 'satellite' : 'streets';
    setMapMode(newMode);
    if (mapInstanceRef.current && (window as any).L) {
      const L = (window as any).L;
      if (tileLayerRef.current) mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const url = newMode === 'streets' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      tileLayerRef.current = L.tileLayer(url).addTo(mapInstanceRef.current);
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const L = (window as any).L;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 17, { duration: 2 });
          const userIcon = L.divIcon({
            className: 'user-marker',
            html: `<div class="relative flex items-center justify-center"><div class="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping"></div><div class="w-6 h-6 bg-blue-600 border-2 border-white rounded-full"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
          L.marker([latitude, longitude], { icon: userIcon }).addTo(mapInstanceRef.current);
          fetchCityName(latitude, longitude);
        }
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div className="w-full h-[75vh] md:h-[85vh] relative overflow-hidden bg-onyx rounded-[50px] md:rounded-[70px] border border-white/10 shadow-2xl">
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
      
      {/* HEADER CENTRALIZADO SOBRE O MAPA COM NOME DINÂMICO */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-sm pointer-events-none">
         <div className="bg-onyx/80 backdrop-blur-3xl px-8 py-4 rounded-full border border-white/10 text-white flex items-center justify-center gap-4 shadow-2xl">
            <div className="w-2 h-2 bg-ruby rounded-full animate-ping"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white whitespace-nowrap">Radar {locationName}</p>
         </div>
      </div>

      {/* BOTÕES DE CONTROLE */}
      <div className="absolute top-20 right-6 z-10 flex flex-col gap-4">
         <button 
          onClick={toggleMapMode} 
          className="w-14 h-14 bg-white/95 dark:bg-darkCard/95 backdrop-blur-xl rounded-[20px] shadow-2xl border border-quartz/10 flex items-center justify-center text-ruby active:scale-90 transition-all"
         >
           <Icons.Gallery />
         </button>
         <button 
          onClick={handleLocateUser} 
          disabled={isLocating} 
          className="w-14 h-14 bg-white/95 dark:bg-darkCard/95 backdrop-blur-xl rounded-[20px] shadow-2xl border border-quartz/10 flex items-center justify-center text-emerald active:scale-90 transition-all"
         >
           {isLocating ? <div className="w-6 h-6 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin"></div> : <Icons.Map />}
         </button>
      </div>

      {/* CARD DE INFORMAÇÃO - CORREÇÃO DE CENTRALIZAÇÃO ABSOLUTA MOBILE */}
      {selectedInMap && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] md:w-[420px] md:left-auto md:right-10 md:translate-x-0 z-20 bg-white/98 dark:bg-darkCard/98 backdrop-blur-3xl p-8 rounded-[50px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-2 border-ruby/10 animate-fade-in flex flex-col items-center text-center">
           <button onClick={() => setSelectedInMap(null)} className="absolute top-6 right-6 w-10 h-10 bg-offwhite dark:bg-onyx text-quartz rounded-full flex items-center justify-center active:scale-90 transition-all">✕</button>

           <div className="flex flex-col items-center gap-4 mb-8 mt-2 w-full">
              <div className="w-24 h-24 rounded-[35px] overflow-hidden border-2 border-ruby/20 shadow-xl shrink-0">
                 <img src={selectedInMap.portfolio[0]} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden space-y-1">
                 <span className="text-[8px] font-black uppercase text-gold tracking-widest bg-gold/10 px-3 py-1 rounded-full">Membro Ouro</span>
                 <h4 className="text-onyx dark:text-white font-serif font-black italic text-2xl truncate leading-tight mt-2">{selectedInMap.businessName}</h4>
                 <p className="text-quartz text-[9px] font-bold uppercase truncate">{selectedInMap.location.address}</p>
              </div>
           </div>
           
           <div className="w-full flex justify-center">
              <button 
                onClick={() => onSelectProvider(selectedInMap)} 
                className="w-full max-w-[280px] py-5 bg-ruby text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
              >
                  Ver Ritual Completo <Icons.ChevronRight />
              </button>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .glow-marker { filter: drop-shadow(0 15px 30px rgba(157,23,77,0.3)); }
        .leaflet-container { background: #0F0F14 !important; outline: none !important; }
      `}} />
    </div>
  );
};
export default MapExplorer;
