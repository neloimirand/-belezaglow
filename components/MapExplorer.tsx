
import React, { useEffect, useRef, useState } from 'react';
import { ProviderProfile } from '../types';
import { Icons } from '../constants';

interface MapExplorerProps {
  onSelectProvider: (p: ProviderProfile) => void;
  providers: ProviderProfile[];
}

const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectProvider, providers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedInMap, setSelectedInMap] = useState<ProviderProfile | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !(window as any).L) return;

    const L = (window as any).L;
    const map = L.map(mapContainerRef.current, {
      center: [-8.8383, 13.2344], // Luanda default
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // Renderizar provedores reais vindos do Supabase
    providers.forEach(p => {
      const customIcon = L.divIcon({
        className: 'glow-marker',
        html: `
          <div class="relative group">
            <div class="w-12 h-12 bg-onyx border-2 border-ruby rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden transition-transform group-hover:scale-110">
              <img src="${p.portfolio[0]}" class="w-full h-full object-cover opacity-80" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald rounded-full border-2 border-white"></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      L.marker([p.location.latitude, p.location.longitude], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedInMap(p);
          map.flyTo([p.location.latitude, p.location.longitude], 15);
        });
    });

    return () => { map.remove(); };
  }, [providers]);

  return (
    <div className="h-full w-full relative overflow-hidden bg-onyx">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      <div className="absolute top-6 left-6 z-10 bg-onyx/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-white flex items-center gap-4">
         <div className="w-10 h-10 bg-ruby rounded-xl flex items-center justify-center"><Icons.Map /></div>
         <div>
            <p className="text-[7px] font-black uppercase tracking-widest text-quartz">Sincronização Live</p>
            <p className="font-serif italic font-black text-sm">Radar Angola.</p>
         </div>
      </div>

      {selectedInMap && (
        <div className="absolute bottom-10 left-6 right-6 md:left-auto md:right-10 md:w-[350px] z-20 bg-onyx/95 backdrop-blur-3xl p-6 rounded-[40px] shadow-2xl border border-ruby/30 animate-fade-in">
           <div className="flex items-center gap-5 mb-6">
              <img src={selectedInMap.portfolio[0]} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                 <h4 className="text-white font-serif font-black italic">{selectedInMap.businessName}</h4>
                 <p className="text-quartz text-[8px] font-bold uppercase">{selectedInMap.location.address}</p>
              </div>
           </div>
           <button 
             onClick={() => onSelectProvider(selectedInMap)}
             className="w-full py-4 bg-ruby text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
           >
             Ver Portfólio de Elite
           </button>
        </div>
      )}
    </div>
  );
};

export default MapExplorer;
