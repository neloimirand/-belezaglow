
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
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, role, theme, toggleTheme, onLogout }) => {
  const isBusinessUser = role === UserRole.PROFESSIONAL || role === UserRole.SALON;

  return (
    <div className="flex flex-col min-h-screen bg-offwhite dark:bg-onyx pb-32 md:pb-0 md:pl-80 transition-colors duration-700">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-darkCard border-r border-quartz/10 dark:border-white/5 z-50 transition-colors duration-500">
        <div className="p-12 space-y-8">
          <button 
            onClick={() => onTabChange('home')}
            className="group text-left transition-all active:scale-95"
          >
            <h1 className="text-3xl font-serif font-black text-onyx dark:text-blue-600 tracking-tighter flex items-center gap-2 transition-colors duration-500">
              GLOW <span className="font-normal italic">ELITE</span>
            </h1>
            <p className="text-[10px] text-quartz dark:text-quartz/50 uppercase font-black tracking-[0.5em] mt-4 group-hover:tracking-[0.7em] transition-all">Angola Concierge</p>
          </button>

          <button 
            onClick={toggleTheme}
            className="flex items-center gap-4 px-6 py-4 bg-offwhite dark:bg-onyx rounded-[25px] border border-quartz/20 dark:border-white/10 hover:border-ruby transition-all group w-full shadow-sm"
          >
            <div className="text-ruby group-hover:rotate-12 transition-transform">
              {theme === 'light' ? 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> : 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
              }
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-onyx dark:text-white">Mudar para {theme === 'light' ? 'Noite' : 'Dia'}</span>
          </button>
        </div>
        
        <nav className="flex-1 px-8 space-y-3 mt-4">
          <NavItem icon={<Icons.Star filled={activeTab === 'home'} />} label="Início" active={activeTab === 'home'} onClick={() => onTabChange('home')} />
          <NavItem icon={<Icons.Map />} label="Encontrar no Mapa" active={activeTab === 'map'} onClick={() => onTabChange('map')} />
          <NavItem icon={<Icons.Search />} label="Encontre Profissionais" active={activeTab === 'discover'} onClick={() => onTabChange('discover')} />
          <NavItem icon={<Icons.Calendar />} label="Minha Agenda" active={activeTab === 'bookings'} onClick={() => onTabChange('bookings')} />
          
          <div className="pt-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] px-6 mb-6 text-quartz/60">Business Suite</p>
            {role === UserRole.ADMIN && <NavItem icon={<Icons.Settings />} label="Master Control" active={activeTab === 'admin'} onClick={() => onTabChange('admin')} />}
            {isBusinessUser && <NavItem icon={<Icons.Chart />} label="Console Pro" active={activeTab === 'management'} onClick={() => onTabChange('management')} />}
            <NavItem icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>} label="Central de Apoio" active={activeTab === 'support'} onClick={() => onTabChange('support')} />
            
            {onLogout && (
               <button 
                onClick={onLogout}
                className="w-full flex items-center gap-5 px-8 py-5 mt-4 rounded-[30px] transition-all duration-500 text-quartz hover:bg-ruby/5 hover:text-ruby group"
               >
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                 <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sair</span>
               </button>
            )}
          </div>
        </nav>

        <div className="p-10 border-t border-quartz/10 dark:border-white/5">
           <div 
            onClick={() => onTabChange('profile')}
            className={`bg-offwhite dark:bg-onyx p-5 rounded-[35px] border border-quartz/20 dark:border-white/10 flex items-center gap-5 group cursor-pointer hover:bg-ruby hover:text-white transition-all duration-700 ${activeTab === 'profile' ? 'ring-4 ring-ruby/20 bg-ruby text-white shadow-xl' : ''}`}
           >
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-2xl border-2 border-white transition-transform group-hover:scale-90 group-hover:border-white/50">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black truncate dark:text-white group-hover:text-white">Ana Luanda</p>
                <p className="text-[9px] text-ruby dark:text-gold font-bold uppercase tracking-widest mt-0.5 group-hover:text-white">Membro Ouro</p>
              </div>
           </div>
        </div>
      </aside>

      <header className="md:hidden flex flex-col items-center justify-center p-8 bg-white/95 dark:bg-onyx/98 backdrop-blur-3xl sticky top-0 z-40 border-b border-quartz/10 dark:border-white/5 transition-all gap-6 shadow-sm">
        <button onClick={() => onTabChange('home')} className="active:scale-90 transition-transform">
          <h1 className="text-3xl font-serif font-black text-onyx dark:text-blue-600 tracking-tighter transition-colors duration-500">
            GLOW <span className="font-normal italic">ELITE</span>
          </h1>
          <div className="w-8 h-[2px] bg-ruby/30 mx-auto mt-1 rounded-full"></div>
        </button>
        <div className="flex items-center gap-8">
          <button onClick={toggleTheme} className="p-4 bg-offwhite dark:bg-darkCard rounded-2xl text-ruby border border-quartz/10 dark:border-white/10 shadow-sm active:scale-90 transition-all">
            {theme === 'light' ? 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> : 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
            }
          </button>
          <div onClick={() => onTabChange('profile')} className="w-12 h-12 rounded-full border-2 border-ruby/40 p-0.5 shadow-2xl overflow-hidden transition-all active:scale-90 ring-4 ring-ruby/5">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 md:p-16 animate-fade-in">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] h-22 bg-onyx/95 dark:bg-darkCard/98 backdrop-blur-3xl rounded-[40px] flex items-center justify-around px-2 z-50 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10">
        <NavButton active={activeTab === 'home'} onClick={() => onTabChange('home')} icon={<Icons.Star filled={activeTab === 'home'} />} label="Início" />
        <NavButton active={activeTab === 'discover'} onClick={() => onTabChange('discover')} icon={<Icons.Search />} label="Profissionais" />
        {isBusinessUser ? (
           <button onClick={() => onTabChange('management')} className={`-mt-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${activeTab === 'management' ? 'bg-gold text-onyx ring-4 ring-gold/20' : 'bg-ruby text-white'}`}><Icons.Briefcase /></button>
        ) : (
          <NavButton active={activeTab === 'map'} onClick={() => onTabChange('map')} icon={<Icons.Map />} label="Mapa" />
        )}
        <NavButton active={activeTab === 'bookings'} onClick={() => onTabChange('bookings')} icon={<Icons.Calendar />} label="Agenda" />
        <NavButton active={activeTab === 'profile'} onClick={() => onTabChange('profile')} icon={<Icons.User />} label="Perfil" />
      </nav>
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
