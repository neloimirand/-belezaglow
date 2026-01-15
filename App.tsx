
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Marketplace from './components/Marketplace';
import AdminDashboard from './components/AdminDashboard';
import BookingModal from './components/BookingModal';
import ProviderManagement from './components/ProviderManagement';
import UserProfile from './components/UserProfile';
import Support from './components/Support';
import Auth from './components/Auth';
import Home from './components/Home';
import MapExplorer from './components/MapExplorer';
import InstallBanner from './components/InstallBanner';
import BookingsView from './components/BookingsView';
import GlobalChat from './components/GlobalChat';
import ProviderDetails from './components/ProviderDetails';
import { UserRole, ProviderProfile, User, Service, AppointmentStatus } from './types';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminMasquerade, setAdminMasquerade] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('glow_bookings_v2');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', providerName: 'L’Atelier Beauty', serviceName: 'Corte Sculpting', price: 15000, date: '25/05/2024', time: '14:00', status: AppointmentStatus.CONFIRMED },
    ];
  });

  useEffect(() => {
    localStorage.setItem('glow_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('glow_theme');
    return (saved as any) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('glow_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('glow_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const notify = useCallback((title: string, message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleUpdateBookingStatus = (id: string, status: AppointmentStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (status === AppointmentStatus.COMPLETED) {
      notify("Serviço Concluído", "Seu histórico foi atualizado com sucesso.", "success");
    }
  };

  const handleLogin = (role: UserRole, email: string) => {
    const isMasterAdmin = email === 'neloimik@gmail.com';
    const finalRole = isMasterAdmin ? UserRole.ADMIN : role;

    const mockUser: User = {
      id: isMasterAdmin ? 'admin_master' : 'u_' + Math.random().toString(36).substr(2, 9),
      email: email,
      name: isMasterAdmin ? 'Neloi Miranda (ADM)' : 'Membro Elite',
      role: finalRole,
      isVerified: true,
      status: 'active'
    };
    localStorage.setItem('glow_user', JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    
    if (finalRole === UserRole.ADMIN) setActiveTab('admin');
    else if (finalRole === UserRole.CLIENT) setActiveTab('home');
    else setActiveTab('management');
  };

  const handleLogout = () => {
    localStorage.removeItem('glow_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAdminMasquerade(null);
    setActiveTab('home');
  };

  const handleMasquerade = (user: any) => {
    setAdminMasquerade(user);
    setActiveTab(user.role === 'CLIENT' ? 'home' : 'management');
    notify("Modo Suporte Ativado", `Você agora está vendo o sistema como ${user.name}.`, "info");
  };

  const exitMasquerade = () => {
    setAdminMasquerade(null);
    setActiveTab('admin');
  };

  if (!isAuthenticated) return <Auth onLogin={handleLogin} />;

  const displayUser = adminMasquerade || currentUser;

  return (
    <div className="min-h-screen bg-offwhite dark:bg-onyx">
      <InstallBanner />
      
      {adminMasquerade && (
        <div className="fixed top-0 left-0 right-0 z-[3000] bg-ruby text-white py-2 px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
             MODO SUPORTE: VIZUALIZANDO COMO {adminMasquerade.name}
          </div>
          <button onClick={exitMasquerade} className="bg-white text-ruby px-4 py-1 rounded-full hover:scale-105 transition-all">Sair e Voltar ao ADM</button>
        </div>
      )}

      {notification && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-md animate-fade-in">
          <div className="glass-dark p-6 rounded-[30px] border-2 shadow-2xl flex items-center gap-5 border-gold/30">
            <div className="flex-1 overflow-hidden text-white">
              <h4 className="font-serif font-bold text-lg">{notification.title}</h4>
              <p className="text-quartz text-xs truncate">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        role={displayUser?.role || UserRole.CLIENT}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      >
        {activeTab === 'home' && (
          <Home 
            onStartExploring={setActiveTab} 
            onSelectProvider={(p) => setSelectedProvider(p)} 
          />
        )}
        {activeTab === 'map' && <div className="h-[75vh] animate-fade-in"><MapExplorer onSelectProvider={setSelectedProvider} /></div>}
        {activeTab === 'discover' && <Marketplace onSelectProvider={setSelectedProvider} onViewOnMap={() => setActiveTab('map')} />}
        {activeTab === 'profile' && <UserProfile user={displayUser} onLogout={handleLogout} onNavigateToSupport={() => setActiveTab('support')} />}
        {activeTab === 'support' && <Support />}
        {activeTab === 'admin' && currentUser?.role === UserRole.ADMIN && !adminMasquerade && <AdminDashboard onMasquerade={handleMasquerade} />}
        {activeTab === 'management' && (displayUser?.role === UserRole.PROFESSIONAL || displayUser?.role === UserRole.SALON) && (
          <ProviderManagement 
            role={displayUser.role} 
            onLogout={handleLogout} 
            onActionNotify={notify} 
            onSelectProviderForBooking={setSelectedProvider}
            onViewOnMap={() => setActiveTab('map')}
          />
        )}
        {activeTab === 'bookings' && (
          <BookingsView 
            bookings={bookings} 
            onUpdateStatus={handleUpdateBookingStatus} 
          />
        )}

        {/* FLUXO DE DETALHES (SALÃO OU PRO) */}
        {selectedProvider && !isBookingModalOpen && (
          <ProviderDetails 
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
            onSelectService={(s) => {
              setBookingService(s);
              setIsBookingModalOpen(true);
            }}
            onOpenChat={() => {
              setSelectedProvider(null);
              setIsChatOpen(true);
            }}
          />
        )}

        {/* MODAL DE AGENDAMENTO FINAL (PRECIZÃO DE MINUTOS) */}
        {selectedProvider && isBookingModalOpen && (
          <BookingModal 
            provider={selectedProvider} 
            onClose={() => {
              setIsBookingModalOpen(false);
              setBookingService(null);
            }} 
            onSuccess={(date, time) => {
              const newBooking: Booking = {
                id: 'b' + Date.now(),
                providerName: selectedProvider.businessName,
                serviceName: bookingService?.name || "Serviço Elite",
                price: bookingService?.price || 0,
                date: date,
                time: time,
                status: AppointmentStatus.CONFIRMED
              };
              setBookings(prev => [newBooking, ...prev]);
              setIsBookingModalOpen(false);
              setBookingService(null);
              setSelectedProvider(null);
              setActiveTab('bookings');
              notify("Agendamento Solicitado", `Seu horário para ${date} às ${time} foi enviado.`, "success");
            }} 
          />
        )}
      </Layout>

      <GlobalChat user={displayUser} forcedOpen={isChatOpen} onForcedClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
