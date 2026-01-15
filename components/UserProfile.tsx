
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { User, UserRole, Service, PlanTier } from '../types';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
  onNavigateToSupport?: () => void;
}

interface PlanOption {
  id: PlanTier;
  name: string;
  price: number;
  benefits: string[];
  color: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onNavigateToSupport }) => {
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.SALON;
  const [activeSection, setActiveSection] = useState<'general' | 'services' | 'subscription'>('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // States de Identidade
  const [name, setName] = useState(user?.name || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200');
  const [address, setAddress] = useState(user?.phone || '');
  const [currentPlan, setCurrentPlan] = useState<PlanTier>(() => {
    const saved = localStorage.getItem('glow_user');
    if (saved) {
      const u = JSON.parse(saved);
      return u.planTier || 'FREE';
    }
    return 'FREE';
  });
  const [location, setLocation] = useState<{lat: number, lng: number}>({ lat: -8.8383, lng: 13.2344 });

  // States de Assinatura / Pagamento
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [depositantName, setDepositantName] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // States de Serviços
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`glow_services_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    price: 0,
    durationMinutes: 30,
    specification: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const plans: PlanOption[] = [
    { id: 'SILVER', name: 'Silver Glow', price: 1500, color: 'bg-quartz', benefits: ['Destaque no Radar', 'Gestão de 5 Serviços'] },
    { id: 'GOLD', name: 'Gold Elite', price: 2500, color: 'bg-gold', benefits: ['IA de Marketing', 'Selo Verificado Ouro'] },
    { id: 'DIAMOND', name: 'Diamond Pro', price: 25000, color: 'bg-ruby', benefits: ['Tudo Ilimitado', 'Taxa Zero'] }
  ];

  useEffect(() => {
    if (activeSection === 'general' && mapRef.current && !mapInstance.current) {
      const L = (window as any).L;
      if (!L) return;

      mapInstance.current = L.map(mapRef.current, {
        center: [location.lat, location.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);

      markerInstance.current = L.marker([location.lat, location.lng], {
        draggable: true,
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: #9D174D; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.3);"></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(mapInstance.current);

      markerInstance.current.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setLocation({ lat, lng });
      });
    }
  }, [activeSection, location.lat, location.lng]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const updatedUser = { ...user, name, photoUrl, phone: address, location, planTier: currentPlan };
      localStorage.setItem('glow_user', JSON.stringify(updatedUser));
      setIsSaving(false);
      alert("Sua Identidade Elite foi atualizada.");
      window.location.reload();
    }, 800);
  };

  const handleOpenPayment = (plan: PlanOption) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!depositantName || !proofFile) {
      alert("Por favor, insira o nome do depositante e anexe o comprovativo.");
      return;
    }

    setIsSubmittingPayment(true);
    
    // Simulação de envio para o Admin
    setTimeout(() => {
      setIsSubmittingPayment(false);
      setIsPaymentModalOpen(false);
      alert("Pagamento enviado com sucesso! Aguarde a confirmação do administrador (Beleza Glow Admin). Você será notificado assim que o plano for ativado.");
      setDepositantName('');
      setProofFile(null);
    }, 2000);
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price) return;
    const service: Service = {
      ...newService as Service,
      id: 's' + Date.now(),
      providerId: user?.id || 'p1',
      categoryId: 'geral',
      photoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400'
    };
    const updated = [...services, service];
    setServices(updated);
    localStorage.setItem(`glow_services_${user?.id}`, JSON.stringify(updated));
    setIsAddingService(false);
    setNewService({ name: '', price: 0, durationMinutes: 30, specification: '' });
  };

  const removeService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem(`glow_services_${user?.id}`, JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-40">
      {/* HEADER DE PRESTÍGIO */}
      <header className="flex flex-col md:flex-row items-center gap-10 p-10 bg-white dark:bg-darkCard rounded-[50px] luxury-shadow border border-quartz/10 relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-80 h-80 bg-ruby/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="relative group w-48 h-48 shrink-0">
          <div className="w-full h-full rounded-[50px] border-8 border-offwhite dark:border-onyx overflow-hidden shadow-2xl transition-transform group-hover:scale-95 duration-700">
            <img src={photoUrl} className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-onyx/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity rounded-[50px] backdrop-blur-sm"
          >
            <Icons.Star filled />
            <span className="text-[8px] font-black uppercase tracking-widest mt-2">Alterar Foto</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
        </div>

        <div className="text-center md:text-left space-y-4 flex-1">
          <div className="space-y-1">
            <p className="text-ruby text-[10px] font-black uppercase tracking-[0.4em]">
              {isProfessional ? `Profissional ${currentPlan}` : `Membro ${currentPlan}`}
            </p>
            <h2 className="text-5xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter">{name}</h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="bg-gold/10 text-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-gold/10">Status Ativo</span>
            <button onClick={() => setActiveSection('subscription')} className="text-quartz text-[10px] font-black uppercase tracking-widest hover:text-ruby flex items-center gap-2 transition-colors">
              <Icons.Award /> Gerir Assinatura
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* MENU LATERAL */}
        <nav className="lg:col-span-1 space-y-3 sticky top-10 h-fit">
          <button 
            onClick={() => setActiveSection('general')} 
            className={`w-full flex items-center justify-between px-8 py-6 rounded-[30px] transition-all text-[10px] font-black uppercase tracking-widest ${activeSection === 'general' ? 'bg-onyx dark:bg-white text-white dark:text-onyx shadow-2xl scale-105' : 'text-quartz bg-white dark:bg-darkCard border border-quartz/5 hover:border-ruby/20'}`}
          >
            Minha Identidade <Icons.User />
          </button>
          
          {isProfessional && (
            <button 
              onClick={() => setActiveSection('services')} 
              className={`w-full flex items-center justify-between px-8 py-6 rounded-[30px] transition-all text-[10px] font-black uppercase tracking-widest ${activeSection === 'services' ? 'bg-onyx dark:bg-white text-white dark:text-onyx shadow-2xl scale-105' : 'text-quartz bg-white dark:bg-darkCard border border-quartz/5 hover:border-ruby/20'}`}
            >
              Meus Serviços <Icons.Briefcase />
            </button>
          )}

          <button 
            onClick={() => setActiveSection('subscription')} 
            className={`w-full flex items-center justify-between px-8 py-6 rounded-[30px] transition-all text-[10px] font-black uppercase tracking-widest ${activeSection === 'subscription' ? 'bg-onyx dark:bg-white text-white dark:text-onyx shadow-2xl scale-105' : 'text-quartz bg-white dark:bg-darkCard border border-quartz/5'}`}
          >
            Prestígio & Planos <Icons.Award />
          </button>

          <button onClick={onLogout} className="w-full flex items-center justify-between px-8 py-6 rounded-[30px] text-red-600 bg-red-600/5 border border-red-600/10 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
            Desconectar <Icons.Trash />
          </button>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="lg:col-span-3 space-y-8 min-h-[600px]">
          
          {activeSection === 'general' && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-white dark:bg-darkCard rounded-[60px] p-10 md:p-16 border border-quartz/10 luxury-shadow space-y-12">
                <h3 className="text-4xl font-serif font-black dark:text-white italic">Dados <span className="text-ruby">Gerais.</span></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <EditableInput label="Nome Completo ou Negócio" value={name} onChange={setName} />
                  <EditableInput label="E-mail de Cadastro" value={user?.email || ''} readOnly />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-quartz ml-6">Endereço Público</label>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Talatona, Condomínio Aura, Luanda..."
                    className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-[30px] py-8 px-10 outline-none dark:text-white font-bold text-sm h-32 resize-none focus:border-ruby transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-quartz">Sua Localização no Radar</label>
                    <p className="text-[9px] text-ruby font-black animate-pulse uppercase italic tracking-widest">Arraste o Marcador Ouro</p>
                  </div>
                  <div ref={mapRef} className="w-full h-80 rounded-[45px] overflow-hidden border-4 border-offwhite dark:border-onyx shadow-inner z-0" />
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-8 bg-ruby text-white rounded-[35px] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6"
                >
                  {isSaving ? 'Sincronizando...' : 'Atualizar Identidade'} <Icons.ChevronRight />
                </button>
              </div>
            </div>
          )}

          {activeSection === 'services' && isProfessional && (
            <div className="space-y-10 animate-fade-in">
               <header className="flex justify-between items-center px-6">
                  <h3 className="text-4xl font-serif font-black dark:text-white italic">Meus <span className="text-gold">Serviços.</span></h3>
                  <button 
                    onClick={() => setIsAddingService(true)}
                    className="px-10 py-5 bg-ruby text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-4 hover:scale-105 transition-all"
                  >
                    <Icons.Plus /> Novo Serviço
                  </button>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {services.map(s => (
                    <div key={s.id} className="bg-white dark:bg-darkCard p-10 rounded-[50px] border border-quartz/10 luxury-shadow flex flex-col justify-between group hover:border-ruby transition-all">
                       <div className="space-y-4">
                          <h4 className="text-2xl font-serif font-black dark:text-white italic">{s.name}</h4>
                          <p className="text-3xl font-serif font-black text-ruby">{s.price.toLocaleString()} Kz</p>
                          <p className="text-xs text-stone-500 italic font-medium">"{s.specification || 'Sem descrição.'}"</p>
                       </div>
                       <div className="flex gap-4 mt-8 pt-6 border-t border-quartz/5">
                          <button onClick={() => removeService(s.id)} className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Remover</button>
                       </div>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <div className="col-span-full py-40 text-center opacity-30 border-2 border-dashed border-quartz/20 rounded-[60px]">
                       <p className="font-serif italic text-2xl">Seu catálogo está vazio.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeSection === 'subscription' && (
            <div className="bg-white dark:bg-darkCard rounded-[60px] p-10 md:p-16 border border-quartz/10 luxury-shadow space-y-12 animate-fade-in">
               <h3 className="text-4xl font-serif font-black dark:text-white italic">Planos de <span className="text-gold">Prestígio.</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {plans.map(p => {
                   const isCurrentPlan = currentPlan === p.id;

                   return (
                    <div key={p.id} className={`bg-offwhite dark:bg-onyx p-10 rounded-[45px] border-2 transition-all shadow-sm flex flex-col justify-between group ${isCurrentPlan ? 'border-gold bg-gold/5' : 'border-quartz/10 hover:border-ruby'}`}>
                        <div className="space-y-6">
                          <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center text-white shadow-xl`}><Icons.Star filled /></div>
                          <h4 className="font-black text-2xl dark:text-white uppercase tracking-tighter italic">{p.name}</h4>
                          <p className="text-3xl font-serif font-black text-ruby">{p.price.toLocaleString()} Kz</p>
                          <ul className="space-y-4 pt-4">
                              {p.benefits.map((b, i) => <li key={i} className="text-[10px] font-bold text-quartz flex items-center gap-3"><div className="w-2 h-2 bg-ruby rounded-full"></div> {b}</li>)}
                          </ul>
                        </div>
                        <button 
                          disabled={isCurrentPlan}
                          onClick={() => handleOpenPayment(p)}
                          className={`w-full py-5 mt-10 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                            isCurrentPlan 
                              ? 'bg-gold text-onyx cursor-default' 
                              : 'bg-onyx dark:bg-white dark:text-onyx text-white hover:bg-ruby hover:text-white'
                          }`}
                        >
                          {isCurrentPlan ? 'Plano Ativo' : 'Adquirir Nível'}
                        </button>
                    </div>
                   );
                 })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE PAGAMENTO (UPGRADE DE ASSINATURA) */}
      {isPaymentModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-6 backdrop-blur-3xl bg-onyx/90 overflow-y-auto">
           <div className="bg-white dark:bg-darkCard w-full max-w-2xl rounded-[60px] p-10 md:p-16 space-y-8 shadow-2xl animate-fade-in my-8">
              <header className="text-center space-y-4">
                 <h3 className="text-4xl font-serif font-black dark:text-white italic">Upgrade de <span className="text-ruby">Assinatura.</span></h3>
                 <p className="text-quartz text-sm font-medium">Realize o pagamento para um dos canais oficiais Beleza Glow abaixo.</p>
              </header>

              <div className="space-y-6">
                {/* CANAL BAI */}
                <div className="p-8 bg-offwhite dark:bg-onyx rounded-[35px] border border-quartz/10 space-y-4 shadow-inner">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">BAI</div>
                      <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Banco Angolano de Investimentos</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-ruby uppercase tracking-widest">IBAN Oferecido</p>
                      <p className="font-mono text-lg font-black dark:text-white select-all">0040 0000 4414 8222 1023 4</p>
                   </div>
                   <div className="pt-2">
                      <p className="text-[9px] font-black text-quartz uppercase">Titular</p>
                      <p className="font-bold dark:text-white text-sm">NELOI AGOSTINHO MIRANDA CASSUADA</p>
                   </div>
                </div>

                {/* CANAL BFA / EXPRESS */}
                <div className="p-8 bg-offwhite dark:bg-onyx rounded-[35px] border border-quartz/10 space-y-4 shadow-inner">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-[10px]">BFA</div>
                      <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Multicaixa Express / BFA</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-ruby uppercase tracking-widest">Transferência Express</p>
                        <p className="font-mono text-lg font-black dark:text-white select-all">942 644 781</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-quartz uppercase">IBAN BFA</p>
                        <p className="font-mono text-[10px] font-black dark:text-white select-all">0006 0000 9145 1879 3014 7</p>
                      </div>
                   </div>
                </div>

                {/* FORMULÁRIO DE ENVIO */}
                <div className="pt-6 space-y-6">
                   <h4 className="text-xl font-serif font-black dark:text-white italic text-center">Enviar <span className="text-gold">Comprovativo.</span></h4>
                   <p className="text-[10px] text-center text-quartz uppercase tracking-widest">Anexe o ficheiro após a transferência bancária.</p>
                   
                   <div className="space-y-4">
                      <EditableInput 
                        label="Nome do Depositante" 
                        value={depositantName} 
                        onChange={setDepositantName} 
                        placeholder="Nome que consta no comprovativo..."
                      />
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-quartz ml-6">Selecionar Comprovativo (JPG/PDF)</label>
                        <button 
                          onClick={() => proofInputRef.current?.click()}
                          className={`w-full py-6 border-2 border-dashed rounded-[30px] flex items-center justify-center gap-4 transition-all ${proofFile ? 'border-emerald bg-emerald/5 text-emerald' : 'border-quartz/20 text-quartz hover:border-ruby/30'}`}
                        >
                           <Icons.Plus />
                           <span className="text-[10px] font-black uppercase tracking-widest">
                             {proofFile ? proofFile.name : 'Selecionar Ficheiro'}
                           </span>
                        </button>
                        <input 
                          type="file" 
                          ref={proofInputRef} 
                          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                          className="hidden" 
                          accept="image/*,.pdf" 
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                 <button 
                   onClick={() => setIsPaymentModalOpen(false)} 
                   className="flex-1 py-6 bg-offwhite dark:bg-onyx dark:text-white rounded-[25px] font-black text-[10px] uppercase"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleConfirmPayment}
                   disabled={isSubmittingPayment}
                   className="flex-[2] py-6 bg-ruby text-white rounded-[25px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                 >
                   {isSubmittingPayment ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : <Icons.Star filled />}
                   {isSubmittingPayment ? 'Enviando...' : 'Confirmar Pagamento'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL ADICIONAR SERVIÇO */}
      {isAddingService && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 backdrop-blur-3xl bg-onyx/90">
           <div className="bg-white dark:bg-darkCard w-full max-w-xl rounded-[60px] p-12 md:p-16 space-y-10 shadow-2xl animate-fade-in">
              <h3 className="text-4xl font-serif font-black dark:text-white italic text-center">Novo <span className="text-ruby">Serviço.</span></h3>
              <div className="space-y-6">
                 <EditableInput label="Nome do Serviço" value={newService.name} onChange={(v: string) => setNewService({...newService, name: v})} />
                 <EditableInput label="Valor do Investimento (Kz)" value={newService.price?.toString()} onChange={(v: string) => setNewService({...newService, price: Number(v)})} type="number" />
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-quartz ml-6">Descrição / Especificação</label>
                    <textarea 
                      value={newService.specification} 
                      onChange={(e) => setNewService({...newService, specification: e.target.value})}
                      className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-[30px] py-6 px-10 outline-none dark:text-white font-bold text-sm h-24 resize-none"
                    />
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setIsAddingService(false)} className="flex-1 py-6 bg-offwhite dark:bg-onyx dark:text-white rounded-[25px] font-black text-[10px] uppercase">Cancelar</button>
                 <button onClick={handleAddService} className="flex-[2] py-6 bg-ruby text-white rounded-[25px] font-black text-[10px] uppercase tracking-widest shadow-xl">Cadastrar Serviço</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const EditableInput = ({ label, value, onChange, readOnly = false, type = "text", placeholder = "" }: any) => (
  <div className="space-y-3 w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-quartz ml-6">{label}</label>
    <input 
      type={type}
      value={value} 
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-[30px] py-6 px-10 outline-none font-bold text-sm transition-all shadow-inner ${readOnly ? 'opacity-40 cursor-not-allowed' : 'focus:border-ruby dark:text-white placeholder:text-quartz/40'}`} 
    />
  </div>
);

export default UserProfile;
