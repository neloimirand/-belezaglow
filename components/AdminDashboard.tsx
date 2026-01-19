
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { UserRole, PlanTier, User } from '../types';

interface AdminDashboardProps {
  onMasquerade: (user: User) => void;
}

type AdminTab = 'members' | 'brand' | 'sms' | 'plans' | 'bank' | 'payments';
type SMSTarget = 'all' | 'pros' | 'salons' | 'individual';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onMasquerade }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('members');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // --- PERSISTÊNCIA DE DADOS LIMPA PARA PRODUÇÃO ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('glow_admin_users');
    return saved ? JSON.parse(saved) : []; // Iniciamos sem contas falsas
  });

  const [paymentRequests, setPaymentRequests] = useState([]); // Limpo para produção

  useEffect(() => {
    localStorage.setItem('glow_admin_users', JSON.stringify(users));
  }, [users]);

  // --- ESTADOS DO SMS HUB ---
  const [smsTarget, setSmsTarget] = useState<SMSTarget>('all');
  const [selectedUserForSMS, setSelectedUserForSMS] = useState<string>('');
  const [smsText, setSmsText] = useState('');

  // --- CONTROLE DE MODAIS ---
  const [modalType, setModalType] = useState<'plan_edit' | 'proof_view' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleApprovePayment = (id: string) => {
    setPaymentRequests(prev => prev.filter((r: any) => r.id !== id));
    alert("Capital Validado. O plano do usuário foi ativado no ecossistema.");
    setModalType(null);
  };

  const handleSendSMS = () => {
    if(!smsText.trim()) return alert("Digite a mensagem de transmissão.");
    if(smsTarget === 'individual' && !selectedUserForSMS) return alert("Selecione um membro para o envio individual.");
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSmsText('');
      const targetName = smsTarget === 'individual' 
        ? users.find(u => u.id === selectedUserForSMS)?.name 
        : smsTarget.toUpperCase();
      alert(`Sinal SMS transmitido com sucesso para: ${targetName}`);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-40 px-4 md:px-0">
      
      <header className="bg-onyx p-10 rounded-[50px] border border-white/10 luxury-shadow relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="w-16 h-16 bg-ruby mx-auto rounded-2xl flex items-center justify-center shadow-2xl mb-4 text-white">
          <Icons.Settings />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-black italic text-white">Glow <span className="text-gold">Governance.</span></h2>
        <p className="text-[9px] font-black uppercase text-quartz tracking-[0.5em] mt-3">Painel de Controle Central Angola</p>
      </header>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="flex gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-darkCard p-2 rounded-[35px] luxury-shadow border border-quartz/5 sticky top-4 z-[100] backdrop-blur-xl">
        {[
          { id: 'members', label: 'Membros', icon: <Icons.User /> },
          { id: 'payments', label: 'Cofre', icon: <Icons.Dollar /> },
          { id: 'sms', label: 'SMS Hub', icon: <Icons.Message /> },
          { id: 'plans', label: 'Planos', icon: <Icons.Award /> },
          { id: 'bank', label: 'Canais', icon: <Icons.Home /> },
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as AdminTab)} 
            className={`px-8 py-4 rounded-[25px] text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-ruby text-white shadow-lg scale-105' : 'text-quartz hover:bg-ruby/5 dark:hover:text-white'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <main className="bg-white dark:bg-darkCard rounded-[50px] border border-quartz/10 luxury-shadow min-h-[600px] overflow-hidden">
        
        {/* ABA MEMBROS */}
        {activeTab === 'members' && (
          <div className="p-8 space-y-6">
            <h3 className="text-2xl font-serif font-black dark:text-white italic px-4">Gestão de <span className="text-ruby">Patentes.</span></h3>
            
            {users.length === 0 ? (
              <div className="py-32 text-center opacity-30 italic font-serif text-2xl">Aguardando novos membros reais...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.map(u => (
                  <div key={u.id} className="bg-offwhite dark:bg-onyx p-8 rounded-[40px] border border-quartz/10 flex items-center justify-between group hover:border-ruby/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-ruby/10 text-ruby rounded-2xl flex items-center justify-center font-serif font-black text-2xl">{u.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-serif font-black dark:text-white text-xl italic">{u.name}</h4>
                        <p className="text-[9px] font-black text-quartz uppercase tracking-widest mt-1">{u.role} • <span className="text-ruby">{u.planTier}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onMasquerade(u)} className="p-4 bg-white dark:bg-darkCard rounded-xl text-quartz hover:text-ruby shadow-sm"><Icons.User /></button>
                      <button onClick={() => { setSelectedItem(u); setModalType('plan_edit'); }} className="p-4 bg-white dark:bg-darkCard rounded-xl text-quartz hover:text-gold shadow-sm"><Icons.Award /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA SMS HUB */}
        {activeTab === 'sms' && (
          <div className="p-10 md:p-20 max-w-3xl mx-auto space-y-12 text-center animate-fade-in">
            <div className="space-y-3">
              <h3 className="text-4xl font-serif font-black italic dark:text-white">Glow <span className="text-ruby">SMS Hub.</span></h3>
              <p className="text-[10px] font-black uppercase text-quartz tracking-[0.4em]">Transmissão Estratégica em Tempo Real</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: 'all', label: 'Global: Todos' },
                { id: 'pros', label: 'Profissionais' },
                { id: 'salons', label: 'Salões' },
                { id: 'individual', label: 'Individual...' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSmsTarget(t.id as SMSTarget)} 
                  className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${smsTarget === t.id ? 'bg-ruby text-white shadow-xl scale-105' : 'bg-offwhite dark:bg-onyx text-quartz border border-quartz/10'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {smsTarget === 'individual' && users.length > 0 && (
              <div className="animate-fade-in scale-up">
                <select 
                  value={selectedUserForSMS}
                  onChange={(e) => setSelectedUserForSMS(e.target.value)}
                  className="w-full h-16 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-3xl px-8 outline-none dark:text-white font-bold text-sm shadow-inner appearance-none focus:border-ruby transition-all"
                >
                  <option value="">Selecionar Destinatário na Rede...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
            )}

            <textarea 
              value={smsText} 
              onChange={(e) => setSmsText(e.target.value)} 
              placeholder="Digite a ordem estratégica ou comunicado VIP..." 
              className="w-full h-56 bg-offwhite dark:bg-onyx p-10 rounded-[50px] border border-quartz/10 dark:text-white font-medium resize-none shadow-inner outline-none focus:border-ruby transition-all text-lg" 
            />
            
            <button 
              onClick={handleSendSMS} 
              disabled={isGenerating} 
              className="w-full py-8 bg-ruby text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl active:scale-95 transition-all border border-white/10"
            >
              {isGenerating ? 'Sincronizando Rede...' : 'Transmitir via SMS'}
            </button>
          </div>
        )}

        {/* ABA COFRE (PAGAMENTOS) */}
        {activeTab === 'payments' && (
          <div className="p-8 md:p-12 space-y-10">
            <h3 className="text-3xl font-serif font-black dark:text-white italic px-4">Auditoria do <span className="text-emerald">Cofre.</span></h3>
            <div className="space-y-6">
              {paymentRequests.length === 0 ? (
                <div className="py-32 text-center opacity-30 italic font-serif text-2xl">Cofre em conformidade. Nenhuma pendência real.</div>
              ) : (
                paymentRequests.map((p: any) => (
                  <div key={p.id} className="bg-offwhite dark:bg-onyx p-10 rounded-[50px] border border-quartz/10 flex flex-col md:flex-row items-center gap-10 animate-fade-in shadow-sm">
                    <div 
                      className="w-32 h-44 bg-black rounded-[30px] overflow-hidden border-4 border-white/5 shadow-2xl cursor-pointer group relative shrink-0"
                      onClick={() => { setSelectedItem(p); setModalType('proof_view'); }}
                    >
                      <img src={p.proof} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-onyx/40">
                         <Icons.Search />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                       <p className="text-[10px] font-black text-ruby uppercase tracking-[0.3em]">Solicitação de Ativação</p>
                       <h4 className="text-3xl font-serif font-black dark:text-white italic">{p.userName}</h4>
                       <p className="text-emerald font-black text-xl">{p.amount} • <span className="text-quartz text-xs uppercase font-bold">{p.plan}</span></p>
                       <p className="text-stone-500 font-medium text-[10px] uppercase tracking-widest">{p.date}</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                       <button onClick={() => handleApprovePayment(p.id)} className="px-10 py-5 bg-emerald text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all">Aprovar Crédito</button>
                       <button onClick={() => setPaymentRequests(prev => prev.filter((req: any) => req.id !== p.id))} className="px-10 py-5 bg-white dark:bg-darkCard text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Rejeitar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
