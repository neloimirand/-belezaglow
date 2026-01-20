
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icons } from '../constants';
import { UserRole, PlanTier, User } from '../types';
import { supabase, stringifySupabaseError } from '../lib/supabase';

interface AdminDashboardProps {
  onMasquerade: (user: User) => void;
}

type AdminTab = 'members' | 'sms' | 'analytics';
type SMSTarget = 'all' | 'clients' | 'pros' | 'individual';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onMasquerade }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('members');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rawError, setRawError] = useState<string | null>(null);
  
  const [smsTarget, setSmsTarget] = useState<SMSTarget>('all');
  const [selectedIndividualId, setSelectedIndividualId] = useState<string>('');
  const [smsText, setSmsText] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setRawError(null);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (profiles) {
        setUsers(profiles.map(p => ({
          id: p.id,
          email: p.email || 'sem-email@glow.ao',
          name: p.full_name || p.name || 'Usuário Sem Nome',
          role: (p.role?.toUpperCase() || 'CLIENT') as UserRole,
          isVerified: true,
          status: 'active',
          planTier: (p.plan_tier || 'FREE') as PlanTier,
          glowPoints: p.glow_points || 0
        })));
      }
    } catch (err: any) {
      console.error("Admin Sync Error:", err);
      setRawError(stringifySupabaseError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const handleSendSMS = async () => {
    if(!smsText.trim()) return;
    setIsSendingSms(true);
    try {
        let targets = [];
        if (smsTarget === 'all') targets = users;
        else if (smsTarget === 'clients') targets = users.filter(u => u.role === UserRole.CLIENT);
        else if (smsTarget === 'pros') targets = users.filter(u => u.role === UserRole.PROFESSIONAL || u.role === UserRole.SALON);
        else if (smsTarget === 'individual') targets = users.filter(u => u.id === selectedIndividualId);

        if (targets.length === 0) throw new Error("Sem destinatários.");

        const payloads = targets.map(u => ({
            user_id: u.id,
            title: 'Sinal VIP Beleza Glow',
            message: smsText,
            type: 'SMS'
        }));

        const { error } = await supabase.from('notifications').insert(payloads);
        if (error) throw error;

        alert("Sinal disparado com sucesso!");
        setSmsText('');
    } catch (err: any) {
        alert("Falha no disparo: " + stringifySupabaseError(err));
    } finally {
        setIsSendingSms(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return <span className="bg-ruby text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">Mestre</span>;
      case UserRole.SALON: return <span className="bg-gold text-onyx px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">Maison</span>;
      case UserRole.PROFESSIONAL: return <span className="bg-emerald text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">Artista</span>;
      default: return <span className="bg-quartz/20 text-quartz px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest">Membro</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-40 px-4">
      
      <header className="bg-onyx p-10 rounded-[50px] border border-white/10 luxury-shadow flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-black italic text-white leading-none tracking-tighter">Glow <span className="text-gold">Governance.</span></h2>
          <div className="flex items-center gap-3 mt-4">
             <div className={`w-2 h-2 rounded-full ${rawError ? 'bg-red-500 animate-ping' : 'bg-emerald animate-pulse'}`}></div>
             <span className="text-[8px] font-black uppercase tracking-widest text-quartz">
                {rawError ? 'Erro na Infraestrutura' : 'Ecossistema Sincronizado'}
             </span>
             <button onClick={fetchMembers} className="ml-4 p-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
             </button>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
              <p className="text-[7px] font-black uppercase text-quartz mb-1 tracking-widest">Membros Total</p>
              <p className="text-2xl font-serif font-black text-white">{users.length}</p>
           </div>
        </div>
      </header>

      {rawError && (
        <div className="bg-red-500/10 border-2 border-dashed border-red-500/30 p-8 rounded-[40px] text-center">
           <p className="text-red-400 font-bold text-sm italic">Erro Técnico: {rawError}</p>
           <p className="text-stone-500 text-[10px] mt-2 uppercase">Verifique se as tabelas do Supabase foram criadas via SQL Editor.</p>
        </div>
      )}

      <nav className="flex gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-darkCard p-2 rounded-[35px] luxury-shadow border border-quartz/5 sticky top-4 z-[100] backdrop-blur-xl">
        {[
          { id: 'members', label: 'Patentes', icon: <Icons.User /> },
          { id: 'sms', label: 'SMS Hub', icon: <Icons.Message /> },
          { id: 'analytics', label: 'Crescimento', icon: <Icons.Chart /> },
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as AdminTab)} 
            className={`px-8 py-4 rounded-[25px] text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-ruby text-white shadow-lg' : 'text-quartz hover:bg-ruby/5 dark:hover:text-white'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <main className="min-h-[500px]">
        {activeTab === 'members' && (
          <div className="space-y-8 animate-fade-in">
            <div className="relative group max-w-xl">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-quartz"><Icons.Search /></div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Localizar na rede..."
                  className="w-full h-16 bg-white dark:bg-darkCard border border-quartz/10 rounded-[30px] pl-16 pr-8 outline-none focus:border-ruby dark:text-white font-bold transition-all shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[45px]"></div>
                ))
              ) : filteredUsers.map((u) => (
                <div key={u.id} className="bg-white dark:bg-darkCard p-8 rounded-[45px] luxury-shadow border border-quartz/5 group relative overflow-hidden">
                  <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 bg-offwhite dark:bg-onyx rounded-[22px] flex items-center justify-center font-serif font-black text-2xl text-ruby border border-quartz/10">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-serif font-black text-lg italic dark:text-white truncate">{u.name}</h4>
                        <p className="text-[9px] text-stone-500 font-bold truncate uppercase tracking-tighter">{u.email}</p>
                      </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-8">
                      {getRoleBadge(u.role)}
                      <span className="bg-offwhite dark:bg-onyx text-quartz px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border border-quartz/10">PTS: {u.glowPoints}</span>
                  </div>
                  <button 
                    onClick={() => onMasquerade(u)}
                    className="w-full py-4 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-lg hover:bg-ruby hover:text-white transition-all active:scale-95"
                  >
                    Entrar no Perfil
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sms' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-darkCard p-12 rounded-[50px] border border-quartz/10 luxury-shadow space-y-10 text-center">
                <h3 className="text-3xl font-serif font-black italic dark:text-white tracking-tighter leading-none">Transmitir <br /><span className="text-ruby">Sinal VIP.</span></h3>
                
                <div className="flex bg-offwhite dark:bg-onyx p-1.5 rounded-[25px] border border-quartz/10">
                  {['all', 'clients', 'pros', 'individual'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSmsTarget(opt as SMSTarget)}
                      className={`flex-1 py-3 rounded-[20px] text-[8px] font-black uppercase tracking-widest transition-all ${smsTarget === opt ? 'bg-ruby text-white shadow-lg' : 'text-quartz'}`}
                    >
                      {opt === 'all' ? 'Todos' : opt === 'clients' ? 'Clientes' : opt === 'pros' ? 'Talentos' : 'Membro'}
                    </button>
                  ))}
                </div>

                {smsTarget === 'individual' && (
                  <select 
                    value={selectedIndividualId} 
                    onChange={(e) => setSelectedIndividualId(e.target.value)}
                    className="w-full bg-offwhite dark:bg-onyx p-5 rounded-2xl border border-quartz/10 dark:text-white font-bold outline-none"
                  >
                    <option value="">Escolher Destinatário...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                )}

                <textarea 
                  value={smsText} 
                  onChange={(e) => setSmsText(e.target.value)} 
                  placeholder="Mensagem estratégica..." 
                  className="w-full h-48 bg-offwhite dark:bg-onyx p-8 rounded-[35px] border border-quartz/10 dark:text-white font-medium resize-none outline-none focus:border-ruby transition-all" 
                />

                <button 
                  onClick={handleSendSMS} 
                  disabled={isSendingSms || !smsText.trim()}
                  className="w-full py-6 bg-ruby text-white rounded-[30px] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                >
                  {isSendingSms ? 'Enviando...' : 'Disparar para Rede'}
                </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
