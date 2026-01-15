
import React, { useState, useMemo } from 'react';
import { Icons, COLORS } from '../constants';
import { UserRole, PlanTier, User, Plan } from '../types';

interface AdminDashboardProps {
  onMasquerade: (user: any) => void;
}

interface PaymentProofRequest {
  id: string;
  userName: string;
  userId: string;
  planName: string;
  amount: number;
  date: string;
  proofUrl: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onMasquerade }) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'finance' | 'marketing' | 'plans' | 'users'>('radar');
  const [selectedProof, setSelectedProof] = useState<PaymentProofRequest | null>(null);
  
  // States para Mensageria
  const [msgTarget, setMsgTarget] = useState<'ALL' | 'PROFESSIONAL' | 'CLIENT' | 'INDIVIDUAL'>('ALL');
  const [msgContent, setMsgContent] = useState('');

  // States para Gestão de Usuários
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'Ana Luanda', email: 'ana@glow.ao', role: UserRole.CLIENT, planTier: 'GOLD', isVerified: true, status: 'active' },
    { id: 'u2', name: 'Marco Aurélio', email: 'marco@glow.ao', role: UserRole.PROFESSIONAL, planTier: 'SILVER', isVerified: true, status: 'active' },
    { id: 'u3', name: 'Maison de l’Ongle', email: 'contato@maison.ao', role: UserRole.SALON, planTier: 'DIAMOND', isVerified: true, status: 'active' },
    { id: 'u4', name: 'Pérola VIP', email: 'perola@glow.ao', role: UserRole.CLIENT, planTier: 'FREE', isVerified: false, status: 'active' },
  ]);

  // States para Gestão de Planos
  const [plans, setPlans] = useState<Plan[]>([
    { id: '1', name: 'Silver Glow', price: 1500, benefits: ['Destaque no Radar', 'Gestão de 5 Serviços'], target: 'PROFESSIONAL' },
    { id: '2', name: 'Gold Elite', price: 2500, benefits: ['IA de Marketing', 'Selo Verificado Ouro', 'Prioridade no Suporte'], target: 'PROFESSIONAL' },
    { id: '3', name: 'Diamond Pro', price: 25000, benefits: ['Tudo Ilimitado', 'Taxa Zero de Agendamento', 'Consultoria VIP'], target: 'SALON' }
  ]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan>>({});
  const [newBenefit, setNewBenefit] = useState('');

  const [paymentRequests, setPaymentRequests] = useState<PaymentProofRequest[]>([
    { id: 'TRX_001', userName: 'Marco Aurélio', userId: 'u2', planName: 'SILVER', amount: 1500, date: '24/05/2024', proofUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800', status: 'PENDING' },
    { id: 'TRX_002', userName: 'Maison de l’Ongle', userId: 'u3', planName: 'DIAMOND', amount: 25000, date: '25/05/2024', proofUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800', status: 'PENDING' }
  ]);

  const handleUpdateUserRole = (id: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleUpdateUserPlan = (id: string, newPlan: any) => {
    setUsers(users.map(u => u.id === id ? { ...u, planTier: newPlan } : u));
  };

  const handleProcessPayment = (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    setPaymentRequests(prev => prev.filter(r => r.id !== id));
    setSelectedProof(null);
    const msg = status === 'CONFIRMED' ? "Pagamento Validado" : "Pagamento Rejeitado";
    alert(`${msg}: A conta do usuário será atualizada automaticamente.`);
  };

  const handleSendMessage = () => {
    alert(`Mensagem disparada com sucesso para: ${msgTarget} via Glow Messenger.`);
    setMsgContent('');
  };

  const handleSavePlan = () => {
    if (!editingPlan.name || !editingPlan.price) return alert("Nome e Preço são obrigatórios.");
    if (editingPlan.id) {
      setPlans(plans.map(p => p.id === editingPlan.id ? (editingPlan as Plan) : p));
    } else {
      setPlans([...plans, { ...editingPlan, id: Date.now().toString(), benefits: editingPlan.benefits || [] } as Plan]);
    }
    setIsPlanModalOpen(false);
    setEditingPlan({});
  };

  const addBenefit = () => {
    if (!newBenefit) return;
    const currentBenefits = editingPlan.benefits || [];
    setEditingPlan({ ...editingPlan, benefits: [...currentBenefits, newBenefit] });
    setNewBenefit('');
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = editingPlan.benefits || [];
    setEditingPlan({ ...editingPlan, benefits: currentBenefits.filter((_, i) => i !== index) });
  };

  const tabs = [
    { id: 'radar', label: 'Radar', icon: <Icons.Chart /> },
    { id: 'finance', label: 'Tesouraria', icon: <Icons.Dollar /> },
    { id: 'users', label: 'Usuários', icon: <Icons.User /> },
    { id: 'marketing', label: 'Glow Hub (SMS)', icon: <Icons.Message /> },
    { id: 'plans', label: 'Gestão de Planos', icon: <Icons.Star filled /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-fade-in pb-32 px-4 md:px-0">
      
      <header className="bg-white dark:bg-darkCard p-10 md:p-14 rounded-[40px] md:rounded-[60px] luxury-shadow border border-quartz/10 flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-ruby rounded-[30px] flex items-center justify-center text-white shadow-2xl transform -rotate-3 transition-transform hover:rotate-0">
            <Icons.Settings />
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-onyx dark:text-white leading-none">
              Glow <span className="italic font-normal text-gold underline decoration-gold/20">Governance.</span>
            </h2>
            <p className="text-[10px] font-black uppercase text-quartz tracking-[0.4em] mt-2">Central de Controle Mestre</p>
          </div>
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-darkCard p-2 rounded-[30px] luxury-shadow border border-quartz/5 sticky top-4 z-50">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-4 whitespace-nowrap active:scale-95 ${
              activeTab === tab.id ? 'bg-ruby text-white shadow-xl scale-105' : 'text-quartz hover:bg-ruby/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {/* TAB RADAR - KPIs */}
        {activeTab === 'radar' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
              <StatCardSmall label="Membros Ativos" value={users.length.toString()} color="text-onyx dark:text-white" />
              <StatCardSmall label="Receita Plataforma" value="8.4M Kz" color="text-emerald" />
              <StatCardSmall label="Faturas Mensais" value={paymentRequests.length.toString()} color="text-ruby" />
           </div>
        )}

        {/* TAB USUÁRIOS - GESTÃO DE IDENTIDADES */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-darkCard rounded-[50px] luxury-shadow border border-quartz/10 overflow-hidden animate-fade-in">
             <div className="p-10 border-b border-quartz/5 flex justify-between items-center">
                <h3 className="text-3xl font-serif font-black dark:text-white italic">Gestão de <span className="text-gold">Identidades.</span></h3>
                <div className="flex gap-4">
                  <input type="text" placeholder="Buscar por e-mail ou nome..." className="bg-offwhite dark:bg-onyx border border-quartz/10 rounded-full px-6 py-2 text-xs outline-none focus:border-ruby transition-all w-64" />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-offwhite dark:bg-onyx/50 text-[10px] font-black uppercase tracking-widest text-quartz border-b border-quartz/5">
                    <tr>
                      <th className="px-10 py-6">Membro</th>
                      <th className="px-10 py-6">Papel (Role)</th>
                      <th className="px-10 py-6">Patente (Plano)</th>
                      <th className="px-10 py-6">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-quartz/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-quartz/5 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-ruby/10 text-ruby rounded-full flex items-center justify-center font-black text-xs">{u.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold dark:text-white">{u.name}</p>
                              <p className="text-[10px] text-quartz">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === UserRole.CLIENT ? 'bg-blue-100 text-blue-600' : 'bg-gold/10 text-gold'}`}>
                              {u.role}
                            </span>
                            <button 
                              onClick={() => handleUpdateUserRole(u.id, u.role === UserRole.CLIENT ? UserRole.PROFESSIONAL : UserRole.CLIENT)}
                              className="p-2 bg-offwhite dark:bg-onyx rounded-lg hover:text-ruby transition-colors"
                              title="Trocar Role"
                            >
                              <Icons.Chart />
                            </button>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <select 
                            value={u.planTier} 
                            onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)}
                            className="bg-transparent border border-quartz/20 rounded-lg px-3 py-1 text-[10px] font-black uppercase outline-none dark:text-white"
                          >
                            <option value="FREE">FREE</option>
                            <option value="SILVER">SILVER</option>
                            <option value="GOLD">GOLD</option>
                            <option value="DIAMOND">DIAMOND</option>
                          </select>
                        </td>
                        <td className="px-10 py-8">
                          <button 
                            onClick={() => onMasquerade(u)}
                            className="px-6 py-2.5 bg-onyx dark:bg-white dark:text-onyx text-white text-[9px] font-black uppercase rounded-xl hover:bg-ruby hover:text-white transition-all shadow-md"
                          >
                            Entrar no Perfil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* TAB FINANCEIRA - Tesouraria com Visualização de Comprovativo */}
        {activeTab === 'finance' && (
          <div className="space-y-12 animate-fade-in">
             <div className="bg-white dark:bg-darkCard rounded-[50px] luxury-shadow border border-quartz/10 overflow-hidden">
                <div className="p-10 border-b border-quartz/5 flex justify-between items-center">
                   <h3 className="text-3xl font-serif font-black dark:text-white italic">Fila de <span className="text-ruby">Confirmação.</span></h3>
                   <span className="bg-ruby/10 text-ruby px-4 py-2 rounded-full text-[10px] font-black uppercase">Pendentes: {paymentRequests.length}</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-offwhite dark:bg-onyx/50 text-[10px] font-black uppercase tracking-widest text-quartz border-b border-quartz/5">
                         <tr>
                            <th className="px-10 py-6">Profissional</th>
                            <th className="px-10 py-6">Valor / TRX</th>
                            <th className="px-10 py-6">Status</th>
                            <th className="px-10 py-6">Ação</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-quartz/5">
                         {paymentRequests.map(req => (
                           <tr key={req.id} className="hover:bg-quartz/5 transition-colors">
                              <td className="px-10 py-8">
                                 <p className="font-bold dark:text-white">{req.userName}</p>
                                 <p className="text-[9px] text-quartz">ID: {req.userId}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <p className="text-xl font-serif font-black dark:text-white">{req.amount.toLocaleString()} Kz</p>
                                 <p className="text-[8px] font-black text-gold uppercase">{req.planName}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[8px] font-black uppercase tracking-widest">Aguardando Auditoria</span>
                              </td>
                              <td className="px-10 py-8">
                                 <button 
                                  onClick={() => setSelectedProof(req)}
                                  className="px-8 py-3 bg-ruby text-white text-[9px] font-black uppercase rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                 >
                                    <Icons.Search /> Inspecionar
                                 </button>
                              </td>
                           </tr>
                         ))}
                         {paymentRequests.length === 0 && (
                           <tr>
                              <td colSpan={4} className="py-20 text-center text-quartz font-serif italic text-xl">Nenhuma transação pendente.</td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* TAB MARKETING / GLOW HUB */}
        {activeTab === 'marketing' && (
           <div className="space-y-12 animate-fade-in">
              <div className="bg-white dark:bg-darkCard p-12 md:p-16 rounded-[60px] luxury-shadow border border-quartz/10">
                 <header className="mb-12">
                    <h3 className="text-4xl font-serif font-black dark:text-white italic">Glow <span className="text-ruby">Messenger.</span></h3>
                    <p className="text-quartz font-medium">Controle omnicanal: Envie comunicados personalizados por SMS e Push.</p>
                 </header>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-quartz tracking-widest ml-2">Destinatários</label>
                          <div className="flex flex-col gap-2">
                             {['ALL', 'PROFESSIONAL', 'CLIENT', 'INDIVIDUAL'].map(t => (
                                <button key={t} onClick={() => setMsgTarget(t as any)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left transition-all ${msgTarget === t ? 'bg-ruby text-white shadow-xl' : 'bg-offwhite dark:bg-onyx text-quartz hover:bg-ruby/5'}`}>{t}</button>
                             ))}
                          </div>
                       </div>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                       <textarea 
                        value={msgContent} 
                        onChange={(e) => setMsgContent(e.target.value)} 
                        className="w-full bg-offwhite dark:bg-onyx p-10 rounded-[40px] border border-quartz/10 outline-none dark:text-white font-medium text-lg min-h-[250px] resize-none focus:border-ruby transition-all shadow-inner" 
                        placeholder="Componha sua mensagem de elite..."
                       />
                       <button onClick={handleSendMessage} className="w-full py-7 bg-onyx dark:bg-white dark:text-onyx text-white rounded-[30px] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-ruby hover:text-white transition-all">Disparar Comunicado</button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB PLANOS */}
        {activeTab === 'plans' && (
          <div className="space-y-12 animate-fade-in">
             <div className="flex justify-between items-center px-4">
                <div className="space-y-2">
                   <h3 className="text-4xl font-serif font-black dark:text-white italic">Arquitetura de <span className="text-gold">Planos.</span></h3>
                   <p className="text-quartz font-medium">Defina as ofertas de valor do ecossistema Beleza Glow.</p>
                </div>
                <button 
                  onClick={() => { setEditingPlan({ benefits: [], target: 'PROFESSIONAL' }); setIsPlanModalOpen(true); }}
                  className="px-8 py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all"
                >
                   <Icons.Plus /> Criar Novo Plano
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {plans.map(p => (
                   <div key={p.id} className="bg-white dark:bg-darkCard p-10 rounded-[50px] border border-quartz/10 luxury-shadow flex flex-col justify-between group hover:border-ruby transition-all relative overflow-hidden">
                      <div className="space-y-6">
                         <div className="flex justify-between items-start">
                            <span className="bg-ruby/10 text-ruby px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">{p.target}</span>
                            <div className="text-gold"><Icons.Star filled /></div>
                         </div>
                         <h4 className="text-3xl font-serif font-black dark:text-white">{p.name}</h4>
                         <p className="text-4xl font-serif font-black text-ruby">{p.price.toLocaleString()} <span className="text-xs uppercase text-quartz">Kz / mês</span></p>
                         <ul className="space-y-3 pt-4">
                            {p.benefits.map((b, i) => (
                               <li key={i} className="text-[10px] font-bold text-quartz flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 bg-ruby rounded-full"></div> {b}
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="flex gap-4 mt-12 pt-8 border-t border-quartz/5">
                         <button 
                          onClick={() => { setEditingPlan(p); setIsPlanModalOpen(true); }}
                          className="flex-1 py-4 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all shadow-lg"
                         >
                            Editar Oferta
                         </button>
                         <button 
                          onClick={() => { if(confirm("Remover este plano permanentemente?")) setPlans(plans.filter(item => item.id !== p.id)); }}
                          className="w-14 h-14 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                         >
                            <Icons.Trash />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* MODAL DE AUDITORIA DE COMPROVATIVO - CORRIGIDO PARA MOBILE */}
      {selectedProof && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-0 md:p-6 backdrop-blur-3xl bg-onyx/95">
           <div className="bg-white dark:bg-darkCard w-full max-w-5xl h-full md:h-[85vh] md:rounded-[60px] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden shadow-2xl animate-fade-in relative">
              
              {/* BOTÃO FECHAR MOBILE */}
              <button 
                onClick={() => setSelectedProof(null)} 
                className="absolute top-6 right-6 z-[7100] md:hidden w-12 h-12 rounded-full bg-onyx/50 text-white flex items-center justify-center backdrop-blur-md"
              >✕</button>

              {/* ÁREA DA IMAGEM - PRIORIDADE MOBILE */}
              <div className="w-full md:flex-1 bg-offwhite dark:bg-onyx flex items-center justify-center p-4 min-h-[450px] md:min-h-0 overflow-hidden relative group shrink-0">
                 <img 
                  src={selectedProof.proofUrl} 
                  className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-110 cursor-zoom-in" 
                  alt="Comprovativo Bancário" 
                 />
                 <div className="absolute top-6 left-6 md:top-10 md:left-10">
                    <span className="bg-ruby text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Documento de Auditoria</span>
                 </div>
              </div>

              {/* PAINEL DE CONTROLE - ABAIXO NO MOBILE */}
              <div className="w-full md:w-[400px] bg-white dark:bg-darkCard p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-quartz/10 shrink-0">
                 <div className="space-y-8 md:space-y-10">
                    <header className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-ruby text-[9px] font-black uppercase tracking-widest">Detalhes da Transação</p>
                          <h4 className="text-2xl md:text-3xl font-serif font-black dark:text-white italic">{selectedProof.userName}</h4>
                       </div>
                       <button onClick={() => setSelectedProof(null)} className="hidden md:flex w-12 h-12 rounded-2xl bg-offwhite dark:bg-onyx items-center justify-center hover:text-ruby transition-all">✕</button>
                    </header>

                    <div className="space-y-6">
                       <div className="bg-offwhite dark:bg-onyx p-6 rounded-[30px] border border-quartz/5 shadow-inner">
                          <p className="text-[9px] font-black uppercase text-quartz tracking-widest mb-1">Valor Transferido</p>
                          <p className="text-3xl md:text-4xl font-serif font-black text-ruby leading-none">{selectedProof.amount.toLocaleString()} <span className="text-xs">Kz</span></p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-offwhite dark:bg-onyx p-5 rounded-[25px] border border-quartz/5">
                             <p className="text-[9px] font-black uppercase text-quartz tracking-widest mb-1">Plano</p>
                             <p className="font-bold dark:text-white uppercase text-xs">{selectedProof.planName}</p>
                          </div>
                          <div className="bg-offwhite dark:bg-onyx p-5 rounded-[25px] border border-quartz/5">
                             <p className="text-[9px] font-black uppercase text-quartz tracking-widest mb-1">Data</p>
                             <p className="font-bold dark:text-white text-xs">{selectedProof.date}</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-5 bg-gold/5 rounded-[25px] border border-gold/10 italic text-[10px] text-stone-500 font-medium leading-relaxed">
                       "Verifique se o nome do depositante e o montante coincidem exatamente com o extrato bancário antes de confirmar."
                    </div>
                 </div>

                 <div className="flex flex-col gap-3 pt-8 md:pt-0">
                    <button 
                      onClick={() => handleProcessPayment(selectedProof.id, 'CONFIRMED')}
                      className="w-full py-5 bg-emerald text-white rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                       <Icons.Star filled /> Validar & Ativar
                    </button>
                    <button 
                      onClick={() => handleProcessPayment(selectedProof.id, 'REJECTED')}
                      className="w-full py-5 bg-offwhite dark:bg-onyx text-red-600 rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] border border-red-600/10 hover:bg-red-600 hover:text-white transition-all active:scale-95 mb-6 md:mb-0"
                    >
                       Rejeitar Comprovativo
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL GESTÃO DE PLANO */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 backdrop-blur-3xl bg-onyx/90 overflow-y-auto">
           <div className="bg-white dark:bg-darkCard w-full max-w-2xl rounded-[60px] p-12 md:p-16 space-y-10 shadow-2xl animate-fade-in my-8">
              <h3 className="text-4xl font-serif font-black dark:text-white italic text-center">Configurar <span className="text-ruby">Proposta.</span></h3>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputAdminGroup label="Nome do Plano" value={editingPlan.name || ''} onChange={(val: string) => setEditingPlan({...editingPlan, name: val})} />
                    <InputAdminGroup label="Preço Mensal (Kz)" value={editingPlan.price?.toString() || ''} onChange={(val: string) => setEditingPlan({...editingPlan, price: Number(val)})} type="number" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-quartz ml-4 tracking-[0.2em]">Público Alvo</label>
                    <select 
                      value={editingPlan.target} 
                      onChange={(e) => setEditingPlan({...editingPlan, target: e.target.value as any})}
                      className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl py-5 px-8 outline-none dark:text-white font-bold text-sm focus:border-ruby appearance-none"
                    >
                       <option value="PROFESSIONAL">Artista Autônomo</option>
                       <option value="SALON">Salão / Centro de Estética</option>
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-quartz ml-4 tracking-[0.2em]">Vantagens do Plano</label>
                    <div className="flex gap-3">
                       <input 
                        type="text" 
                        value={newBenefit} 
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Ex: IA de Atendimento..."
                        className="flex-1 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl py-4 px-8 outline-none dark:text-white text-sm"
                       />
                       <button onClick={addBenefit} className="px-6 bg-gold text-onyx rounded-2xl font-black text-[10px] uppercase">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {editingPlan.benefits?.map((b, i) => (
                          <div key={i} className="bg-ruby/5 text-ruby px-4 py-2 rounded-full text-[9px] font-bold flex items-center gap-2 border border-ruby/10">
                             {b}
                             <button onClick={() => removeBenefit(i)} className="text-red-600 font-black ml-2">✕</button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-6">
                 <button onClick={() => setIsPlanModalOpen(false)} className="flex-1 py-5 bg-offwhite dark:bg-onyx dark:text-white rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
                 <button onClick={handleSavePlan} className="flex-[2] py-5 bg-ruby text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:scale-105 transition-all">Publicar Alterações</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const InputAdminGroup = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-[9px] font-black uppercase text-quartz ml-4 tracking-[0.2em]">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl py-5 px-8 outline-none dark:text-white font-bold text-sm focus:border-ruby transition-all shadow-inner" />
  </div>
);

const StatCardSmall = ({ label, value, color }: any) => (
  <div className="bg-white dark:bg-darkCard p-10 rounded-[50px] border border-quartz/10 luxury-shadow flex flex-col justify-center">
     <p className="text-[10px] font-black text-quartz uppercase mb-4 tracking-widest">{label}</p>
     <h4 className={`text-5xl font-serif font-black ${color}`}>{value}</h4>
  </div>
);

export default AdminDashboard;
