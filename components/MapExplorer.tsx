
import React, { useEffect, useRef, useState } from 'react';
import { ProviderProfile } from '../types';
import { Icons } from '../constants';

const MOCK_MAP_PROVIDERS: ProviderProfile[] = [
  {
    id: '1',
    userId: 'u1',
    businessName: 'L’Atelier Beauty Luanda',
    location: { address: 'Avenida Lenine, Edifício Crystal', latitude: -8.8399, longitude: 13.2355 },
    rating: 4.9,
    reviewCount: 342,
    bio: 'Alta costura em estética. Especialistas em transformações capilares.',
    openingHours: '09:00 - 20:00',
    portfolio: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop'],
    services: []
  },
  {
    id: '2',
    userId: 'u2',
    businessName: 'The Gent’s Club Talatona',
    location: { address: 'Via AL-12, Talatona Center', latitude: -8.9200, longitude: 13.1800 },
    rating: 5.0,
    reviewCount: 189,
    bio: 'Experiência sensorial masculina e barboterapia clássica.',
    openingHours: '08:00 - 21:00',
    portfolio: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop'],
    services: []
  },
  {
    id: '3',
    userId: 'u3',
    businessName: 'Maison de l’Ongle',
    location: { address: 'Maianga, Rua da Missão', latitude: -8.8350, longitude: 13.2310 },
    rating: 4.8,
    reviewCount: 521,
    bio: 'A arte do design de unhas em Luanda.',
    openingHours: '10:00 - 19:00',
    portfolio: ['https://images.unsplash.com/photo-1604654894610-df490668711d?q=80&w=400&auto=format&fit=crop'],
    services: []
  }
];

interface MapExplorerProps {
  onSelectProvider: (p: ProviderProfile) => void;
}

const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectProvider }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [activeRoute, setActiveRoute] = useState<{ provider: ProviderProfile; distance: string; time: string } | null>(null);
  const [viewMode, setViewMode] = useState<'streets' | 'satellite'>('streets');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          mapInstanceRef.current.setView([latitude, longitude], 15, { animate: true });
          
          if (userMarkerRef.current) mapInstanceRef.current.removeLayer(userMarkerRef.current);

          userMarkerRef.current = (window as any).L.circleMarker([latitude, longitude], {
            radius: 12,
            fillColor: "#9D174D",
            color: "#fff",
            weight: 4,
            fillOpacity: 0.9
          }).addTo(mapInstanceRef.current).bindPopup("<p class='font-black uppercase text-[10px] tracking-widest p-2 text-center text-ruby'>Você está aqui</p>").openPopup();
        },
        () => alert("Habilite a geolocalização para usar o radar.")
      );
    }
  };

  const drawRoute = (targetProvider: ProviderProfile) => {
    if (!userLocation || !mapInstanceRef.current) {
      alert("Localize-se primeiro clicando em 'Encontrar Agora'.");
      return;
    }

    if (routeLayerRef.current) mapInstanceRef.current.removeLayer(routeLayerRef.current);

    const points = [
      userLocation,
      [targetProvider.location.latitude, targetProvider.location.longitude]
    ];

    routeLayerRef.current = (window as any).L.polyline(points, {
      color: '#9D174D',
      weight: 6,
      opacity: 0.8,
      dashArray: '10, 10',
      lineCap: 'round',
      className: 'animate-route-flow'
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
    
    setActiveRoute({
      provider: targetProvider,
      distance: "2.4 km",
      time: "8 min"
    });
    
    speak(`Rota traçada para ${targetProvider.businessName}. Distância de 2 quilômetros e 400 metros. Estimativa de 8 minutos.`);
  };

  const startNavigation = () => {
    setIsNavigating(true);
    speak("Iniciando navegação. Siga em frente na direção da Avenida principal.");
    
    // Simulação de chegada após 5 segundos para fins de demonstração
    setTimeout(() => {
      speak("Você chegou ao seu destino: " + activeRoute?.provider.businessName + ". Seja bem-vinda e aproveite seu momento Glow!");
      alert("📍 VOCÊ CHEGOU!\nO salão foi notificado da sua presença.");
      setIsNavigating(false);
      setActiveRoute(null);
      if (routeLayerRef.current) mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }, 8000);
  };

  const toggleLayer = () => {
    const newMode = viewMode === 'streets' ? 'satellite' : 'streets';
    setViewMode(newMode);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer._url) mapInstanceRef.current.removeLayer(layer);
      });
      const url = newMode === 'streets' 
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      (window as any).L.tileLayer(url).addTo(mapInstanceRef.current);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = (window as any).L.map(mapContainerRef.current, {
      center: [-8.8383, 13.2344],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    (window as any).L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

    MOCK_MAP_PROVIDERS.forEach(provider => {
      const customIcon = (window as any).L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #9D174D; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 10px 20px rgba(157,23,77,0.3);">
                <div style="transform: rotate(45deg); width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = (window as any).L.marker([provider.location.latitude, provider.location.longitude], { icon: customIcon })
        .addTo(map);

      const popupContent = `
        <div class="flex flex-col w-64 overflow-hidden">
          <img src="${provider.portfolio[0]}" class="w-full h-32 object-cover">
          <div class="p-4 space-y-2">
            <h4 class="font-serif font-bold text-lg text-onyx">${provider.businessName}</h4>
            <p class="text-[10px] text-quartz leading-relaxed">${provider.bio}</p>
            <div class="flex flex-col gap-2 pt-2">
              <button id="btn-route-${provider.id}" class="w-full bg-ruby text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Traçar Rota</button>
              <button id="btn-details-${provider.id}" class="w-full border border-ruby text-ruby py-3 rounded-xl text-[9px] font-black uppercase tracking-widest">Ver Perfil</button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        document.getElementById(`btn-route-${provider.id}`)?.addEventListener('click', () => {
          drawRoute(provider);
          map.closePopup();
        });
        document.getElementById(`btn-details-${provider.id}`)?.addEventListener('click', () => {
          onSelectProvider(provider);
        });
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="h-full w-full relative overflow-hidden rounded-[40px] md:rounded-[50px] luxury-shadow border border-quartz/10">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      {/* HUD DE NAVEGAÇÃO (Aparece ao traçar rota) */}
      {activeRoute && !isNavigating && (
        <div className="absolute top-8 left-8 right-8 md:left-auto md:right-8 md:w-96 z-20 bg-white/90 dark:bg-onyx/90 backdrop-blur-2xl p-8 rounded-[35px] shadow-2xl border border-ruby/20 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
             <div className="space-y-1">
               <p className="text-ruby text-[9px] font-black uppercase tracking-widest">Destino de Elite</p>
               <h4 className="font-serif font-black text-2xl text-onyx dark:text-white leading-tight">{activeRoute.provider.businessName}</h4>
             </div>
             <button onClick={() => setActiveRoute(null)} className="text-quartz hover:text-ruby transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
             </button>
          </div>
          <div className="flex items-center gap-8 mb-8">
            <div className="flex flex-col">
              <span className="text-quartz text-[8px] font-black uppercase tracking-widest">Distância</span>
              <span className="text-xl font-bold text-onyx dark:text-white">{activeRoute.distance}</span>
            </div>
            <div className="w-px h-8 bg-quartz/20"></div>
            <div className="flex flex-col">
              <span className="text-quartz text-[8px] font-black uppercase tracking-widest">Tempo</span>
              <span className="text-xl font-bold text-ruby">{activeRoute.time}</span>
            </div>
          </div>
          <button 
            onClick={startNavigation}
            className="w-full py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            Iniciar Navegação
          </button>
        </div>
      )}

      {/* HUD EM NAVEGAÇÃO ATIVA */}
      {isNavigating && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] z-30 bg-ruby p-8 rounded-[35px] shadow-[0_30px_60px_rgba(157,23,77,0.4)] text-white flex items-center gap-6 animate-fade-in">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Próxima Instrução</p>
            <p className="text-lg font-bold leading-tight">Siga em frente por 400m em direção ao {activeRoute?.provider.businessName}</p>
          </div>
          <button onClick={() => setIsNavigating(false)} className="p-3 bg-white/10 rounded-full hover:bg-white/20">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {/* CONTROLES LATERAIS */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-3">
         <button 
           onClick={toggleLayer}
           className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-2xl border transition-all ${viewMode === 'satellite' ? 'bg-ruby border-white text-white' : 'bg-white border-quartz/10 text-onyx'}`}
         >
           <span className="text-[7px] font-black uppercase tracking-tighter">{viewMode === 'streets' ? 'Satélite' : 'Mapa'}</span>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m2 12 10 5 10-5M2 17l10 5 10-5M12 2 2 7l10 5 10-5-10-5z"/></svg>
         </button>
         <div className="flex flex-col bg-white dark:bg-onyx rounded-2xl shadow-2xl border border-quartz/10">
            <button onClick={() => mapInstanceRef.current?.zoomIn()} className="w-14 h-14 flex items-center justify-center text-ruby border-b border-quartz/10 hover:bg-quartz/5 font-bold text-xl">+</button>
            <button onClick={() => mapInstanceRef.current?.zoomOut()} className="w-14 h-14 flex items-center justify-center text-ruby hover:bg-quartz/5 font-bold text-xl">-</button>
         </div>
      </div>

      {/* BOTÃO CENTRALIZAR */}
      {!isNavigating && (
        <button 
          onClick={handleLocateMe}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white/95 dark:bg-onyx/95 text-ruby px-10 py-5 rounded-full border border-ruby/30 shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-3 h-3 bg-ruby rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Encontrar agora</span>
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-route-flow {
          stroke-dashoffset: 200;
          animation: routeFlow 5s linear infinite;
        }
        @keyframes routeFlow {
          to { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
};

export default MapExplorer;
