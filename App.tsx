
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Marketplace from './components/Marketplace';
import AdminDashboard from './components/AdminDashboard';
import BookingModal from './components/BookingModal';
import ProviderManagement from './components/ProviderManagement';
import ClientPanel from './components/ClientPanel';
import ChatSystem from './components/ChatSystem';
import UserProfile from './components/UserProfile';
import Support from './components/Support';
import LoginPage from './components/LoginPage';
import MapExplorer from './components/MapExplorer';
import InstallBanner from './components/InstallBanner';
import Agenda from './components/Agenda';
import GlobalChat from './components/GlobalChat';
import ProviderDetails from './components/ProviderDetails';
import SalonHub from './components/SalonHub';
import LandingPage from './components/LandingPage';
import Plans from './components/Plans';
import SalesPage from './components/SalesPage';
import GlowAIConcierge from './components/GlowAIConcierge';
import GlowPoints from './components/GlowPoints';
import Coupons from './components/Coupons';
import BusinessNotificationCenter, { BusinessNotification } from './components/BusinessNotificationCenter';
import { UserRole, ProviderProfile, User, Service, AppointmentStatus } from './types';
import { MOCK_PROVIDERS } from './data/mockProviders';
import { Icons } from './constants';

interface AppNotification {
  message: string;
  type: 'success' | 'error' | 'info';
  title: string;
}

interface Booking {
  id: string;
  providerName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: AppointmentStatus;
}

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('glow_user'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminOriginal, setAdminOriginal] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [pendingRouteTo, setPendingRouteTo] = useState<ProviderProfile | null>(null);
  const [initialChatClient, setInitialChatClient] = useState<string | null>(null);
  
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const [globalNotifications, setGlobalNotifications] = useState<BusinessNotification[]>([
    { id: '1', type: 'SYSTEM', title: 'Boas-vindas Elite', message: 'Você agora faz parte da rede Beleza Glow.', timestamp: 'Agora', read: false },
    { id: '2', type: 'COUPON', title: 'Ponto de Fidelidade', message: 'Você recebeu 500 pontos por completar seu perfil.', timestamp: 'Há 5 min', read: false }
  ]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('glow_bookings_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('glow_theme');
    return (saved as any) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('glow_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowLanding(false);
      if (user.role === UserRole.ADMIN) {
        setActiveTab('admin');
        setAdminOriginal(user);
      }
      else if (user.role === UserRole.SALON || user.role === UserRole.PROFESSIONAL) setActiveTab('management');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('glow_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(prev => (prev === 'light' ? 'dark' : 'light')), []);
  
  const notify = useCallback((title: string, message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ title, message, type });
    const newGlobalNotif: BusinessNotification = {
      id: Date.now().toString(),
      type: type === 'success' ? 'SYSTEM' : 'BOOKING',
      title,
      message,
      timestamp: 'Agora',
      read: false
    };
    setGlobalNotifications(prev => [newGlobalNotif, ...prev]);
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleUpdateBookingStatus = useCallback((id: string, status: AppointmentStatus) => {
    setBookings(prev => {
      let updated;
      if (status === AppointmentStatus.CANCELLED) {
        updated = prev.filter(b => b.id !== id);
        notify("Ritual Removido", "Sua agenda foi atualizada.", "info");
      } else {
        updated = prev.map(b => b.id === id ? { ...b, status } : b);
      }
      localStorage.setItem('glow_bookings_v2', JSON.stringify(updated));
      return updated;
    });
  }, [notify]);

  const handleReschedule = useCallback((booking: Booking) => {
    const provider = MOCK_PROVIDERS.find(p => p.businessName === booking.providerName);
    if (provider) {
      setSelectedProvider(provider);
      const service = provider.services.find(s => s.name === booking.serviceName);
      setBookingService(service || null);
      setIsBookingModalOpen(true);
      notify("Remarcação Ativa", "Escolha um novo horário.", "info");
    }
  }, [notify]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSelectedProvider(null);
    setIsBookingModalOpen(false);
    setIsChatOpen(false);
    if (tab !== 'messages') setInitialChatClient(null);
  }, []);

  const handleShowRouteOnMap = useCallback((p: ProviderProfile) => {
    setPendingRouteTo(p);
    setActiveTab('map');
  }, []);

  const handleAcceptRequest = (request: any) => {
    const newBooking: Booking = {
      id: 'b' + Date.now(),
      providerName: "Minha Maison",
      serviceName: request.service,
      price: request.price,
      date: request.date,
      time: request.time,
      status: AppointmentStatus.CONFIRMED
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('glow_bookings_v2', JSON.stringify(updated));
    notify("Agenda Confirmada", `Ritual registrado com sucesso.`, "success");
  };

  const handleOpenDirectChat = useCallback((clientName: string) => {
    setInitialChatClient(clientName);
    setActiveTab('messages');
  }, []);

  const handleMarkNotifRead = (id: string) => {
    setGlobalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogin = (role: UserRole, email: string, name?: string, phone?: string, id?: string) => {
    const isAdmin = email.toLowerCase() === 'neloimik@gmail.com';
    const finalRole = isAdmin ? UserRole.ADMIN : role;

    const mockUser: User = {
      id: id || 'u_' + Math.random().toString(36).substr(2, 9),
      email: email,
      name: isAdmin ? 'Neloi Mestre' : 
            name || (finalRole === UserRole.CLIENT ? 'Membro Elite' : 
            finalRole === UserRole.SALON ? 'Glow Maison' : 'Artista Glow'),
      role: finalRole,
      isVerified: true,
      status: 'active',
      phone: phone,
      planTier: isAdmin ? 'BLACK' : (finalRole === UserRole.SALON || finalRole === UserRole.PROFESSIONAL) ? 'SILVER' : 'FREE',
      glowPoints: isAdmin ? 99999 : 1250 
    };
    
    localStorage.setItem('glow_user', JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    if(isAdmin) setAdminOriginal(mockUser);
    setIsAuthenticated(true);
    setShowLanding(false);

    if (finalRole === UserRole.ADMIN) setActiveTab('admin');
    else if (finalRole === UserRole.SALON || finalRole === UserRole.PROFESSIONAL) setActiveTab('management');
    else setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('glow_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('home');
    setShowLanding(true);
  };

  const handleMasquerade = (targetUser: User) => {
    setCurrentUser(targetUser);
    setActiveTab('home');
    notify("Auditoria Ativa", `Você entrou como ${targetUser.name}.`, "info");
  };

  const exitMasquerade = () => {
    if (adminOriginal) {
      setCurrentUser(adminOriginal);
      setActiveTab('admin');
      notify("Sessão ADM", "Retornando à Governança.", "success");
    }
  };

  const globalGalleryItems = useMemo(() => 
    MOCK_PROVIDERS.flatMap((p: ProviderProfile) => p.portfolio.map((img: string) => ({ img, provider: p }))),
  []);

  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const isSalon = (p: ProviderProfile) => {
    const name = p.businessName.toLowerCase();
    return name.includes('salon') || name.includes('atelier') || name.includes('maison') || (p.employees && p.employees.length > 1);
  };

  const unreadNotifsCount = globalNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-offwhite dark:bg-onyx transition-opacity duration-300">
      <InstallBanner />
      
      {adminOriginal && currentUser?.id !== adminOriginal.id && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-xs animate-fade-in px-4">
           <button 
            onClick={exitMasquerade}
            className="w-full py-3 bg-gold text-onyx rounded-full font-black uppercase text-[8px] tracking-[0.3em] shadow-2xl border-2 border-white animate-pulse"
           >
             SAIR DO PERFIL ALHEIO
           </button>
        </div>
      )}

      {notification && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-md animate-fade-in">
          <div className="bg-onyx/90 backdrop-blur-xl p-6 rounded-[30px] border-2 shadow-2xl flex items-center gap-5 border-gold/30">
            <div className="flex-1 overflow-hidden text-white">
              <h4 className="font-serif font-bold text-lg italic text-gold">{notification.title}</h4>
              <p className="text-quartz text-xs truncate">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {isNotifCenterOpen && (
        <BusinessNotificationCenter 
          notifications={globalNotifications}
          onMarkAsRead={handleMarkNotifRead}
          onClose={() => setIsNotifCenterOpen(false)}
        />
      )}

      <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        role={currentUser?.role || UserRole.CLIENT}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        unreadNotifsCount={unreadNotifsCount}
        onToggleNotifs={() => setIsNotifCenterOpen(!isNotifCenterOpen)}
      >
        {activeTab === 'home' && (
          (currentUser?.role === UserRole.SALON || currentUser?.role === UserRole.PROFESSIONAL) ? (
             <ProviderManagement 
              user={currentUser}
              role={currentUser!.role} 
              onLogout={handleLogout} 
              onActionNotify={notify} 
              onAcceptBooking={handleAcceptRequest}
              onOpenChatWithClient={handleOpenDirectChat}
              onNavigateToDiscover={() => setActiveTab('discover')}
              theme={theme}
              toggleTheme={toggleTheme}
             />
          ) : (
            <ClientPanel user={currentUser} bookings={bookings} onNavigate={handleTabChange} onSelectProvider={setSelectedProvider} onActionNotify={notify} />
          )
        )}
        
        {activeTab === 'gallery_discover' && (
          <div className="space-y-16 animate-fade-in pb-40 px-4 md:px-0">
             {/* ... conteúdo da galeria ... */}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-[75vh] relative">
            <MapExplorer onSelectProvider={setSelectedProvider} providers={MOCK_PROVIDERS} />
          </div>
        )}
        {activeTab === 'discover' && <Marketplace onSelectProvider={setSelectedProvider} onViewOnMap={() => handleTabChange('map')} providers={MOCK_PROVIDERS} />}
        {activeTab === 'messages' && <ChatSystem user={currentUser} onNavigateToBooking={() => handleTabChange('discover')} initialClientName={initialChatClient} />}
        {activeTab === 'concierge' && (
          <GlowAIConcierge 
            user={currentUser} 
            onSelectProvider={setSelectedProvider} 
            onNavigate={handleTabChange} 
            onShowRoute={handleShowRouteOnMap} 
          />
        )}
        {activeTab === 'points' && (
          <GlowPoints 
            user={currentUser} 
            onNavigateToBooking={() => handleTabChange('discover')} 
          />
        )}
        {activeTab === 'coupons' && (
          <Coupons onActionNotify={notify} />
        )}
        {activeTab === 'profile' && <UserProfile user={currentUser} onLogout={handleLogout} onNavigateToSupport={() => handleTabChange('support')} />}
        {activeTab === 'support' && <Support />}
        
        {activeTab === 'plans_sales' && (
           <SalesPage onPlanSelect={() => setActiveTab('plans')} onBack={() => setActiveTab('management')} />
        )}
        {activeTab === 'plans' && <Plans />}

        {activeTab === 'admin' && currentUser?.role === UserRole.ADMIN && <AdminDashboard onMasquerade={handleMasquerade} />}
        {activeTab === 'management' && (currentUser?.role === UserRole.SALON || currentUser?.role === UserRole.PROFESSIONAL) && (
          <ProviderManagement 
            user={currentUser}
            role={currentUser!.role} 
            onLogout={handleLogout} 
            onActionNotify={notify} 
            onAcceptBooking={handleAcceptRequest}
            onOpenChatWithClient={handleOpenDirectChat}
            onNavigateToDiscover={() => setActiveTab('discover')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
        {activeTab === 'bookings' && (
          <Agenda 
            bookings={bookings} 
            onUpdateStatus={handleUpdateBookingStatus} 
            onReschedule={handleReschedule} 
          />
        )}

        {selectedProvider && !isBookingModalOpen && (
          isSalon(selectedProvider) ? (
            <SalonHub 
              salon={selectedProvider} 
              userRole={currentUser?.role} 
              onClose={() => setSelectedProvider(null)} 
              onSelectService={(s: Service) => { setBookingService(s); setIsBookingModalOpen(true); }} 
              onOpenChat={() => handleTabChange('messages')} 
              onOpenDashboard={() => (currentUser?.role === UserRole.SALON || currentUser?.role === UserRole.PROFESSIONAL) ? handleTabChange('management') : null}
            />
          ) : (
            <ProviderDetails provider={selectedProvider} onClose={() => setSelectedProvider(null)} onSelectService={(s: Service) => { setBookingService(s); setIsBookingModalOpen(true); }} onOpenChat={() => handleTabChange('messages')} />
          )
        )}

        {selectedProvider && isBookingModalOpen && (
          <BookingModal 
            provider={selectedProvider} 
            onClose={() => { setIsBookingModalOpen(false); setBookingService(null); }} 
            onSuccess={(date: string, time: string) => {
              const newBooking: Booking = { id: 'b' + Date.now(), providerName: selectedProvider.businessName, serviceName: bookingService?.name || "Serviço Elite", price: bookingService?.price || 0, date, time, status: AppointmentStatus.CONFIRMED };
              const updated = [newBooking, ...bookings];
              setBookings(updated);
              localStorage.setItem('glow_bookings_v2', JSON.stringify(updated));
              notify("Confirmado", "Sua reserva está registrada.", "success");
              setIsBookingModalOpen(false);
              handleTabChange('bookings');
            }} 
          />
        )}
      </Layout>
      <GlobalChat user={currentUser} forcedOpen={isChatOpen} onForcedClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
