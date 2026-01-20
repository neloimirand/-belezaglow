
import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';
import { supabase, stringifySupabaseError } from '../lib/supabase';

interface LoginPageProps {
  onLogin: (role: UserRole, email: string, name?: string, phone?: string, id?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isRegistering) {
        if (!role) throw new Error("Selecione sua patente para prosseguir.");
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: { data: { full_name: fullName, role: role } }
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              full_name: fullName,
              email: cleanEmail,
              phone: phone,
              role: role,
              glow_points: 1000
            });

          if (profileError) console.warn("Sync Error:", profileError.message);
          
          if (!authData.session) {
            setError("Confirme seu e-mail para ativar sua patente elite.");
            setIsLoading(false);
            return;
          }
          onLogin(role, cleanEmail, fullName, phone, authData.user.id);
        }
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (authError) throw authError;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user?.id)
          .single();

        const finalRole = profile?.role || authData.user?.user_metadata?.role || UserRole.CLIENT;
        onLogin(finalRole, cleanEmail, profile?.full_name, profile?.phone, authData.user?.id);
      }
    } catch (err: any) {
      setError(stringifySupabaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-onyx overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000" className="w-full h-full object-cover opacity-20 grayscale" alt="Luxury Interior" />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-onyx/90 to-onyx"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="bg-white/10 backdrop-blur-3xl p-10 md:p-14 rounded-[60px] border border-white/10 shadow-2xl space-y-12">
          
          <header className="text-center space-y-6">
             <div className="w-24 h-24 bg-onyx rounded-[35px] flex items-center justify-center font-serif font-black italic text-4xl text-gold mx-auto border border-white/10 shadow-2xl scale-110">BG</div>
             <div className="space-y-2">
                <h2 className="text-4xl font-serif font-black text-white italic tracking-tighter leading-none">{isRegistering ? 'Criar Patente' : 'Entrar na Maison'}</h2>
                <p className="text-quartz text-[10px] font-black uppercase tracking-[0.5em]">Beleza Glow Angola</p>
             </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {isRegistering && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: UserRole.CLIENT, label: 'Membro', icon: <Icons.User /> },
                  { id: UserRole.PROFESSIONAL, label: 'Artista', icon: <Icons.Star filled /> },
                  { id: UserRole.SALON, label: 'Maison', icon: <Icons.Home /> }
                ].map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setRole(opt.id)} className={`p-6 rounded-[30px] border-2 flex flex-col items-center gap-3 transition-all active:scale-95 ${role === opt.id ? 'border-gold bg-gold/10 scale-105 shadow-2xl' : 'border-white/5 opacity-40'}`}>
                    <div className={role === opt.id ? 'text-gold' : 'text-quartz'}>{opt.icon}</div>
                    <p className="text-[8px] font-black uppercase text-white tracking-widest">{opt.label}</p>
                  </button>
                ))}
              </div>
            )}

            {error && <div className="p-5 rounded-3xl text-[10px] font-black text-center bg-red-500/20 border border-red-500/30 text-red-400 animate-pulse uppercase tracking-widest">{error}</div>}

            <div className="space-y-4">
              {isRegistering && (
                <>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome Completo" className="w-full bg-white border-2 border-transparent rounded-full py-5 px-10 outline-none text-onyx text-center text-sm font-bold focus:border-ruby shadow-xl transition-all" />
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nº Telemóvel" className="w-full bg-white border-2 border-transparent rounded-full py-5 px-10 outline-none text-onyx text-center text-sm font-bold focus:border-ruby shadow-xl transition-all" />
                </>
              )}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail de Prestígio" className="w-full bg-white border-2 border-transparent rounded-full py-5 px-10 outline-none text-onyx text-center text-sm font-bold focus:border-ruby shadow-xl transition-all" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha Secreta" className="w-full bg-white border-2 border-transparent rounded-full py-5 px-10 outline-none text-onyx text-center text-sm font-bold focus:border-ruby shadow-xl transition-all" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-7 bg-ruby text-white rounded-full font-black uppercase tracking-[0.5em] text-[12px] shadow-[0_25px_60px_rgba(157,23,77,0.5)] active:scale-95 transition-all disabled:opacity-50 hover:brightness-110 border border-white/10">
              {isLoading ? 'Sincronizando...' : isRegistering ? 'Ativar Minha Patente' : 'Iniciar Experiência Elite'}
            </button>

            <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="w-full text-[10px] font-black uppercase text-quartz tracking-[0.4em] hover:text-white transition-colors py-4 active:scale-95 text-center">
              {isRegistering ? 'Já possuo uma patente' : 'Novo na Maison? Solicitar Acesso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
