
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Icons } from '../constants';
import {
  UserRole,
  AppointmentStatus,
  Service,
  ProviderProfile,
  Employee,
  PlanTier
} from '../types';

type TabKey = 'Dashboard' | 'Pedidos' | 'Maison' | 'Serviços' | 'Equipe' | 'Assinatura';

interface PlanOption {
  id: PlanTier;
  name: string;
  price: number;
  benefits: string[];
  color: string;
  isPopular?: boolean;
}

interface ProviderManagementProps {
  role: UserRole;
  onLogout?: () => void;
  onActionNotify?: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  onSelectProviderForBooking?: (p: ProviderProfile) => void;
  onViewOnMap?: () => void;
}

const ProviderManagement: React.FC<ProviderManagementProps> = ({ 
  onActionNotify, 
  role,
  onLogout,
  onSelectProviderForBooking,
  onViewOnMap
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('Dashboard');
  
  // --- ESTADOS DE DADOS ---
  const [profile, setProfile] = useState({
    businessName: 'Glow Elite Maison',
    photo: 'https://images.unsplash.com/photo-1512690196152-74472f1289df?q=80&w=1000',
    address: 'Talatona, Luanda - Via AL-12, Edifício Aura',
    lat: -8.9200,
    lng: 13.1800,
    planTier: 'FREE' as PlanTier
  });

  const [team, setTeam] = useState<Employee[]>([
    { id: 'e1', name: 'Carla Silva', role: 'Master Hairstylist', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200', commission: 30, phone: '923000111', isPro: true }
  ]);
  const [services, setServices] = useState<Service[]>([
    { id: 's1', providerId: 'p1', name: 'Corte Sculpting VIP', price: 15000, durationMinutes: 60, categoryId: 'm-cabelo', photoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400' }
  ]);

  const [requests, setRequests] = useState([
    { id: 'r1', client: 'Ana Manuel', service: 'Corte Sculpting VIP', date: 'HOJE', time: '14:30', price: 15000, status: 'PENDING' },
    { id: 'r2', client: 'Mauro Vaz', service: 'Barboterapia Real', date: 'AMANHÃ', time: '10:00', price: 9000, status: 'PENDING' }
  ]);

  // --- ESTADOS DE ASSINATURA ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [depositantName, setDepositantName] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const plans: PlanOption[] = [
    { id: 'SILVER', name: 'Silver Glow', price: 15000, color: 'bg-stone-400', benefits: ['Destaque Regional', 'Até 10 Serviços', 'Suporte Prioritário'] },
    { id: 'GOLD', name: 'Gold Elite', price: 45000, color: 'bg-gold', benefits: ['Prioridade no Radar', 'IA de Marketing', 'Selo Verificado Ouro', 'Equipe Ilimitada'], isPopular: true },
    { id: 'DIAMOND', name: 'Diamond Pro', price: 150000, color: 'bg-ruby', benefits: ['Taxa Zero de Agendamento', 'Consultoria VIP', 'Marketing Omnicanal', 'Dashboard Analytics'] }
  ];

  // --- ESTADOS DE MODAIS ---
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '', role: '', photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', location: { address: '', latitude: -8.9200, longitude: 13.1800 }
  });

  const [newService, setNewService] = useState<Partial<Service>>({
    name: '', price: 0, durationMinutes: 45, specification: '', photoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400'
  });

  // --- REFERÊNCIAS ---
  const maisonMapRef = useRef<HTMLDivElement>(null);
  const employeeMapRef = useRef<HTMLDivElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const servicePhotoInputRef = useRef<HTMLInputElement>(null);
  const employeePhotoInputRef = useRef<HTMLInputElement>(null);
  const maisonMapInstance = useRef<any>(null);
  const employeeMapInstance = useRef<any>(null);

  // --- ENGINE DE MAPAS ---
  const initMap = (container: HTMLDivElement, lat: number, lng: number, onDrag: (lat: number, lng: number) => void, instanceRef: React.MutableRefObject<any>) => {
    const L = (window as any).L;
    if (!L || !container) return;
    if (instanceRef.current) instanceRef.current.remove();

    instanceRef.current = L.map(container, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(instanceRef.current);

    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #9D174D; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 25px rgba(157,23,77,0.4);"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    }).addTo(instanceRef.current);

    marker.on('dragend', (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      onDrag(lat, lng);
    });
  };

  useEffect(() => {
    if (activeTab === 'Maison' && maisonMapRef.current) {
      setTimeout(() => initMap(maisonMapRef.current!, profile.lat, profile.lng, (lat, lng) => setProfile(prev => ({ ...prev, lat, lng })), maisonMapInstance), 100);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isAddingEmployee && employeeMapRef.current) {
      setTimeout(() => initMap(employeeMapRef.current!, profile.lat, profile.lng, (lat, lng) => setNewEmployee(prev => ({ ...prev, location: { ...prev.location!, latitude: lat, longitude: lng } })), employeeMapInstance), 100);
    }
  }, [isAddingEmployee]);

  // --- HANDLERS DE FOTOS ---
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfile(prev => ({ ...prev, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleServicePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewService(prev => ({ ...prev, photoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleEmployeePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewEmployee(prev => ({ ...prev, photoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // --- HANDLERS GERAIS ---
  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      onActionNotify?.("Maison Atualizada", "Os dados da sua identidade foram salvos.", "success");
    }, 1200);
  };

  const handleOpenPayment = (plan: PlanOption) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!depositantName || !proofFile) return alert("Preencha todos os campos do comprovativo.");
    setIsSubmittingPayment(true);
    setTimeout(() => {
      setIsSubmittingPayment(false);
      setIsPaymentModalOpen(false);
      onActionNotify?.("Auditoria Iniciada", "Seu comprovativo foi enviado para análise administrativa.", "info");
      setDepositantName('');
      setProofFile(null);
    }, 2000);
  };

  const handleRequestAction = (id: string, action: 'ACCEPT' | 'REJECT') => {
    setRequests(prev => prev.filter(r => r.id !== id));
    onActionNotify?.(action === 'ACCEPT' ? 'Pedido Aceito' : 'Recusado', action === 'ACCEPT' ? 'Agenda confirmada!' : 'Pedido removido.', action === 'ACCEPT' ? 'success' : 'info');
  };

  const handleSaveService = () => {
    if (!newService.name || !newService.price) return alert("Preencha o nome e o preço.");
    setServices([...services, { ...newService as Service, id: 's' + Date.now(), providerId: 'p1', categoryId: 'geral' }]);
    setIsAddingService(false);
    onActionNotify?.("Catálogo Atualizado", "Novo ritual publicado com sucesso.", "success");
    setNewService({ name: '', price: 0, durationMinutes: 45, specification: '', photoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400' });
  };

  const handleSaveEmployee = () => {
    if (!newEmployee.name || !newEmployee.role) return alert("Preencha o nome e a especialidade.");
    setTeam([...team, { ...newEmployee as Employee, id: 'e' + Date.now(), commission: 30, phone: '900000', isPro: true }]);
    setIsAddingEmployee(false);
    onActionNotify?.("Artista Ativado", `${newEmployee.name} agora está no seu radar.`, "success");
    setNewEmployee({ name: '', role: '', photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', location: { address: '', latitude: -8.9200, longitude: 13.1800 } });
  };

  const handleEmployeeAgenda = (emp: Employee) => {
    onActionNotify?.("Agenda Individual", `Acedendo à agenda técnica de ${emp.name}...`, "info");
  };

  const handleEmployeeEdit = (emp: Employee) => {
    onActionNotify?.("Perfil de Talento", `Carregando dados de ${emp.name} para edição.`, "info");
  };

  return (
    <div className="space-y-12 animate-fade-in pb-40">
      {/* HEADER DINÂMICO */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 px-4 md:px-0">
        <div className="space-y-4">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Dashboard Profissional</p>
          <h2 className="text-5xl md:text-8xl font-serif font-black text-onyx dark:text-white leading-none tracking-tighter">
            {profile.businessName.split(' ')[0]} <span className="italic font-normal text-gold underline decoration-gold/10">Maison.</span>
          </h2>
        </div>
        <div className="flex items-center gap-6 bg-white dark:bg-darkCard p-6 rounded-[35px] luxury-shadow border border-quartz/5">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Nível Atual</p>
              <p className={`text-xl font-black ${profile.planTier === 'FREE' ? 'text-stone-400' : 'text-gold'}`}>{profile.planTier}</p>
           </div>
           <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-ruby shadow-xl">
              <img src={profile.photo} className="w-full h-full object-cover" />
           </div>
        </div>
      </header>

      {/* NAVEGAÇÃO REFORÇADA */}
      <nav className="flex gap-3 overflow-x-auto scrollbar-hide bg-white dark:bg-darkCard p-3 rounded-[40px] luxury-shadow border border-quartz/5 sticky top-4 z-[1000]">
        {[
          { id: 'Dashboard', icon: <Icons.Chart /> },
          { id: 'Pedidos', icon: <Icons.Message /> },
          { id: 'Maison', icon: <Icons.User /> },
          { id: 'Serviços', icon: <Icons.Briefcase /> },
          { id: 'Equipe', icon: <Icons.Star filled={activeTab === 'Equipe'} /> },
          { id: 'Assinatura', icon: <Icons.Award /> },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-10 py-5 rounded-[30px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-4 whitespace-nowrap active:scale-95 ${activeTab === tab.id ? 'bg-ruby text-white shadow-xl scale-105' : 'text-quartz hover:bg-ruby/5'}`}
          >
            {tab.icon} {tab.id}
          </button>
        ))}
      </nav>

      <main className="px-4 md:px-0 min-h-[500px]">
        {/* DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatBox label="Faturamento Previsto" value="142.500 Kz" trend="Este Mês" />
                <StatBox label="Serviços Ativos" value={services.length.toString()} trend="Catálogo" />
                <StatBox label="Pedidos Pendentes" value={requests.length.toString()} trend="Ação Requerida" />
             </div>
          </div>
        )}

        {/* PEDIDOS */}
        {activeTab === 'Pedidos' && (
          <div className="bg-white dark:bg-darkCard rounded-[50px] luxury-shadow border border-quartz/10 animate-fade-in overflow-hidden">
             <header className="p-10 border-b border-quartz/5 bg-offwhite/50 dark:bg-onyx/50">
                <h3 className="text-3xl font-serif font-black dark:text-white italic">Fila de <span className="text-ruby">Espera.</span></h3>
                <p className="text-xs font-medium text-quartz tracking-widest uppercase mt-2">Gerencie as solicitações de rituais</p>
             </header>
             <div className="divide-y divide-quartz/5">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-ruby/5 transition-colors group">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-ruby/10 text-ruby rounded-3xl flex items-center justify-center font-black text-2xl shadow-inner group-hover:bg-ruby group-hover:text-white transition-all">{req.client.charAt(0)}</div>
                          <div>
                             <h4 className="text-2xl font-serif font-black dark:text-white italic">{req.client}</h4>
                             <p className="text-sm font-bold text-stone-500 italic mb-1">{req.service}</p>
                             <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-onyx text-white dark:bg-white dark:text-onyx rounded-full text-[8px] font-black uppercase tracking-widest">{req.date} • {req.time}</span>
                                <span className="text-ruby font-black text-xs">{req.price.toLocaleString()} Kz</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-4 w-full md:w-auto">
                          <button onClick={() => handleRequestAction(req.id, 'REJECT')} className="flex-1 md:flex-none px-10 py-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Recusar</button>
                          <button onClick={() => handleRequestAction(req.id, 'ACCEPT')} className="flex-1 md:flex-none px-14 py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Aceitar Ritual</button>
                       </div>
                    </div>
                )) : (
                  <div className="py-32 text-center opacity-30">
                    <p className="font-serif italic text-2xl">Sem pedidos pendentes no momento.</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* EQUIPE (Talentos) - CORREÇÃO DE BOTÕES */}
        {activeTab === 'Equipe' && (
          <div className="space-y-12 animate-fade-in">
             <header className="flex justify-between items-center px-4">
                <h3 className="text-4xl font-serif font-black dark:text-white italic">Time <span className="text-gold">Elite.</span></h3>
                <button onClick={() => setIsAddingEmployee(true)} className="px-10 py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">+ Registrar Talento</button>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map(emp => (
                   <div key={emp.id} className="bg-white dark:bg-darkCard p-10 rounded-[50px] border border-quartz/10 luxury-shadow flex flex-col items-center text-center group hover:border-ruby transition-all">
                      <div className="relative w-32 h-32 mb-6">
                        <img src={emp.photoUrl} className="w-full h-full object-cover rounded-[45px] border-4 border-ruby shadow-2xl transition-transform group-hover:scale-105 duration-700" />
                        {emp.isPro && <div className="absolute -top-2 -right-2 bg-gold text-onyx p-2 rounded-full shadow-lg"><Icons.Star filled /></div>}
                      </div>
                      <h4 className="text-2xl font-serif font-black dark:text-white italic leading-tight">{emp.name}</h4>
                      <p className="text-ruby text-[10px] font-black uppercase tracking-[0.3em] mt-1 mb-6">{emp.role}</p>
                      <div className="w-full grid grid-cols-2 gap-3">
                         <button 
                          onClick={() => handleEmployeeAgenda(emp)}
                          className="py-4 bg-offwhite dark:bg-onyx dark:text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all active:scale-95"
                         >
                           Agenda
                         </button>
                         <button 
                          onClick={() => handleEmployeeEdit(emp)}
                          className="py-4 border border-ruby text-ruby rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all active:scale-95"
                         >
                           Editar
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* OUTRAS ABAS MANTIDAS (Dashboard, Maison, Serviços, Assinatura) */}
        {activeTab === 'Maison' && (
          <div className="bg-white dark:bg-darkCard rounded-[60px] p-10 md:p-16 luxury-shadow border border-quartz/10 animate-fade-in space-y-12">
             <header className="flex flex-col md:flex-row justify-between items-center gap-10">
                <h3 className="text-4xl font-serif font-black dark:text-white italic text-center md:text-left">Identidade <span className="text-gold">Visual.</span></h3>
                <div className="flex items-center gap-8">
                   <div className="relative group w-32 h-32">
                      <img src={profile.photo} className="w-full h-full object-cover rounded-[40px] border-4 border-ruby shadow-2xl transition-transform group-hover:scale-95 duration-500" />
                      <label className="absolute inset-0 bg-onyx/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[40px] cursor-pointer transition-opacity backdrop-blur-sm">
                         <span className="text-[8px] font-black text-white uppercase tracking-widest">Alterar Foto</span>
                         <input type="file" className="hidden" onChange={handleProfilePhotoChange} accept="image/*" />
                      </label>
                   </div>
                   <button onClick={handleSaveProfile} className="px-12 py-5 bg-ruby text-white rounded-[25px] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                     {isSavingProfile ? 'Sincronizando...' : 'Salvar Maison'}
                   </button>
                </div>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup label="Nome do Salão / Maison" value={profile.businessName} onChange={(v: string) => setProfile({...profile, businessName: v})} />
                <InputGroup label="Endereço Completo" value={profile.address} onChange={(v: string) => setProfile({...profile, address: v})} />
             </div>
             <div ref={maisonMapRef} className="w-full h-96 rounded-[50px] overflow-hidden border-4 border-offwhite dark:border-onyx shadow-inner" />
          </div>
        )}

        {activeTab === 'Serviços' && (
           <div className="space-y-12 animate-fade-in">
              <header className="flex justify-between items-center px-4">
                 <h3 className="text-4xl font-serif font-black dark:text-white italic">Catálogo <span className="text-ruby">Elite.</span></h3>
                 <button onClick={() => setIsAddingService(true)} className="px-10 py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">+ Novo Ritual</button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {services.map(s => (
                    <div key={s.id} className="bg-white dark:bg-darkCard p-8 rounded-[50px] border border-quartz/10 luxury-shadow flex flex-col group overflow-hidden">
                       <div className="h-48 -mx-8 -mt-8 mb-6 overflow-hidden">
                          <img src={s.photoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       </div>
                       <h4 className="text-2xl font-serif font-black dark:text-white mb-2">{s.name}</h4>
                       <p className="text-2xl font-serif font-black text-ruby mb-6">{s.price.toLocaleString()} Kz</p>
                       <button className="w-full py-4 bg-offwhite dark:bg-onyx dark:text-white rounded-2xl text-[9px] font-black uppercase hover:bg-ruby hover:text-white transition-all active:scale-95">Editar Ritual</button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'Assinatura' && (
          <div className="space-y-12 animate-fade-in">
             <header className="text-center space-y-4">
                <h3 className="text-4xl md:text-7xl font-serif font-black dark:text-white italic">Planos de <span className="text-gold">Prestígio.</span></h3>
                <p className="text-quartz text-lg font-medium max-w-2xl mx-auto italic">Escalone sua Maison para o próximo nível.</p>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {plans.map(p => (
                 <div key={p.id} className={`bg-white dark:bg-darkCard p-12 rounded-[60px] border-2 transition-all flex flex-col justify-between group ${p.isPopular ? 'border-gold shadow-[0_30px_60px_rgba(212,175,55,0.1)] scale-105' : 'border-quartz/10 opacity-80'}`}>
                    <div className="space-y-8">
                       <h4 className="text-3xl font-serif font-black dark:text-white italic">{p.name}</h4>
                       <p className="text-4xl font-serif font-black text-ruby">{p.price.toLocaleString()} Kz</p>
                       <ul className="space-y-4">
                          {p.benefits.map((b, i) => <li key={i} className="text-xs font-bold text-stone-500 flex items-center gap-3"><div className="w-1.5 h-1.5 bg-ruby rounded-full" /> {b}</li>)}
                       </ul>
                    </div>
                    <button onClick={() => handleOpenPayment(p)} disabled={profile.planTier === p.id} className="w-full py-6 mt-12 bg-onyx dark:bg-white dark:text-onyx text-white rounded-[25px] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                      {profile.planTier === p.id ? 'Plano Atual' : 'Contratar'}
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>

      {/* MODAL ADICIONAR SERVIÇO */}
      {isAddingService && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-6 backdrop-blur-3xl bg-onyx/95 overflow-y-auto">
           <div className="bg-white dark:bg-darkCard w-full max-w-2xl rounded-[60px] p-10 md:p-16 space-y-8 shadow-2xl animate-fade-in my-8">
              <h3 className="text-3xl font-serif font-black dark:text-white italic text-center">Novo <span className="text-ruby">Ritual.</span></h3>
              <div className="flex flex-col items-center gap-6">
                 <div className="relative group w-full h-56">
                    <img src={newService.photoUrl} className="w-full h-full object-cover rounded-[35px] border-4 border-ruby shadow-xl transition-transform group-hover:scale-95 duration-500" />
                    <label className="absolute inset-0 bg-onyx/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[35px] cursor-pointer transition-opacity backdrop-blur-sm">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Carregar Foto Ritual</span>
                       <input type="file" ref={servicePhotoInputRef} className="hidden" onChange={handleServicePhotoChange} accept="image/*" />
                    </label>
                 </div>
              </div>
              <div className="space-y-6">
                 <InputGroup label="Nome do Serviço" value={newService.name} onChange={(v: string) => setNewService({...newService, name: v})} />
                 <InputGroup label="Valor do Investimento (Kz)" value={newService.price?.toString()} onChange={(v: string) => setNewService({...newService, price: Number(v)})} type="number" />
                 <InputGroup label="Duração Estimada (min)" value={newService.durationMinutes?.toString()} onChange={(v: string) => setNewService({...newService, durationMinutes: Number(v)})} type="number" />
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-quartz ml-6">Especificações do Ritual</label>
                    <textarea value={newService.specification} onChange={(e) => setNewService({...newService, specification: e.target.value})} className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-[30px] py-6 px-10 outline-none dark:text-white font-bold text-sm h-24 resize-none" />
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setIsAddingService(false)} className="flex-1 py-6 bg-offwhite dark:bg-onyx dark:text-white rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
                 <button onClick={handleSaveService} className="flex-[2] py-6 bg-ruby text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Publicar Ritual</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL ADICIONAR EQUIPE */}
      {isAddingEmployee && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-0 md:p-6 backdrop-blur-3xl bg-onyx/95 overflow-y-auto">
           <div className="bg-white dark:bg-darkCard w-full max-w-5xl h-full md:h-auto md:rounded-[60px] p-8 md:p-16 flex flex-col md:flex-row gap-12 shadow-2xl animate-fade-in relative">
              <button onClick={() => setIsAddingEmployee(false)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-offwhite dark:bg-onyx flex items-center justify-center">✕</button>
              <div className="flex-1 space-y-10">
                 <h3 className="text-4xl font-serif font-black dark:text-white italic">Novo <span className="text-gold">Talento.</span></h3>
                 <div className="flex flex-col items-center gap-6">
                    <div className="relative group w-40 h-40">
                       <img src={newEmployee.photoUrl} className="w-full h-full object-cover rounded-[45px] border-4 border-ruby shadow-2xl transition-transform group-hover:scale-95 duration-500" />
                       <label className="absolute inset-0 bg-onyx/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[45px] cursor-pointer transition-opacity backdrop-blur-sm">
                          <span className="text-[8px] font-black text-white uppercase tracking-widest">Alterar Foto</span>
                          <input type="file" ref={employeePhotoInputRef} className="hidden" onChange={handleEmployeePhotoChange} accept="image/*" />
                       </label>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <InputGroup label="Nome do Artista" value={newEmployee.name || ''} onChange={(v: string) => setNewEmployee({...newEmployee, name: v})} />
                    <InputGroup label="Especialidade Principal" value={newEmployee.role || ''} onChange={(v: string) => setNewEmployee({...newEmployee, role: v})} />
                 </div>
              </div>
              <div className="flex-1 space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-quartz tracking-widest ml-6">Localização do Artista no Radar</label>
                    <div ref={employeeMapRef} className="w-full h-72 rounded-[45px] border-4 border-offwhite dark:border-onyx shadow-inner" />
                 </div>
                 <button onClick={handleSaveEmployee} className="w-full py-8 bg-ruby text-white rounded-[35px] font-black uppercase text-[11px] shadow-2xl active:scale-95 transition-all">Ativar no Radar Maison</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, trend }: any) => (
  <div className="bg-white dark:bg-darkCard p-12 rounded-[50px] border border-quartz/10 luxury-shadow space-y-4 group hover:border-ruby transition-all">
     <div className="flex justify-between items-center">
        <p className="text-[10px] font-black uppercase text-quartz tracking-widest">{label}</p>
        <span className="text-ruby text-[10px] font-black italic">{trend}</span>
     </div>
     <h4 className="text-5xl font-serif font-black dark:text-white leading-none tracking-tighter group-hover:scale-105 transition-transform">{value}</h4>
  </div>
);

const InputGroup = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="space-y-3 w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-quartz ml-6">{label}</label>
    <input 
      type={type} 
      value={value} 
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-[30px] py-6 px-10 outline-none dark:text-white font-bold text-sm focus:border-ruby transition-all shadow-inner" 
    />
  </div>
);

export default ProviderManagement;
