
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Marketplace from './components/Marketplace';
import AdminDashboard from './components/AdminDashboard';
import ProviderManagement from './components/ProviderManagement';
import ChatSystem from './components/ChatSystem';
import UserProfile from './components/UserProfile';
import LoginPage from './components/LoginPage';
import MapExplorer from './components/MapExplorer';
import InstallBanner from './components/InstallBanner';
import Agenda from './components/Agenda';
import GlobalChat from './components/GlobalChat';
import SalonHub from './components/SalonHub';
import LandingPage from './components/LandingPage';
import GlowAIConcierge from './components/GlowAIConcierge';
import Home from './components/Home';
import GlobalServices from './components/GlobalServices';
import BookingModal from './components/BookingModal';
import Notification from './components/Notification';
import { UserRole, ProviderProfile, User, Service, AppointmentStatus } from './types';
import { supabase, isTableMissingError } from './lib/supabase';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('glow_user'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [realProviders, setRealProviders] = useState<ProviderProfile[]>([]);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [targetChatContact, setTargetChatContact] = useState<{id: string, name: string} | null>(null);
  const [isNegotiatingMode, setIsNegotiatingMode] = useState(false);
  const [notification, setNotification] = useState<{title: string, message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [isSchemaReady, setIsSchemaReady] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('glow_theme');
    return (saved as any) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Função centralizada para atualizar o usuário em todo o App e DB Local
  const handleUpdateUser = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('glow_user', JSON.stringify(updatedUser));
  }, []);

  const fetchEcossistema = useCallback(async () => {
    try {
      const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
      const { data: services, error: sError } = await supabase.from('services').select('*');
      
      if (isTableMissingError(pError) || isTableMissingError(sError)) {
        setIsSchemaReady(false);
        return;
      }

      setIsSchemaReady(true);
      if (profiles) {
        const mapped: ProviderProfile[] = profiles
          .filter(p => p.role === 'SALON' || p.role === 'PROFESSIONAL' || p.lat) 
          .map(p => {
            const providerServices: Service[] = (services || [])
              .filter(s => s.provider_id === p.id)
              .map(s => ({
                id: s.id,
                providerId: s.provider_id,
                name: s.name,
                price: s.price,
                durationMinutes: s.duration,
                categoryId: s.category_id || 'geral',
                specification: s.description,
                photoUrl: s.photo_url
              }));

            return {
              id: p.id,
              userId: p.id,
              businessName: p.full_name || 'Membro Glow',
              role: (p.role?.toUpperCase() || UserRole.CLIENT) as UserRole,
              location: { 
                address: p.address || 'Luanda, Angola', 
                latitude: Number(p.lat || -8.8383), 
                longitude: Number(p.lng || 13.2344) 
              },
              services: providerServices,
              rating: p.rating || 5.0,
              reviewCount: 0,
              portfolio: p.photo_url ? [p.photo_url] : ['https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600'],
              bio: p.bio || 'Especialista certificado em beleza.',
              planTier: p.plan_tier || 'FREE'
            };
          });
        setRealProviders(mapped);
      }
    } catch (err) {
      console.warn("Sincronização em segundo plano...");
    }
  }, []);

  const fetchUserAppointments = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id, date, time, status, client_id, provider_id,
          client_profile:profiles!client_id (full_name, id, photo_url),
          provider_profile:profiles!provider_id (full_name, id, photo_url),
          services!service_id (id, name, price, provider_id, photo_url)
        `)
        .or(`client_id.eq.${currentUser.id},provider_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        if (isTableMissingError(error)) return;
        throw error;
      }

      if (data) {
        setUserAppointments(data.map((a: any) => {
          const isUserClient = a.client_id === currentUser.id;
          return {
            id: a.id,
            providerId: a.provider_id,
            clientId: a.client_id,
            providerName: isUserClient ? (a.provider_profile?.full_name || "Maison Glow") : (a.client_profile?.full_name || "Cliente Elite"),
            serviceName: a.services?.name || "Ritual",
            price: a.services?.price || 0,
            date: a.date,
            time: a.time,
            status: (a.status as string).toUpperCase() as AppointmentStatus,
            service: a.services,
            isPersonalBooking: isUserClient,
            clientName: a.client_profile?.full_name || "Cliente"
          };
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar rituais:", err);
    }
  }, [currentUser]);

  useEffect(() => {
    const initUser = async () => {
      const savedUserStr = localStorage.getItem('glow_user');
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          
          const finalUser = profile ? {
            ...user,
            name: profile.full_name || user.name,
            photoUrl: profile.photo_url || user.photoUrl,
            glowPoints: profile.glow_points || user.glowPoints,
            role: profile.role || user.role,
            lat: profile.lat,
            lng: profile.lng,
            phone: profile.phone || user.phone
          } : user;

          handleUpdateUser(finalUser);
          setIsAuthenticated(true);
          setShowLanding(false);
          fetchEcossistema();
        } catch (e) {
          localStorage.removeItem('glow_user');
        }
      }
    };
    initUser();
  }, [fetchEcossistema, handleUpdateUser]);

  useEffect(() => {
    if (isAuthenticated) fetchUserAppointments();
  }, [isAuthenticated, activeTab, fetchUserAppointments]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('glow_theme', newTheme);
  }, [theme]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsNegotiatingMode(false);
    if (tab !== 'profile') {
      setTargetChatContact(null);
    }
  };

  const handleLogin = (role: UserRole, email: string, name?: string, phone?: string, id?: string) => {
    const mockUser: User = { id: id || 'u_temp', email, name: name || 'Membro Elite', role, isVerified: true, status: 'active', phone };
    handleUpdateUser(mockUser);
    setIsAuthenticated(true);
    setShowLanding(false);
    fetchEcossistema();
  };

  const handleBookAppointment = async (date: string, time: string, service: Service) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('appointments').insert({
        client_id: currentUser.id,
        provider_id: service.providerId,
        service_id: service.id,
        date,
        time,
        status: AppointmentStatus.PENDING
      });

      if (error) throw error;
      
      setNotification({ title: "Reserva Elite", message: "Ritual agendado com sucesso!", type: 'success' });
      setSelectedProvider(null);
      setSelectedService(null);
      
      await fetchUserAppointments();
      setActiveTab('my-appointments');

    } catch (err: any) {
      setNotification({ title: "Falha técnica", message: "Erro ao registrar agendamento.", type: 'error' });
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      await fetchUserAppointments();
      setNotification({ title: "Status Atualizado", message: `O ritual foi ${status.toLowerCase()} com sucesso.`, type: 'success' });
    } catch (err) {
      setNotification({ title: "Erro", message: "Falha ao atualizar status.", type: 'error' });
    }
  };

  const handleNegotiateAppointment = (clientId: string, clientName: string) => {
    setTargetChatContact({ id: clientId, name: clientName });
    setIsNegotiatingMode(true); 
    setActiveTab('profile'); 
    setNotification({ title: "SMS de Negociação", message: "Canal de chat exclusivo aberto.", type: 'info' });
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Remover permanentemente este registro?")) return;
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      await fetchUserAppointments();
      setNotification({ title: "Ritual Removido", message: "O agendamento foi retirado do ecossistema.", type: 'info' });
    } catch (err) {
      setNotification({ title: "Erro", message: "Falha ao eliminar.", type: 'error' });
    }
  };

  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-offwhite dark:bg-onyx min-h-screen transition-colors duration-500">
        <InstallBanner />
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
        
        {!isSchemaReady && (
          <div className="fixed top-0 left-0 right-0 bg-gold text-onyx text-[9px] font-black py-2.5 z-[9999] text-center uppercase tracking-widest animate-pulse">
            ⚠️ Atenção: Execute o script SQL no editor do Supabase para ativar os agendamentos.
          </div>
        )}

        <Layout 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          role={currentUser?.role || UserRole.CLIENT}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={() => { localStorage.removeItem('glow_user'); setIsAuthenticated(false); }}
        >
          {activeTab === 'home' && (
            (currentUser?.role === UserRole.SALON || currentUser?.role === UserRole.PROFESSIONAL) ? (
              <ProviderManagement 
                user={currentUser} 
                role={currentUser.role} 
                onActionNotify={(t, m, tp) => setNotification({title: t, message: m, type: tp})} 
                onNavigate={handleTabChange}
              />
            ) : (
              <Home providers={realProviders} onStartExploring={handleTabChange} onSelectProvider={setSelectedProvider} />
            )
          )}
          {activeTab === 'my-appointments' && (
            <Agenda 
              bookings={userAppointments} 
              userRole={currentUser?.role}
              onUpdateStatus={updateAppointmentStatus} 
              onDelete={deleteAppointment}
              onNegotiate={handleNegotiateAppointment}
              onChat={(name) => { setTargetChatContact({id: 'dynamic', name}); setIsNegotiatingMode(true); setActiveTab('profile'); }}
              onReschedule={(b) => {
                const provider = realProviders.find(p => p.id === b.providerId);
                if (provider) {
                  setSelectedProvider(provider);
                  setSelectedService(b.service);
                }
              }}
            />
          )}
          {activeTab === 'services' && <GlobalServices providers={realProviders} onSelectService={(p, s) => { setSelectedProvider(p); setSelectedService(s); }} />}
          {activeTab === 'map' && <MapExplorer onSelectProvider={setSelectedProvider} providers={realProviders} />}
          {activeTab === 'discover' && <Marketplace onSelectProvider={setSelectedProvider} onViewOnMap={() => handleTabChange('map')} providers={realProviders} />}
          {activeTab === 'profile' && (
            <div className="space-y-12">
               {!isNegotiatingMode && (
                 <>
                   <UserProfile 
                    user={currentUser} 
                    onLogout={() => { localStorage.removeItem('glow_user'); setIsAuthenticated(false); }} 
                    onUpdateUser={handleUpdateUser} 
                   />
                   <div className="h-px bg-quartz/10"></div>
                 </>
               )}
               <div className="max-w-4xl mx-auto">
                 {isNegotiatingMode && (
                   <button 
                    onClick={() => setIsNegotiatingMode(false)}
                    className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ruby hover:opacity-70 transition-all"
                   >
                     ← Voltar ao meu Perfil
                   </button>
                 )}
                 <ChatSystem user={currentUser} initialContact={targetChatContact} />
               </div>
            </div>
          )}
          {activeTab === 'concierge' && <GlowAIConcierge user={currentUser} providers={realProviders} onSelectProvider={setSelectedProvider} onNavigate={handleTabChange} onShowRoute={(p) => { setSelectedProvider(p); handleTabChange('map'); }} />}
        </Layout>

        {selectedProvider && (
          <BookingModal 
            provider={selectedProvider} 
            initialService={selectedService}
            onClose={() => { setSelectedProvider(null); setSelectedService(null); }} 
            onSuccess={handleBookAppointment} 
          />
        )}
        
        <GlobalChat user={currentUser} />
      </div>
    </div>
  );
};

export default App;
