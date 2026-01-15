
import React, { useState } from 'react';
import { Icons, COLORS } from '../constants';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (role: UserRole, email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais de Administrador Mestre (Acesso Direto)
    if (email === 'neloimik@gmail.com' && password === 'Anamanuel1.') {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(UserRole.ADMIN, email);
        setIsLoading(false);
      }, 1500);
      return;
    }

    // Validação de Perfil Manual Obrigatório
    if (!role) {
      alert("Por favor, selecione seu perfil (Cliente, Profissional ou Salão) para continuar.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin(role, email);
      setIsLoading(false);
    }, 1500);
  };

  const handleRoleToggle = (r: UserRole) => {
    // Permite selecionar e desselecionar clicando novamente
    setRole(prevRole => prevRole === r ? null : r);
  };

  const roleConfigs = {
    [UserRole.CLIENT]: {
      label: 'Cliente',
      desc: 'Para quem busca beleza de elite.',
      icon: <Icons.User />
    },
    [UserRole.PROFESSIONAL]: {
      label: 'Profissional',
      desc: 'Gestão para artistas autônomos.',
      icon: <Icons.Star filled={role === UserRole.PROFESSIONAL} />
    },
    [UserRole.SALON]: {
      label: 'Salão',
      desc: 'Soluções para grandes estabelecimentos.',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17"/></svg>
    }
  };

  const isFormValid = email.length > 0 && password.length > 0 && (role !== null || email === 'neloimik@gmail.com');

  return (
    <div className="fixed inset-0 z-[200] flex overflow-hidden bg-onyx">
      {/* Background Cinematográfico */}
      <div className="absolute inset-0 hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30 grayscale"
          alt="Beauty Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/90 to-transparent"></div>
      </div>

      <div className="relative w-full lg:w-[700px] h-full bg-offwhite p-8 md:p-20 flex flex-col justify-center animate-fade-in shadow-2xl overflow-y-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-black text-ruby tracking-tighter">
            BELEZA <span className="font-normal italic text-onyx">GLOW</span>
          </h1>
          <p className="text-[10px] text-quartz uppercase font-black tracking-[0.5em] mt-3">Elite Beauty Ecosystem</p>
        </div>

        <div className="space-y-3 mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-onyx">
            {isLogin ? 'Bem-vinda ao Luxo' : 'Seu Império Começa Aqui'}
          </h2>
          <p className="text-quartz font-medium text-lg">
            {email === 'neloimik@gmail.com' ? 'Acesso Administrativo Mestre detectado.' : 'Selecione seu perfil abaixo para continuar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Seleção de Perfil Manual */}
          {email !== 'neloimik@gmail.com' && (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-ruby ml-4">Quem é você no ecossistema?</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(roleConfigs) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleToggle(r)}
                    className={`relative p-6 rounded-[35px] border-2 transition-all text-left flex flex-col gap-4 group ${
                      role === r 
                        ? 'border-ruby bg-ruby/5 shadow-xl scale-105' 
                        : 'border-quartz/10 bg-white hover:border-ruby/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${role === r ? 'bg-ruby text-white' : 'bg-offwhite text-quartz group-hover:text-ruby'}`}>
                      {roleConfigs[r].icon}
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest ${role === r ? 'text-ruby' : 'text-onyx'}`}>
                        {roleConfigs[r].label}
                      </p>
                    </div>
                    {/* Indicador de Seleção */}
                    {role === r && (
                      <div className="absolute top-4 right-4 text-ruby animate-bounce">
                        <Icons.Star filled />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {!role && !isLoading && (
                <p className="text-[9px] text-quartz italic text-center animate-pulse">Toque em um perfil para selecionar.</p>
              )}
            </div>
          )}

          {/* Campos de Login */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-quartz ml-6">E-mail de Acesso</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@glow.ao" 
                className="w-full bg-white border border-quartz/20 rounded-[25px] py-6 px-10 outline-none focus:ring-8 focus:ring-ruby/5 transition-all text-sm text-onyx shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-quartz ml-6">Senha Secreta</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white border border-quartz/20 rounded-[25px] py-6 px-10 outline-none focus:ring-8 focus:ring-ruby/5 transition-all text-sm text-onyx shadow-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full py-7 rounded-[30px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all flex items-center justify-center gap-4 ${
              isFormValid 
                ? 'bg-onyx text-white hover:scale-[1.02] active:scale-95' 
                : 'bg-quartz/20 text-quartz cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Entrar no Ecossistema'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
