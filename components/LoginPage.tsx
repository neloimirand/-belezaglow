
import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole, email: string, name?: string, phone?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role && !isRegistering && email.toLowerCase() !== 'neloimik@gmail.com') {
      setError('Por favor, selecione sua patente para prosseguir.');
      return;
    }

    // VALIDAÇÃO MESTRE ADMINISTRATIVO
    if (email.toLowerCase() === 'neloimik@gmail.com') {
      if (password !== 'Anamanuel1') {
        setError('Credencial de Administrador Inválida.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        onLogin(UserRole.ADMIN, email);
        setIsLoading(false);
      }, 1500);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin(role || UserRole.CLIENT, email, fullName, phone);
      setIsLoading(false);
    }, 1200);
  };

  const roleOptions = [
    { id: UserRole.CLIENT, label: 'Membro Elite', icon: <Icons.User />, desc: 'Agendamentos VIP' },
    { id: UserRole.PROFESSIONAL, label: 'Artista Pro', icon: <Icons.Star filled />, desc: 'Gestão de Carreira' },
    { id: UserRole.SALON, label: 'Glow Maison', icon: <Icons.Home />, desc: 'Console de Negócio' }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-onyx overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522337360788-8b13df772ec2?q=80&w=2000" 
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Luxury Ambience"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-onyx via-onyx/80 to-transparent"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ruby/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in py-10 overflow-y-auto max-h-screen scrollbar-hide">
        
        <div className="hidden lg:flex lg:col-span-5 flex-col space-y-10 pr-10">
           <header className="space-y-8">
             {/* NOVO LOGOTIPO ESTRUTURADO (CSS LUXURY) */}
             <div className="relative w-32 h-32 group">
                <div className="absolute inset-0 bg-gradient-to-br from-gold via-ruby to-onyx rounded-[40px] rotate-6 group-hover:rotate-12 transition-transform duration-700 blur-sm opacity-50"></div>
                <div className="relative w-full h-full bg-onyx rounded-[35px] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-ruby/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <span className="text-5xl font-serif font-black italic text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">BG</span>
                </div>
             </div>

             <div>
               <h1 className="text-6xl font-serif font-black text-white leading-none tracking-tighter italic">
                 Beleza <span className="text-ruby">Glow.</span>
               </h1>
               <p className="text-gold text-[10px] font-black uppercase tracking-[0.6em] mt-4 ml-1">Angola Private Network</p>
             </div>
           </header>
           
           <div className="space-y-6">
              <h2 className="text-6xl font-serif font-bold text-white leading-tight tracking-tighter">
                {isRegistering ? 'Crie o seu legado de' : 'Onde o luxo encontra a'} <br />
                <span className="italic underline decoration-ruby/20">
                  {isRegistering ? 'beleza e arte.' : 'tecnologia elite.'}
                </span>
              </h2>
           </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-white/10 backdrop-blur-3xl p-8 md:p-12 lg:p-16 rounded-[60px] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30"></div>
              
              <div className="lg:hidden flex flex-col items-center mb-8 gap-4">
                 <div className="w-20 h-20 bg-onyx rounded-[25px] flex items-center justify-center font-serif font-black italic text-3xl text-gold border border-white/10 shadow-xl">BG</div>
                 <h1 className="text-3xl font-serif font-black text-white italic">Beleza <span className="text-ruby">Glow.</span></h1>
              </div>

              <div className="space-y-2 text-center lg:text-left">
                <h3 className="text-3xl md:text-5xl font-serif font-black text-white italic tracking-tight leading-none">
                  {isRegistering ? 'Nova Patente' : 'Iniciar Sessão'} <span className="text-ruby">Elite.</span>
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   {roleOptions.map((opt) => (
                     <button
                       key={opt.id}
                       type="button"
                       onClick={() => setRole(opt.id)}
                       className={`p-5 rounded-[30px] border-2 flex flex-col items-center text-center gap-3 transition-all duration-500 group ${
                         role === opt.id ? 'border-gold bg-gold/5 shadow-xl scale-105' : 'border-white/5 bg-white/5 hover:border-ruby/20'
                       }`}
                     >
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${role === opt.id ? 'bg-gold text-onyx' : 'bg-white/5 text-quartz'}`}>
                          {opt.icon}
                       </div>
                       <p className={`text-[9px] font-black uppercase tracking-widest ${role === opt.id ? 'text-gold' : 'text-white'}`}>{opt.label}</p>
                     </button>
                   ))}
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center animate-shake">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {isRegistering && (
                     <>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome Completo..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-5 px-8 outline-none text-white font-medium focus:ring-4 focus:ring-ruby/20 transition-all md:col-span-2 shadow-inner" />
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telemóvel (+244)..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-5 px-8 outline-none text-white font-medium focus:ring-4 focus:ring-ruby/20 transition-all md:col-span-2 shadow-inner" />
                     </>
                   )}
                   <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail de acesso..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-5 px-8 outline-none text-white font-medium focus:ring-4 focus:ring-ruby/20 transition-all md:col-span-2 shadow-inner" />
                   <div className="relative md:col-span-2">
                      <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha de segurança..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-5 px-8 outline-none text-white font-medium focus:ring-4 focus:ring-ruby/20 transition-all shadow-inner" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-8 top-1/2 -translate-y-1/2 text-stone-700 hover:text-white text-[8px] font-black uppercase">{showPass ? 'Ocultar' : 'Ver'}</button>
                   </div>
                </div>

                <div className="pt-2 flex flex-col gap-6">
                   <button type="submit" disabled={isLoading} className="w-full py-7 bg-ruby text-white rounded-[35px] font-black uppercase tracking-[0.5em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 border border-white/10">
                     {isLoading ? 'Autenticando na Rede...' : isRegistering ? 'Solicitar Registro Elite' : 'Sincronizar Acesso'}
                   </button>
                   <div className="flex justify-center">
                      <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="text-[9px] font-black uppercase text-white tracking-[0.2em] hover:text-gold underline decoration-gold/20 transition-all">
                        {isRegistering ? 'Já possui patente? Entrar' : 'Novo na rede? Criar Cadastro'}
                      </button>
                   </div>
                </div>
              </form>
           </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default LoginPage;
