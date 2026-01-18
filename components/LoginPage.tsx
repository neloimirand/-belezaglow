
import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

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

    // SANITIZAÇÃO AGRESSIVA: Remove todos os espaços e converte para minúsculas
    const cleanEmail = email.replace(/\s/g, '').toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    try {
      if (isRegistering) {
        if (!role) throw new Error("Selecione sua patente de acesso.");
        if (password.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres.");

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: { 
                full_name: cleanName || 'Membro Elite', 
                phone: cleanPhone, 
                role: role,
                glow_points: 1000 
            }
          }
        });

        if (authError) {
          if (authError.message.toLowerCase().includes("invalid")) {
            throw new Error("O formato do e-mail é inválido para o sistema. Verifique espaços ou domínios bloqueados no Dashboard.");
          }
          if (authError.message.includes("Database error")) {
            throw new Error("Erro de Gatilho: Verifique o SQL do Trigger no Supabase.");
          }
          throw authError;
        }

        if (authData.user) {
          if (!authData.session) {
            setError("Verifique seu e-mail para validar sua patente antes de entrar.");
            setIsLoading(false);
            return;
          }
          onLogin(role, cleanEmail, cleanName, cleanPhone, authData.user.id);
        }
        
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (authError) {
          if (authError.message.toLowerCase().includes("invalid")) {
            throw new Error("E-mail ou formato inválido detectado pelo servidor.");
          }
          throw authError;
        }

        // Recuperar perfil real do banco público
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user?.id)
          .single();

        const meta = authData.user?.user_metadata;
        const finalRole = profile?.role || meta?.role || UserRole.CLIENT;
        const finalName = profile?.full_name || meta?.full_name || "Membro Elite";

        onLogin(finalRole, cleanEmail, finalName, profile?.phone || meta?.phone, authData.user?.id);
      }
    } catch (err: any) {
      console.error("Auth System Log:", err);
      let msg = err.message;
      if (msg.includes("Invalid login credentials")) msg = "Credenciais inválidas no radar.";
      if (msg.includes("User already registered")) msg = "Este e-mail já possui uma patente ativa.";
      setError(msg || 'Erro na rede de elite.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-onyx overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2000" className="w-full h-full object-cover opacity-20 grayscale" alt="Luxury" />
        <div className="absolute inset-0 bg-gradient-to-tr from-onyx via-onyx/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 animate-fade-in py-10 overflow-y-auto max-h-screen scrollbar-hide">
        <div className="bg-white/10 backdrop-blur-3xl p-8 md:p-14 rounded-[60px] border border-white/10 shadow-2xl space-y-8">
          <div className="text-center space-y-3">
             <div className="w-20 h-20 bg-onyx rounded-[28px] flex items-center justify-center font-serif font-black italic text-3xl text-gold mx-auto border border-white/10">BG</div>
             <h2 className="text-3xl font-serif font-black text-white italic">{isRegistering ? 'Nova Patente' : 'Acesso Elite'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: UserRole.CLIENT, label: 'Elite', icon: <Icons.User /> },
                  { id: UserRole.PROFESSIONAL, label: 'Pro', icon: <Icons.Star filled /> },
                  { id: UserRole.SALON, label: 'Maison', icon: <Icons.Home /> }
                ].map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setRole(opt.id)} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${role === opt.id ? 'border-gold bg-gold/10 scale-105' : 'border-white/5 bg-white/5'}`}>
                    <div className={role === opt.id ? 'text-gold' : 'text-quartz'}>{opt.icon}</div>
                    <p className="text-[7px] font-black uppercase text-white">{opt.label}</p>
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className={`p-4 rounded-2xl text-[10px] font-bold text-center border leading-tight ${error.includes("Verifique") || error.includes("Patente") ? "bg-emerald/10 border-emerald/20 text-emerald" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                {error}
              </div>
            )}

            <div className="space-y-3">
              {isRegistering && (
                <>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome Completo..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-4 px-6 outline-none text-white text-xs font-bold focus:ring-4 focus:ring-ruby/10 transition-all" />
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telemóvel..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-4 px-6 outline-none text-white text-xs font-bold focus:ring-4 focus:ring-ruby/10 transition-all" />
                </>
              )}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail de acesso..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-4 px-6 outline-none text-white text-xs font-bold focus:ring-4 focus:ring-ruby/10 transition-all" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha secreta..." className="w-full bg-white/5 border border-white/10 rounded-[25px] py-4 px-6 outline-none text-white text-xs font-bold focus:ring-4 focus:ring-ruby/10 transition-all" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-6 bg-ruby text-white rounded-[30px] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-50 border border-white/10">
              {isLoading ? 'Sincronizando...' : isRegistering ? 'Criar Acesso' : 'Entrar no Radar'}
            </button>

            <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="w-full text-[9px] font-black uppercase text-quartz tracking-widest hover:text-white transition-colors">
              {isRegistering ? 'Já possuo acesso' : 'Novo na rede? Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
