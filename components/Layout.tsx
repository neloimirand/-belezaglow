
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
  return (
    <div className="flex flex-col min-h-screen bg-offwhite dark:bg-onyx pb-32 md:pb-0 md:pl-80 transition-colors duration-700 overflow-x-hidden">
      
      {/* HEADER MOBILE CENTRALIZADO - LUXURY SYMMETRY */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-24 bg-white/90 dark:bg-onyx/90 backdrop-blur-3xl border-b border-quartz/10 z-[500] px-6 flex items-center justify-between safe-top">
         <div className="w-12">
            <button onClick={toggleTheme} className="p-3 bg-offwhite dark:bg-darkCard rounded-2xl text-ruby shadow-sm active:scale-90 transition-all border border-quartz/5">
               {theme === 'light' ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>}
            </button>
         </div>
         
         <div className="flex flex-col items-center text-center">
            <h1 className="font-serif font-black italic text-2xl dark:text-white tracking-tighter leading-none">Glow <span className="text-ruby">Elite</span></h1>
            <p className="text-[7px] font-black uppercase text-gold tracking-[0.5em] mt-1">Angola Private Network</p>
         </div>

         <div className="w-12 flex justify-end">
            <button onClick={onToggleNotifs} className="relative p-3 bg-ruby/10 text-ruby rounded-2xl transition-all active:scale-90 border border-ruby/10">
               <Icons.Bell filled={unreadNotifsCount > 0} />
               {unreadNotifsCount > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-ruby rounded-full border border-white"></div>}
            </button>
         </div>
      </header>

      {/* Sidebar Desktop Permanence */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-darkCard border-r border-quartz/10 z-50">
        <div className="p-12 space-y-8">
          <button onClick={() => onTabChange('home')} className="group text-left focus:outline-none">
            <h1 className="text-3xl font-serif font-black text-onyx dark:text-white tracking-tighter">
              GLOW <span className="font-normal italic text-gold">ELITE</span>
            </h1>
            <p className="text-[10px] text-quartz uppercase font-black tracking-[0.5em] mt-4">Angola Concierge</p>
          </button>
        </div>
        
        <nav className="flex-1 px-8 space-y-3 overflow-y-auto scrollbar-hide py-6">
          <NavItem active={activeTab === 'home'} onClick={() => onTabChange('home')} icon={<Icons.Home />} label="DASHBOARD" />
          <NavItem active={activeTab === 'services'} onClick={() => onTabChange('services')} icon={<Icons.Briefcase />} label="RITUAIS" />
          <NavItem active={activeTab === 'my-appointments'} onClick={() => onTabChange('my-appointments')} icon={<Icons.Calendar />} label="COMPROMISSOS" />
          <NavItem active={activeTab === 'discover'} onClick={() => onTabChange('discover')} icon={<Icons.Search />} label="RADAR ELITE" />
          <NavItem active={activeTab === 'map'} onClick={() => onTabChange('map')} icon={<Icons.Map />} label="MAPA LIVE" />
          <NavItem active={activeTab === 'concierge'} onClick={() => onTabChange('concierge')} icon={<Icons.Star filled />} label="IA CONCIERGE" />
          <div className="h-px bg-quartz/10 my-8 mx-4" />
          <NavItem active={activeTab === 'profile'} onClick={() => onTabChange('profile')} icon={<Icons.User />} label="MINHA CONTA" />
        </nav>

        {onLogout && (
          <div className="p-12 border-t border-quartz/5">
            <button onClick={onLogout} className="text-[9px] font-black uppercase text-quartz hover:text-ruby transition-all flex items-center gap-4">
               Sair da Maison
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 md:p-12 pt-32 md:pt-12">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Bottom Navigation Mobile - ERGONOMIC SYMMETRY */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-onyx/95 backdrop-blur-2xl border border-white/10 rounded-[35px] z-[500] flex items-center justify-around px-2 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        <button onClick={() => onTabChange('home')} className={`p-4 transition-all ${activeTab === 'home' ? 'text-ruby scale-125' : 'text-quartz opacity-50'}`}><Icons.Home /></button>
        <button onClick={() => onTabChange('services')} className={`p-4 transition-all ${activeTab === 'services' ? 'text-ruby scale-125' : 'text-quartz opacity-50'}`}><Icons.Briefcase /></button>
        <button onClick={() => onTabChange('my-appointments')} className={`p-4 transition-all ${activeTab === 'my-appointments' ? 'text-ruby scale-125' : 'text-quartz opacity-50'}`}><Icons.Calendar /></button>
        <button onClick={() => onTabChange('map')} className={`p-4 transition-all ${activeTab === 'map' ? 'text-ruby scale-125' : 'text-quartz opacity-50'}`}><Icons.Map /></button>
        <button onClick={() => onTabChange('concierge')} className={`p-4 transition-all ${activeTab === 'concierge' ? 'text-ruby scale-125' : 'text-quartz opacity-50'}`}><Icons.Star filled /></button>
        <button onClick={() => onTabChange('profile')} className={`p-4 transition-all ${activeTab === 'profile' ? 'text-ruby scale-125' : 'text-quartz opacity-50'}`}><Icons.User /></button>
      </nav>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all group ${active ? 'bg-ruby text-white shadow-xl scale-[1.02]' : 'text-quartz hover:bg-offwhite dark:hover:bg-onyx'}`}>
    <div className={`transition-transform ${active ? 'scale-110' : 'scale-90'}`}>{icon}</div>
    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default Layout;
