
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Marketplace from './components/Marketplace';
import AdminDashboard from './components/AdminDashboard';
import BookingModal from './components/BookingModal';
import ProviderManagement from './components/ProviderManagement';
import ClientPanel from './components/ClientPanel';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import MapExplorer from './components/MapExplorer';
import InstallBanner from './components/InstallBanner';
import Agenda from './components/Agenda';
import GlobalChat from './components/GlobalChat';
import ProviderDetails from './components/ProviderDetails';
import GlowAIConcierge from './components/GlowAIConcierge';
import UserProfile from './components/UserProfile';
import Support from './components/Support';
import { UserRole, User, ProviderProfile, Service, AppointmentStatus } from './types';
import { supabase, checkEcossystemHealth } from './lib/supabase';
import { MOCK_PROVIDERS } from './data/mockProviders';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('glow_user'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [dbStatus, setDbStatus] = useState<'healthy' | 'syncing' | 'error'>('syncing');
  
  const [allProviders, setAllProviders] = useState<ProviderProfile[]>(MOCK_PROVIDERS);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('glow_theme') === 'light' ? 'light' : 'dark';
  });

  const syncEcosystem = useCallback(async () => {
    try {
      const health = await checkEcossystemHealth();
      setDbStatus(health.status as any);

      // 1. Sincronizar Profissionais Reais
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', [UserRole.PROFESSIONAL, UserRole.SALON]);

      if (!pError && profiles && profiles.length > 0) {
        const mapped: ProviderProfile[] = profiles.map(p => ({
          id: p.id,
          userId: p.id,
          businessName: p.full_name || "Membro Elite",
          location: { 
            address: p.address || "Luanda", 
            latitude: p.latitude || -8.8383, 
            longitude: p.longitude || 13.2344 
          },
          rating: p.rating || 5.0,
          reviewCount: 0,
          bio: p.bio || "Membro Oficial Beleza Glow.",
          portfolio: [p.photo_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800"],
          planTier: p.plan_tier as any,
          services: [] 
        }));
        setAllProviders(prev => {
          const combined = [...mapped, ...MOCK_PROVIDERS.filter(m => !mapped.find(rm => rm.id === m.id))];
          return combined;
        });
      } 
      
      // 2. Sincronizar Agenda Real
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: bookings, error: bError } = await supabase
          .from('bookings')
          .select('*')
          .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
          .order('date', { ascending: true });
        
        if (!bError && bookings) {
          setMyBookings(bookings.map(b => ({
              id: b.id,
              providerName: b.provider_name,
              serviceName: b.service_name,
              price: b.price,
              date: b.date,
              time: b.time,
              status: b.status as AppointmentStatus
          })));
        }
      }
    } catch (e) {
      console.warn("Modo de resiliência local ativo.");
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const meta = session.user.user_metadata;
        const userObj: User = {
          id: session.user.id,
          email: session.user.email!,
          role: meta.role || UserRole.CLIENT,
          name: meta.full_name || "Membro Elite",
          isVerified: true,
          status: 'active',
          glowPoints: meta.glow_points || 1000
        };
        setCurrentUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('glow_user', JSON.stringify(userObj));
        syncEcosystem();
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('glow_user');
      }
    });

    return () => subscription.unsubscribe();
  }, [syncEcosystem]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('glow_theme', theme);
  }, [theme]);

  const handleLogin = (role: UserRole, email: string) => {
    setShowLanding(false);
    if (role === UserRole.SALON || role === UserRole.PROFESSIONAL) setActiveTab('management');
    else setActiveTab('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab('home');
    setShowLanding(true);
  };

  if (showLanding) return <Home onStartExploring={() => setShowLanding(false)} userRole={currentUser?.role} onSelectProvider={setSelectedProvider} />;
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-offwhite dark:bg-onyx transition-colors duration-700">
      <InstallBanner />
      
      {/* INDICADOR DE INFRAESTRUTURA */}
      <div className="fixed top-6 left-6 z-[9999] hidden md:flex items-center gap-3 bg-onyx/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-2xl">
         <div className={`w-2 h-2 rounded-full ${dbStatus === 'healthy' ? 'bg-emerald animate-pulse' : 'bg-gold animate-spin'}`}></div>
         <span className="text-[8px] font-black uppercase text-white tracking-widest">
           {dbStatus === 'healthy' ? 'Glow Cloud Sync' : 'Connecting Core'}
         </span>
      </div>

      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        role={currentUser?.role || UserRole.CLIENT}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onLogout={handleLogout}
      >
        {activeTab === 'home' && (
          (currentUser?.role === UserRole.SALON || currentUser?.role === UserRole.PROFESSIONAL) ? 
          <ProviderManagement role={currentUser!.role} onLogout={handleLogout} /> :
          <ClientPanel user={currentUser} bookings={myBookings} onNavigate={setActiveTab} onSelectProvider={setSelectedProvider} onActionNotify={() => {}} />
        )}

        {activeTab === 'map' && (
          <div className="h-[78vh] relative rounded-[60px] overflow-hidden luxury-shadow border border-quartz/10">
            <MapExplorer providers={allProviders} onSelectProvider={setSelectedProvider} />
          </div>
        )}

        {activeTab === 'discover' && (
          <Marketplace onSelectProvider={setSelectedProvider} onViewOnMap={() => setActiveTab('map')} providers={allProviders} />
        )}

        {activeTab === 'concierge' && (
          <GlowAIConcierge user={currentUser} onSelectProvider={setSelectedProvider} onNavigate={setActiveTab} onShowRoute={(p) => setActiveTab('map')} />
        )}

        {activeTab === 'bookings' && (
          <Agenda bookings={myBookings} onUpdateStatus={() => syncEcosystem()} onReschedule={() => {}} />
        )}

        {activeTab === 'profile' && <UserProfile user={currentUser} onLogout={handleLogout} />}
        {activeTab === 'support' && <Support />}

        {selectedProvider && (
           <ProviderDetails 
            provider={selectedProvider} 
            onClose={() => setSelectedProvider(null)} 
            onSelectService={(s) => { setBookingService(s); setIsBookingModalOpen(true); }}
            onOpenChat={() => setActiveTab('messages')}
           />
        )}

        {isBookingModalOpen && selectedProvider && (
           <BookingModal 
            provider={selectedProvider} 
            onClose={() => setIsBookingModalOpen(false)} 
            onSuccess={async (date, time) => {
                const { error } = await supabase.from('bookings').insert([{
                    client_id: currentUser?.id,
                    provider_id: selectedProvider.id,
                    provider_name: selectedProvider.businessName,
                    service_name: bookingService?.name || "Ritual Elite",
                    price: bookingService?.price || 0,
                    date,
                    time,
                    status: 'CONFIRMED'
                }]);
                if (!error) syncEcosystem();
                setIsBookingModalOpen(false);
                setActiveTab('bookings');
            }}
           />
        )}
      </Layout>
      <GlobalChat user={currentUser} />
    </div>
  );
};

export default App;
