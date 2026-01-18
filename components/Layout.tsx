
import React, { ReactNode } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout?: () => void;
  unreadNotifsCount?: number;
  onToggleNotifs?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  role, 
  theme, 
  toggleTheme, 
  onLogout,
  unreadNotifsCount = 0,
  onToggleNotifs
}) => {
  const isBusinessUser = role === UserRole.PROFESSIONAL || role === UserRole.SALON;
  const isSalon = role === UserRole.SALON;
  const isPro = role === UserRole.PROFESSIONAL;
  const isAdmin = role === UserRole.ADMIN;

  const handleShareApp = async () => {
    const shareData = {
      title: 'Beleza Glow Elite',
      text: 'Descubra os rituais de beleza mais exclusivos de Angola no Beleza Glow.',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert("Link Elite copiado para a área de transferência!");
      }
    } catch (err) {
      console.log('User cancelled or error sharing');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-offwhite dark:bg-onyx pb-32 md:pb-0 md:pl-80 transition-colors duration-700">
      
      {/* HEADER MOBILE (Para botões de ação rápida no topo) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-onyx/80 backdrop-blur-xl border-b border-quartz/10 z-[100] px-6 flex items-center justify-between">
         <h1 className="font-serif font-black italic text-xl dark:text-white">Glow <span className="text-ruby">Elite</span></h1>
         <div className="flex items-center gap-3">
            <button onClick={handleShareApp} className="p-3 bg-ruby/10 text-ruby rounded-xl active:scale-90 transition-all">
              <Icons.Share />
            </button>
            <button onClick={onToggleNotifs} className="relative p-3 bg-offwhite dark:bg-darkCard rounded-xl text-quartz">
               <Icons.Bell filled={unreadNotifsCount > 0} />
               {unreadNotifsCount > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-ruby rounded-full border border-white"></div>}
            </button>
         </div>
      </header>

      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-darkCard border-r border-quartz/10 dark:border-white/5 z-50 transition-colors duration-500">
        <div className="p-12 space-y-8">
          <button onClick={() => onTabChange('home')} className="group text-left transition-all active:scale-95">
            <h1 className="text-3xl font-serif font-black text-onyx dark:text-white tracking-tighter flex items-center gap-2 transition-colors duration-500">
              GLOW <span className="font-normal italic text-gold">ELITE</span>
            </h1>
            <p className="text-[10px] text-quartz dark:text-quartz/50 uppercase font-black tracking-[0.5em] mt-4 group-hover:tracking-[0.7em] transition-all">Angola Concierge</p>
          </button>

          <div className="flex gap-3">
            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center h-16 bg-offwhite dark:bg-onyx rounded-2xl border border-quartz/20 dark:border-white/10 hover:border-ruby transition-all group shadow-sm text-ruby">
              {theme === 'light' ? 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> : 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
              }
            </button>
            <button onClick={handleShareApp} className="flex-1 flex items-center justify-center h-16 bg-ruby/5 text-ruby rounded-2xl border border-ruby/20 hover:bg-ruby hover:text-white transition-all shadow-sm">
               <Icons.Share />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 px-8 space-y-3 mt-4 overflow-y-auto scrollbar-hide pb-10">
          <NavItem icon={<Icons.Star filled={activeTab === 'home'} />} label="Início" active={activeTab === 'home'} onClick={() => onTabChange('home')} />
          <NavItem icon={<Icons.Map />} label="Radar Global" active={activeTab === 'map'} onClick={() => onTabChange('map')} />
          <NavItem icon={<Icons.Calendar />} label="Meus Rituais" active={activeTab === 'bookings'} onClick={() => onTabChange('bookings')} />
          
          {isBusinessUser && (
            <div className="pt-8 border-t border-quartz/10 mt-8 space-y-3">
              <p className="text-ruby text-[10px] font-black uppercase tracking-[0.3em] px-6 mb-4">{isSalon ? 'Ferramentas Maison' : 'Ferramentas Artista'}</p>
              <NavItem icon={<Icons.Chart />} label={isSalon ? 'Console Maison' : 'Dashboard Artista'} active={activeTab === 'management' || (isPro && activeTab === 'home')} onClick={() => onTabChange(isSalon ? 'management' : 'home')} />
            </div>
          )}
          
          <div className="pt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] px-6 mb-6 text-quartz/60">Canal Directo</p>
            <NavItem icon={<Icons.Message />} label="Mensagens VIP" active={activeTab === 'messages'} onClick={() => onTabChange('messages')} />
            <NavItem icon={<Icons.User />} label="Meu Perfil" active={activeTab === 'profile'} onClick={() => onTabChange('profile')} />
          </div>
        </nav>

        <div className="p-10 border-t border-quartz/10 dark:border-white/5">
           <button onClick={onLogout} className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Sair</button>
        </div>
      </aside>

      {/* MOBILE NAV BOTTOM */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] h-22 bg-onyx/95 dark:bg-darkCard/98 backdrop-blur-3xl rounded-[40px] flex items-center justify-around px-2 z-[100] shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10">
        <NavButton active={activeTab === 'home'} onClick={() => onTabChange('home')} icon={<Icons.Home />} label="Home" />
        <NavButton active={activeTab === 'map'} onClick={() => onTabChange('map')} icon={<Icons.Map />} label="Radar" />
        
        <button 
          onClick={() => onTabChange(isSalon ? 'management' : isPro ? 'home' : 'concierge')} 
          className={`-mt-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 bg-gold text-onyx ring-4 ring-gold/20`}
        >
          {isBusinessUser ? <Icons.Chart /> : <Icons.Star filled />}
        </button>

        <NavButton active={activeTab === 'messages'} onClick={() => onTabChange('messages')} icon={<Icons.Message />} label="Chat" />
        <NavButton active={activeTab === 'profile'} onClick={() => onTabChange('profile')} icon={<Icons.User />} label="Perfil" />
      </nav>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 pt-28 md:p-16 animate-fade-in overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-500 active:scale-75 ${active ? 'text-ruby scale-110' : 'text-quartz/40'}`}>
    <div className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-ruby/15 shadow-inner' : ''}`}>{icon}</div>
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[30px] transition-all duration-500 group ${active ? 'bg-onyx dark:bg-white text-white dark:text-onyx shadow-2xl scale-105' : 'text-quartz hover:bg-quartz/5 hover:text-onyx dark:hover:text-white'}`}>
    <span className={`transition-all duration-700 ${active ? 'scale-125 rotate-6 text-ruby' : 'group-hover:scale-110'}`}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default Layout;
