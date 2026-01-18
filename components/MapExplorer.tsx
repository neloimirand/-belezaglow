
import React, { useEffect, useRef, useState } from 'react';
import { ProviderProfile } from '../types';
import { Icons } from '../constants';
import { MOCK_PROVIDERS } from '../data/mockProviders';

interface MapExplorerProps {
  onSelectProvider: (p: ProviderProfile) => void;
  initialRouteProvider?: ProviderProfile | null;
}

const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectProvider, initialRouteProvider }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const accuracyCircleRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const [activeRoute, setActiveRoute] = useState<{ provider: ProviderProfile; distance: string; time: string } | null>(null);
  const [viewMode, setViewMode] = useState<'streets' | 'satellite'>('streets');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedInMap, setSelectedInMap] = useState<ProviderProfile | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voo cinematográfico para a posição do usuário em qualquer lugar do mundo
  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      setIsFollowing(true);
      mapInstanceRef.current.flyTo(userLocation, 16, {
        animate: true,
        duration: 2.5,
        easeLinearity: 0.25
      });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(newPos);
            mapInstanceRef.current?.flyTo(newPos, 16, { animate: true, duration: 2 });
            setIsFollowing(true);
          },
          () => console.error("GPS negado")
        );
      }
    }
  };

  const drawRoute = (targetProvider: ProviderProfile, startLoc?: [number, number]) => {
    const L = (window as any).L;
    if (!mapInstanceRef.current) return;
    
    const start = startLoc || userLocation || [-8.8383, 13.2344]; 

    if (routeLayerRef.current) mapInstanceRef.current.removeLayer(routeLayerRef.current);

    const points = [
      start,
      [targetProvider.location.latitude, targetProvider.location.longitude]
    ];

    routeLayerRef.current = L.polyline(points, {
      color: '#9D174D',
      weight: 6,
      opacity: 0.9,
      dashArray: '1, 15',
      lineCap: 'round',
      className: 'animate-route-glow'
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [100, 100] });
    
    setActiveRoute({
      provider: targetProvider,
      distance: "Calculando tempo real...",
      time: "Aprox. 7-12 min"
    });
    
    speak(`Radar ativado para ${targetProvider.businessName}.`);
  };

  const startTracking = () => {
    if (navigator.geolocation) {
      setIsLive(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const newPos: [number, number] = [latitude, longitude];
          setUserLocation(newPos);
          
          const L = (window as any).L;
          if (!mapInstanceRef.current) return;

          if (!userMarkerRef.current) {
            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: `
                <div class="relative w-14 h-14">
                  <div class="absolute inset-0 bg-blue-500/20 rounded-full animate-radar-pulse"></div>
                  <div class="absolute inset-4 bg-white border-[3px] border-blue-600 rounded-full shadow-2xl z-10">
                    <div class="w-full h-full bg-blue-600 rounded-full scale-50"></div>
                  </div>
                </div>
              `,
              iconSize: [56, 56],
              iconAnchor: [28, 28]
            });
            userMarkerRef.current = L.marker(newPos, { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
            
            accuracyCircleRef.current = L.circle(newPos, {
                radius: accuracy,
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 1
            }).addTo(mapInstanceRef.current);
          } else {
            userMarkerRef.current.setLatLng(newPos);
            accuracyCircleRef.current.setLatLng(newPos).setRadius(accuracy);
          }

          if (isFollowing) {
            mapInstanceRef.current.panTo(newPos);
          }

          if (initialRouteProvider && !routeLayerRef.current) {
            drawRoute(initialRouteProvider, newPos);
          }
        },
        (err) => {
          console.error("GPS Global Error:", err);
          setIsLive(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    }
  };

  const toggleLayer = () => {
    const newMode = viewMode === 'streets' ? 'satellite' : 'streets';
    setViewMode(newMode);
    const L = (window as any).L;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer._url) mapInstanceRef.current.removeLayer(layer);
      });
      const url = newMode === 'streets' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      L.tileLayer(url, { worldCopyJump: true }).addTo(mapInstanceRef.current);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const L = (window as any).L;
    // CONFIGURAÇÃO GLOBAL SEM LIMITES
    const map = L.map(mapContainerRef.current, {
      center: [0, 0],
      zoom: 3,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true, // Pula o mapa quando cruza o meridiano 180
      minZoom: 2,
      maxBounds: null // Remove limites
    });

    mapInstanceRef.current = map;
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        noWrap: false
    }).addTo(map);

    map.on('dragstart', () => setIsFollowing(false));

    MOCK_PROVIDERS.forEach(provider => {
      const customIcon = L.divIcon({
        className: 'glow-marker',
        html: `
          <div class="relative group">
            <div class="absolute -inset-4 bg-ruby/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all"></div>
            <div class="w-12 h-12 bg-onyx border-2 border-ruby rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden">
              <img src="${provider.portfolio[0]}" class="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      L.marker([provider.location.latitude, provider.location.longitude], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedInMap(provider);
          map.flyTo([provider.location.latitude, provider.location.longitude], 16, { duration: 1.5 });
        });
    });

    startTracking();

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      map.remove();
    };
  }, []);

  return (
    <div className="h-full w-full relative overflow-hidden bg-onyx">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      {/* HUD SUPERIOR - STATUS GLOBAL */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="bg-onyx/80 backdrop-blur-3xl border border-white/10 p-5 rounded-[30px] shadow-2xl flex items-center gap-5 pointer-events-auto animate-fade-in">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isLive ? 'bg-emerald text-white' : 'bg-ruby text-white'}`}>
              <Icons.Map />
           </div>
           <div>
              <h3 className="text-white font-serif font-black italic text-lg tracking-tighter">Radar <span className="text-ruby">Global.</span></h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald animate-pulse' : 'bg-red-500'}`}></div>
                <p className="text-quartz text-[7px] font-black uppercase tracking-[0.3em]">{isLive ? 'Sincronização Mundial Ativa' : 'Procurando GPS...'}</p>
              </div>
           </div>
        </div>
      </div>

      {/* CONTROLES FLUTUANTES - LATERAL DIREITA */}
      <div className="absolute top-8 right-8 z-20 flex flex-col gap-4 pointer-events-auto">
         <button onClick={toggleLayer} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl border ${viewMode === 'satellite' ? 'bg-ruby text-white shadow-ruby/20' : 'bg-onyx/80 text-white border-white/10 backdrop-blur-xl'}`}>
           <Icons.Map />
         </button>
         <button onClick={() => mapInstanceRef.current?.zoomIn()} className="w-14 h-14 bg-white/10 backdrop-blur-xl text-white rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all">
           <Icons.Plus />
         </button>
      </div>

      {/* BOTÃO MESTRE: MINHA LOCALIZAÇÃO ATUAL (VÔO GLOBAL) */}
      <div className="absolute bottom-12 right-8 z-20 flex flex-col items-end gap-4 pointer-events-auto">
         <button 
          onClick={centerOnUser}
          className={`group relative w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-2 active:scale-95 ${
            isFollowing ? 'bg-gold border-gold text-onyx' : 'bg-white border-white text-onyx'
          }`}
          title="Onde estou agora?"
         >
            {isFollowing && (
              <div className="absolute inset-0 rounded-full border-4 border-gold animate-ping opacity-30"></div>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3" fill={isFollowing ? 'currentColor' : 'none'}/>
              <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
            </svg>
            
            <div className="absolute right-20 bg-onyx text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 backdrop-blur-md">
              Localizar-me em tempo real
            </div>
         </button>
      </div>

      {/* Card de Provedor Selecionado */}
      {selectedInMap && !activeRoute && (
        <div className="absolute bottom-10 left-6 right-6 md:left-auto md:right-10 md:w-[400px] z-20 bg-onyx/90 backdrop-blur-3xl p-8 rounded-[45px] shadow-2xl border border-ruby/30 animate-fade-in-up">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-5">
                 <img src={selectedInMap.portfolio[0]} className="w-16 h-16 rounded-2xl object-cover border border-ruby/30" />
                 <div>
                    <h4 className="text-xl font-serif font-black text-white italic leading-none">{selectedInMap.businessName}</h4>
                    <p className="text-quartz text-[8px] font-bold uppercase mt-1 tracking-widest">{selectedInMap.location.address.split(',')[0]}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedInMap(null)} className="text-quartz hover:text-white">✕</button>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={() => drawRoute(selectedInMap)} className="py-4 bg-white text-onyx rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all">Ver Rota Live</button>
              <button onClick={() => onSelectProvider(selectedInMap)} className="py-4 bg-ruby text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all">Detalhes do Atelier</button>
           </div>
        </div>
      )}

      {/* Painel de Navegação Ativa */}
      {activeRoute && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] md:w-[600px] z-30 bg-ruby p-8 rounded-[45px] shadow-[0_40px_100px_rgba(157,23,77,0.4)] text-white flex items-center gap-8 animate-fade-in-up border border-white/10">
           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl shrink-0">
              <div className="rotate-180 scale-[1.3] animate-bounce"><Icons.ChevronRight /></div>
           </div>
           <div className="flex-1">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60 mb-0.5">Navegação Live Ativa</p>
              <h4 className="text-lg font-serif font-black italic">{activeRoute.provider.businessName}</h4>
              <p className="text-[10px] opacity-80 truncate">{activeRoute.provider.location.address}</p>
           </div>
           <button onClick={() => setActiveRoute(null)} className="p-3 hover:bg-white/10 rounded-full transition-all">✕</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-route-glow { stroke-dashoffset: 50; animation: routeFlow 1.5s linear infinite; }
        @keyframes routeFlow { to { stroke-dashoffset: 0; } }
        @keyframes radar-pulse { 
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-radar-pulse { animation: radar-pulse 2s infinite ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translate(-50%, 30px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default MapExplorer;
