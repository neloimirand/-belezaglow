
import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (role: UserRole, email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    // LOGIN MESTRE ADMINISTRATIVO (ATALHO DE DESENVOLVEDOR/DONO)
    if (email.toLowerCase() === 'neloimik@gmail.com') {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(UserRole.ADMIN, email);
        setIsLoading(false);
      }, 1500);
      return;
    }

    if (!role) {
      // Feedback visual ao invés de apenas alert
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin(role, email);
      setIsLoading(false);
    }, 1200);
  };

  const roleConfigs = {
    [UserRole.CLIENT]: {
      label: 'Membro Elite',
      desc: 'Agendamentos e rituais exclusivos.',
      icon: <Icons.User />,
    },
    [UserRole.PROFESSIONAL]: {
      label: 'Artista Pro',
      desc: 'Gestão para especialistas autônomos.',
      icon: <Icons.Star filled />,
    },
    [UserRole.SALON]: {
      label: 'Maison Glow',
      desc: 'Console completo para centros de estética.',
      icon: <Icons.Home />,
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] flex overflow-hidden bg-onyx">
      {/* VISUAL LATERAL LUXURY */}
      <div className="absolute inset-0 hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000" 
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Luxury Entry"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/90 to-transparent"></div>
      </div>

      {/* PAINEL DE ACESSO */}
      <div className="relative w-full lg:w-[800px] h-full bg-offwhite dark:bg-onyx p-8 md:p-24 flex flex-col justify-center animate-fade-in shadow-2xl overflow-y-auto scrollbar-hide">
        <header className="mb-14">
          <h1 className="text-4xl font-serif font-black text-ruby tracking-tighter">
            BELEZA <span className="font-normal italic text-onyx dark:text-white">GLOW</span>
          </h1>
          <p className="text-[10px] text-quartz uppercase font-black tracking-[0.5em] mt-4 italic">Sistema de Acesso de Prestígio</p>
        </header>

        <div className="space-y-3 mb-12">
          <h2 className="text-5xl font-serif font-black text-onyx dark:text-white leading-tight tracking-tighter">
            Direcionar <br /><span className="italic text-ruby underline decoration-ruby/10">Experiência.</span>
          </h2>
          <p className="text-quartz font-medium text-lg">Selecione sua patente e insira suas credenciais.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* SELETOR DE PATENTE */}
          <div className="space-y-6">
             <p className={`text-[10px] font-black uppercase tracking-widest ml-2 transition-colors ${attemptedSubmit && !role ? 'text-red-500' : 'text-quartz'}`}>
               {attemptedSubmit && !role ? '⚠️ Por favor, selecione uma patente abaixo' : 'Patente de Acesso'}
             </p>
             <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${attemptedSubmit && !role ? 'animate-shake' : ''}`}>
                {(Object.keys(roleConfigs) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setAttemptedSubmit(false); }}
                    className={`relative p-8 rounded-[40px] border-2 transition-all text-left flex flex-col gap-5 group overflow-hidden ${
                      role === r 
                        ? 'border-ruby bg-ruby/5 shadow-2xl scale-105' 
                        : attemptedSubmit && !role 
                          ? 'border-red-500/20 bg-red-500/5' 
                          : 'border-quartz/10 bg-white dark:bg-darkCard hover:border-ruby/30'
                    }`}
                  >
                    {role === r && <div className="absolute top-0 right-0 w-24 h-24 bg-ruby/5 rounded-full -mr-12 -mt-12 animate-pulse"></div>}
                    
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${role === r ? 'bg-ruby text-white shadow-lg shadow-ruby/20' : 'bg-offwhite dark:bg-onyx text-quartz'}`}>
                      {roleConfigs[r].icon}
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest ${role === r ? 'text-ruby' : 'text-onyx dark:text-white'}`}>
                        {roleConfigs[r].label}
                      </p>
                      <p className="text-[8px] font-medium text-quartz mt-1 leading-tight">{roleConfigs[r].desc}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* CREDENCIAIS */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-quartz ml-6">E-mail de Acesso</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@glow.ao" 
                className="w-full bg-white dark:bg-darkCard border border-quartz/20 rounded-[30px] py-6 px-10 outline-none focus:ring-8 focus:ring-ruby/5 dark:text-white font-bold transition-all shadow-sm"
              />
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-[9px] font-black uppercase tracking-widest text-quartz ml-6">Senha Secreta</label>
              <input 
                type={showPass ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white dark:bg-darkCard border border-quartz/20 rounded-[30px] py-6 px-10 outline-none focus:ring-8 focus:ring-ruby/5 dark:text-white font-bold transition-all shadow-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-8 top-[55px] text-quartz hover:text-ruby transition-colors text-[10px] font-black"
              >
                {showPass ? 'OCULTAR' : 'VER'}
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-8 bg-onyx dark:bg-white dark:text-onyx text-white rounded-[40px] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-ruby hover:text-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sincronizando Patente...
                </>
              ) : (
                <>
                  Iniciar Sessão Elite <Icons.ChevronRight />
                </>
              )}
            </button>
            
            <div className="mt-10 flex flex-col items-center gap-4">
               <button type="button" className="text-[9px] font-black uppercase text-quartz tracking-widest hover:text-ruby transition-colors">Esqueceu a sua senha?</button>
               <div className="h-px w-20 bg-quartz/20"></div>
               <p className="text-[10px] font-medium text-stone-500">Novo por aqui? <button type="button" className="text-ruby font-black uppercase ml-2 hover:underline">Solicitar Patente</button></p>
            </div>
          </div>
        </form>

        <footer className="mt-20 pt-10 border-t border-quartz/5 text-center">
           <p className="text-[8px] font-black uppercase text-quartz tracking-[0.5em]">&copy; 2024 BELEZA GLOW MAISON • LUANDA</p>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}} />
    </div>
  );
};

export default Auth;
