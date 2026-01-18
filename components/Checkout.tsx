
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { PlanTier } from '../types';

interface CheckoutProps {
  plan: {
    id: PlanTier;
    name: string;
    price: number;
  };
  onBack?: () => void;
  onSuccess?: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ plan, onBack, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [step, setStep] = useState<'form' | 'invoice'>('form');
  const [depositant, setDepositant] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [transactionId] = useState(`TRX-${Math.floor(Math.random() * 90000) + 10000}`);
  
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    setIsDownloading(true);
    const element = invoiceRef.current;
    const opt = {
      margin: [10, 10],
      filename: `Fatura-BelezaGlow-${transactionId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore - html2pdf is loaded via CDN
      await window.html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um problema ao gerar o PDF. Por favor, utilize a função de impressão do navegador.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConfirm = () => {
    if (!depositant.trim()) {
      alert("Por favor, insira o nome completo do depositante como aparece no talão.");
      return;
    }
    
    if (!fileName) {
      alert("É obrigatório anexar o comprovativo (Foto ou PDF) para auditoria.");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('invoice');
      if (onSuccess) onSuccess();
    }, 1800);
  };

  if (step === 'invoice') {
    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20">
        {/* ÁREA DE CAPTURA DA FATURA */}
        <div ref={invoiceRef} className="bg-white dark:bg-darkCard rounded-[60px] overflow-hidden border border-quartz/10 luxury-shadow relative">
          <div className="bg-ruby p-12 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
             <div className="relative z-10">
                <h3 className="text-3xl font-serif font-black italic tracking-tighter">BELEZA GLOW</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Fatura de Solicitação #{transactionId}</p>
             </div>
             <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Icons.Award />
             </div>
          </div>
          
          <div className="p-12 md:p-16 space-y-10">
             <div className="grid grid-cols-2 gap-8 text-left border-b border-quartz/5 pb-10">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Titular da Conta</p>
                   <p className="font-bold dark:text-white uppercase text-xs">{depositant}</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Data de Emissão</p>
                   <p className="font-bold dark:text-white text-xs">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Plano Selecionado</p>
                   <p className="font-bold dark:text-white text-xs">{plan.name} (Patente Pro)</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Status da Ativação</p>
                   <p className="font-black text-ruby text-[8px] uppercase tracking-widest bg-ruby/5 px-2 py-1 rounded">Aguardando Auditor ADM</p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex justify-between items-center bg-offwhite dark:bg-onyx p-8 rounded-[35px] border border-quartz/5">
                   <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Total Liquidado</p>
                   <p className="text-4xl font-serif font-black text-ruby">{plan.price.toLocaleString()} Kz</p>
                </div>
                
                <div className="p-6 bg-gold/5 border border-gold/10 rounded-3xl">
                   <p className="text-[10px] text-stone-500 font-medium italic leading-relaxed text-center">
                     "Nota: O Plano Pro e as funcionalidades de elite serão ativados assim que o Administrador Neloi Miranda confirmar a entrada dos fundos em sistema (Janela de até 12h úteis)."
                   </p>
                </div>
             </div>
          </div>
          
          <div className="bg-onyx p-8 text-center">
             <p className="text-[8px] font-black uppercase text-quartz tracking-[0.3em]">Beleza Glow Maison • Luanda, Angola</p>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO EXTERNOS (NÃO SAEM NO PDF) */}
        <div className="flex flex-col md:flex-row justify-center gap-4 px-4">
           <button 
             type="button" 
             disabled={isDownloading}
             onClick={handleDownloadPDF} 
             className="flex-1 px-10 py-6 bg-white dark:bg-darkCard text-onyx dark:text-white border border-quartz/10 rounded-[25px] text-[10px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
           >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-ruby border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              )}
              {isDownloading ? 'Gerando Documento...' : 'Baixar Fatura PDF'}
           </button>
           <button 
             type="button" 
             onClick={onBack} 
             className="flex-1 px-10 py-6 bg-ruby text-white rounded-[25px] text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
           >
              Finalizar e Voltar
           </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-darkCard rounded-[60px] p-8 md:p-20 luxury-shadow border-2 border-ruby/5 animate-fade-in space-y-12">
      {/* Checkout Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-quartz/5 pb-12">
        <div className="space-y-2 text-center md:text-left">
          <button type="button" onClick={onBack} className="text-ruby text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 hover:opacity-70 transition-all">
            <div className="rotate-180 scale-75"><Icons.ChevronRight /></div> Voltar aos Planos
          </button>
          <h3 className="text-3xl font-serif font-black dark:text-white italic">Liquidação de <span className="text-ruby">Patente.</span></h3>
          <p className="text-quartz text-sm font-medium uppercase tracking-widest">Upgrade Pro para {plan.name}</p>
        </div>
        
        <div className="p-8 bg-offwhite dark:bg-onyx rounded-[40px] border border-quartz/10 text-center space-y-3 min-w-[280px] shadow-inner">
          <p className="text-[10px] font-black uppercase text-quartz tracking-[0.3em]">Montante a Transferir</p>
          <p className="text-5xl font-serif font-black text-ruby">
            {plan.price.toLocaleString()} <span className="text-xs">Kz</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-ruby rounded-full"></div>
              <p className="text-ruby text-[10px] font-black uppercase tracking-widest">Canais Oficiais Beleza Glow</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-offwhite dark:bg-onyx p-8 rounded-[40px] border border-quartz/10 space-y-4 relative overflow-hidden group hover:border-ruby/20 transition-all">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Banco BAI</p>
                    <span className="text-[8px] bg-emerald/10 text-emerald px-3 py-1 rounded-full font-black">RECOMENDADO</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 mb-1">IBAN BAI</p>
                    <p className="font-mono text-lg font-black dark:text-white select-all break-all tracking-tight cursor-copy">0040 0000 4414 8222 1023 4</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 mb-1">TRANSFERÊNCIA EXPRESS</p>
                    <p className="font-serif font-black text-2xl text-ruby">942 644 781</p>
                  </div>
               </div>

               <div className="bg-offwhite dark:bg-onyx p-8 rounded-[40px] border border-quartz/10 space-y-4 group hover:border-ruby/20 transition-all">
                  <p className="text-[9px] font-black uppercase text-quartz tracking-widest">Banco BFA</p>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 mb-1">IBAN BFA</p>
                    <p className="font-mono text-lg font-black dark:text-white select-all break-all tracking-tight cursor-copy">0006 0000 9145 1879 3014 7</p>
                  </div>
               </div>

               <div className="bg-onyx dark:bg-white/5 p-6 rounded-[30px] border border-white/5">
                  <p className="text-[9px] font-black uppercase text-quartz tracking-widest mb-1 text-center">Titular Beneficiário</p>
                  <p className="font-serif font-black text-lg text-white text-center italic">Neloi Agostinho Miranda Cassuada</p>
               </div>
            </div>
          </div>
          
          <div className="p-6 bg-gold/5 rounded-3xl border border-gold/10">
             <p className="text-[10px] text-stone-500 font-medium italic leading-relaxed">
               * O plano Pro será ativado apenas após a confirmação manual do depósito pelo Administrador Mestre Neloi Miranda.
             </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-quartz tracking-widest ml-6">Nome Completo do Depositante</label>
              <input 
                type="text" 
                value={depositant}
                onChange={(e) => setDepositant(e.target.value)}
                placeholder="Exatamente como no talão bancário..."
                className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-[30px] py-6 px-10 outline-none dark:text-white font-bold shadow-inner focus:border-ruby transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-quartz tracking-widest ml-6">Prova Documental (Comprovativo)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  className="hidden" 
                  id="checkout-proof-final" 
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFileName(file.name);
                  }}
                />
                <label 
                  htmlFor="checkout-proof-final"
                  className={`w-full h-44 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                    fileName ? 'border-emerald bg-emerald/5' : 'border-quartz/20 bg-offwhite dark:bg-onyx group-hover:border-ruby/50'
                  }`}
                >
                  {fileName ? (
                    <div className="text-center px-8">
                       <div className="w-14 h-14 bg-emerald text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                          <Icons.Star filled />
                       </div>
                       <p className="text-[10px] font-black text-emerald uppercase tracking-widest truncate max-w-full">{fileName}</p>
                       <p className="text-[8px] font-bold text-quartz mt-1">Toque para substituir arquivo</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-quartz/10 rounded-full flex items-center justify-center text-quartz mb-2">
                        <Icons.Plus />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-quartz">Anexar FOTO ou PDF</span>
                      <p className="text-[8px] font-bold text-stone-400 mt-2">Clique para selecionar comprovativo</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-8 bg-ruby text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-4">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Registrando Auditoria...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                 Liquidar & Gerar Fatura <Icons.ChevronRight />
              </span>
            )}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
