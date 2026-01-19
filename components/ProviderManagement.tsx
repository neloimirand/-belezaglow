
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { UserRole, Service, Employee, User } from '../types';
import Finance from './Finance';
import RitualCurator from './RitualCurator';
import PortfolioManager from './PortfolioManager';
import EmployeeManager from './EmployeeManager';
import NewOrders from './NewOrders';
import PendingOrders from './PendingOrders';

type TabKey = 'Dashboard' | 'Novos' | 'Pendentes' | 'Agenda' | 'Rituais' | 'Maison' | 'Finanças' | 'Galeria' | 'Team';

interface ProviderManagementProps {
  user: User | null;
  role: UserRole;
  onLogout?: () => void;
  onActionNotify?: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  onOpenChatWithClient?: (name: string) => void;
  onNavigateToDiscover?: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  onAcceptBooking?: (request: any) => void;
}

const ProviderManagement: React.FC<ProviderManagementProps> = ({ 
  user,
  onLogout,
  onActionNotify, 
  role,
  onOpenChatWithClient,
  onNavigateToDiscover,
  theme,
  toggleTheme,
}) => {
  const isSalon = role === UserRole.SALON;
  const [activeTab, setActiveTab] = useState<TabKey>('Dashboard');
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  
  const [profile, setProfile] = useState({
    businessName: user?.name || (isSalon ? 'Glow Elite Maison' : 'Meu Espaço Pro'),
    photo: user?.photoUrl || 'https://images.unsplash.com/photo-1512690196152-74472f1289df?q=80&w=1000',
    address: 'Talatona, Luanda - Edifício Aura',
    phone: user?.phone || '+244 942 644 781',
    lat: -8.9200,
    lng: 13.1800,
    mapMode: 'streets' as 'streets' | 'satellite'
  });

  const [portfolio, setPortfolio] = useState<string[]>([
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000'
  ]);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState([
    { id: 'r1', client: 'Ana Manuel', service: 'Corte Sculpting VIP', date: 'HOJE', time: '14:30', price: 15000, status: 'new' },
    { id: 'r2', client: 'Mauro Vaz', service: 'Barboterapia Real', date: 'AMANHÃ', time: '10:00', price: 9000, status: 'pending' },
    { id: 'r3', client: 'Isabel Cruz', service: 'Manicure Luxe', date: '25/05', time: '11:00', price: 12000, status: 'confirmed' }
  ]);

  // Inicialização do Mapa na aba Maison
  useEffect(() => {
    if (activeTab === 'Maison' && mapContainerRef.current) {
      const timer = setTimeout(() => {
        const L = (window as any).L;
        if (!L) return;

        if (mapInstance.current) {
          mapInstance.current.remove();
        }

        mapInstance.current = L.map(mapContainerRef.current, {
          center: [profile.lat, profile.lng],
          zoom: 16,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false
        });

        const url = profile.mapMode === 'streets' 
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

        tileLayerRef.current = L.tileLayer(url).addTo(mapInstance.current);

        const customIcon = L.divIcon({
          className: 'custom-pin',
          html: `<div class="w-14 h-14 bg-ruby border-4 border-gold rounded-[20px] shadow-[0_15px_40px_rgba(157,23,77,0.5)] flex items-center justify-center animate-bounce"><div class="w-2.5 h-2.5 bg-white rounded-full"></div></div>`,
          iconSize: [56, 56],
          iconAnchor: [28, 56]
        });

        markerInstance.current = L.marker([profile.lat, profile.lng], { 
          icon: customIcon, 
          draggable: true 
        }).addTo(mapInstance.current);

        markerInstance.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          setProfile(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const toggleMaisonMapMode = () => {
    const newMode = profile.mapMode === 'streets' ? 'satellite' : 'streets';
    setProfile(prev => ({ ...prev, mapMode: newMode }));
    
    if (mapInstance.current && (window as any).L) {
      const L = (window as any).L;
      if (tileLayerRef.current) {
        mapInstance.current.removeLayer(tileLayerRef.current);
      }
      
      const url = newMode === 'streets' 
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      
      tileLayerRef.current = L.tileLayer(url).addTo(mapInstance.current);
    }
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, photo: reader.result as string }));
      onActionNotify?.('Perfil Atualizado', 'Sua nova aura visual foi sincronizada com o Radar.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAcceptRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
    onActionNotify?.('Ritual Aceito', 'O cliente será notificado da confirmação.', 'success');
  };

  const handlePendingRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'pending' } : r));
    onActionNotify?.('Movido para Pendentes', 'O pedido agora aguarda triagem na aba de Pendências.', 'info');
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    onActionNotify?.('Ritual Removido', 'O pedido foi descartado do radar.', 'info');
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const quickActions = [
    { id: 'Novos', label: 'Pedidos Novos', icon: <Icons.Bell />, color: 'from-ruby to-pink-600', count: requests.filter(r => r.status === 'new').length },
    { id: 'Pendentes', label: 'Em Pendência', icon: <Icons.Clock />, color: 'from-onyx to-stone-700', count: requests.filter(r => r.status === 'pending').length },
    { id: 'Agenda', label: 'Agenda Live', icon: <Icons.Calendar />, color: 'from-emerald to-teal-600' },
    { id: 'Rituais', label: 'Menu Rituais', icon: <Icons.Plus />, color: 'from-gold to-amber-600' },
    ...(isSalon ? [{ id: 'Team', label: 'Time da Maison', icon: <Icons.Briefcase />, color: 'from-emerald to-emerald-700' }] : []),
    { id: 'Galeria', label: 'Galeria Elite', icon: <Icons.Gallery />, color: 'from-purple-600 to-indigo-600' },
    { id: 'Finanças', label: 'Cofre Maison', icon: <Icons.Dollar />, color: 'from-blue-600 to-indigo-700' },
    { id: 'Maison', label: 'Sua Identidade', icon: <Icons.Home />, color: 'from-quartz to-stone-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-fade-in pb-40 px-4 md:px-0">
      
      <header className="flex justify-between items-center bg-white/50 dark:bg-darkCard/50 backdrop-blur-xl p-6 md:p-8 rounded-[35px] md:rounded-[40px] border border-quartz/10">
        <div className="space-y-1">
          <p className="text-ruby text-[8px] font-black uppercase tracking-[0.4em]">{isSalon ? 'Maison Glow Pro' : 'Artista Glow Pro'}</p>
          <h2 className="text-3xl md:text-4xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
            Olá, <span className="text-gold">{user?.name?.split(' ')[0] || profile.businessName.split(' ')[0]}</span>.
          </h2>
        </div>
        <div className="relative group" onClick={() => profileFileInputRef.current?.click()}>
           <div className="w-16 h-16 md:w-20 md:h-20 rounded-[25px] md:rounded-[30px] overflow-hidden border-2 border-gold shadow-2xl cursor-pointer transition-all active:scale-95 hover:border-ruby">
              <img src={profile.photo} className="w-full h-full object-cover" alt="Perfil" />
              <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[7px] font-black text-white uppercase tracking-widest">Trocar</span>
              </div>
           </div>
           <input 
            type="file" 
            ref={profileFileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleProfilePhotoUpload} 
           />
        </div>
      </header>

      <main className="space-y-12 md:space-y-16">
        {activeTab === 'Dashboard' && (
          <div className="space-y-12 md:space-y-16">
            <section>
               <div className="bg-onyx dark:bg-darkCard p-8 md:p-10 rounded-[45px] md:rounded-[55px] text-white luxury-shadow relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                  <div className="relative z-10 space-y-6 md:space-y-8">
                     <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 bg-ruby/20 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-ruby">
                           <div className="w-1.5 h-1.5 bg-ruby rounded-full animate-ping"></div> Ritual Iminente
                        </span>
                        <p className="text-quartz text-[9px] font-black">Em 12min</p>
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-3xl md:text-5xl font-serif font-black italic tracking-tighter">Ana Manuel</h3>
                        <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Corte Sculpting Premium</p>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => setActiveTab('Agenda')} className="flex-1 py-4 bg-white text-onyx rounded-2xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Abrir Agenda</button>
                        <button onClick={() => onOpenChatWithClient?.('Ana Manuel')} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 active:scale-90"><Icons.Message /></button>
                     </div>
                  </div>
               </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Hoje', value: '342k Kz', icon: <Icons.Dollar />, color: 'text-emerald' },
                 { label: 'Novos', value: requests.filter(r => r.status === 'new').length.toString(), icon: <Icons.Bell />, color: 'text-ruby' },
                 { label: 'Radar', value: '1.2k', icon: <Icons.Search />, color: 'text-gold' },
                 { label: 'Elite', value: '5.0', icon: <Icons.Star filled />, color: 'text-onyx dark:text-white' },
               ].map((s, i) => (
                 <div key={i} className="bg-white dark:bg-darkCard p-6 rounded-[30px] border border-quartz/5 luxury-shadow flex flex-col items-center text-center gap-2 group transition-all active:scale-95">
                    <div className={`${s.color} scale-100`}>{s.icon}</div>
                    <p className="text-[7px] font-black uppercase text-quartz tracking-widest">{s.label}</p>
                    <p className={`text-xl font-serif font-black dark:text-white ${s.color}`}>{s.value}</p>
                 </div>
               ))}
            </section>

            <section className="space-y-6 md:space-y-8">
               <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-serif font-black dark:text-white italic ml-2">Ações de <span className="text-ruby">Gestão.</span></h3>
                  <div className="hidden md:flex gap-2">
                     <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-xl bg-white dark:bg-darkCard border border-quartz/10 flex items-center justify-center text-quartz hover:text-ruby transition-all shadow-sm active:scale-90"><div className="rotate-180"><Icons.ChevronRight /></div></button>
                     <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-xl bg-white dark:bg-darkCard border border-quartz/10 flex items-center justify-center text-quartz hover:text-ruby transition-all shadow-sm active:scale-90"><Icons.ChevronRight /></button>
                  </div>
               </div>

               <div ref={carouselRef} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 py-4 -mx-1">
                  {quickActions.map(action => (
                    <button 
                      key={action.id}
                      onClick={() => setActiveTab(action.id as TabKey)}
                      className="min-w-[160px] md:min-w-[240px] snap-center bg-white dark:bg-darkCard p-8 md:p-10 rounded-[40px] md:rounded-[50px] luxury-shadow border border-quartz/5 flex flex-col items-center gap-4 transition-all active:scale-95 group relative"
                    >
                      {action.count && action.count > 0 ? (
                        <div className="absolute top-4 right-4 bg-ruby text-white w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black animate-bounce shadow-lg border border-white/20">{action.count}</div>
                      ) : null}
                      <div className={`w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br ${action.color} rounded-[22px] md:rounded-[28px] flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-all`}>
                        {React.cloneElement(action.icon as React.ReactElement<any>, { width: 24, height: 24 })}
                      </div>
                      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-onyx dark:text-white whitespace-nowrap">{action.label}</span>
                    </button>
                  ))}
               </div>
            </section>
          </div>
        )}
        {/* ... outras abas ... */}
      </main>

      <footer className="pt-20 flex flex-col items-center gap-6">
         <div className="h-px w-20 bg-quartz/20"></div>
         <button onClick={onLogout} className="px-12 py-4 text-red-500/50 font-black uppercase text-[10px] tracking-[0.5em] hover:text-red-500 transition-all">Terminar Sessão</button>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-pin { filter: drop-shadow(0 15px 15px rgba(0,0,0,0.3)); }
      `}} />
    </div>
  );
};

export default ProviderManagement;
