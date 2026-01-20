
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
      // Casting para any para evitar erros de compilação TS
      const html2pdf = (window as any).html2pdf;
      if (html2pdf) {
        await html2pdf().from(element).set(opt).save();
      } else {
        throw new Error("Lib PDF não carregada.");
      }
    } catch (error) {
      console.error("Erro PDF:", error);
      alert("Falha ao gerar PDF. Tente imprimir a tela.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConfirm = () => {
    if (!depositant.trim() || !fileName) {
      alert("Complete os dados e anexe o comprovativo.");
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
        <div ref={invoiceRef} className="bg-white dark:bg-darkCard rounded-[60px] overflow-hidden border border-quartz/10 luxury-shadow relative">
          <div className="bg-ruby p-12 text-white flex justify-between items-center relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-3xl font-serif font-black italic tracking-tighter">BELEZA GLOW</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Fatura de Solicitação #{transactionId}</p>
             </div>
             <Icons.Award />
          </div>
          <div className="p-12 md:p-16 space-y-10">
             <div className="grid grid-cols-2 gap-8 text-left border-b border-quartz/5 pb-10">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-quartz">Depositante</p>
                   <p className="font-bold dark:text-white uppercase text-xs">{depositant}</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black uppercase text-quartz">Data</p>
                   <p className="font-bold dark:text-white text-xs">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
             </div>
             <div className="flex justify-between items-center bg-offwhite dark:bg-onyx p-8 rounded-[35px] border border-quartz/5">
                <p className="text-[10px] font-black uppercase text-quartz">Total</p>
                <p className="text-4xl font-serif font-black text-ruby">{plan.price.toLocaleString()} Kz</p>
             </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4 px-4">
           <button onClick={handleDownloadPDF} disabled={isDownloading} className="flex-1 px-10 py-6 bg-white dark:bg-darkCard text-onyx dark:text-white border border-quartz/10 rounded-[25px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
              {isDownloading ? 'Gerando...' : 'Baixar PDF'}
           </button>
           <button onClick={onBack} className="flex-1 px-10 py-6 bg-ruby text-white rounded-[25px] text-[10px] font-black uppercase tracking-widest">Finalizar</button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-darkCard rounded-[60px] p-8 md:p-20 luxury-shadow border-2 border-ruby/5 animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-quartz/5 pb-12">
        <div className="text-center md:text-left">
          <button onClick={onBack} className="text-ruby text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-4">← Voltar</button>
          <h3 className="text-3xl font-serif font-black dark:text-white italic">Liquidação de <span className="text-ruby">Patente.</span></h3>
        </div>
        <div className="p-8 bg-offwhite dark:bg-onyx rounded-[40px] border border-quartz/10 text-center min-w-[280px]">
          <p className="text-5xl font-serif font-black text-ruby">{plan.price.toLocaleString()} <span className="text-xs">Kz</span></p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
           <div className="bg-offwhite dark:bg-onyx p-8 rounded-[40px] border border-quartz/10 space-y-4">
              <p className="text-[9px] font-black uppercase text-quartz">IBAN BAI</p>
              <p className="font-mono text-lg font-black dark:text-white select-all">0040 0000 4414 8222 1023 4</p>
           </div>
           <div className="bg-offwhite dark:bg-onyx p-8 rounded-[40px] border border-quartz/10 space-y-4">
              <p className="text-[9px] font-black uppercase text-quartz">IBAN BFA</p>
              <p className="font-mono text-lg font-black dark:text-white select-all">0006 0000 9145 1879 3014 7</p>
           </div>
        </div>
        <div className="space-y-8">
          <input type="text" value={depositant} onChange={(e) => setDepositant(e.target.value)} placeholder="Nome do Depositante" className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-full py-6 px-10 outline-none dark:text-white font-bold" />
          <div className="relative h-44 border-2 border-dashed border-quartz/20 rounded-[40px] flex flex-col items-center justify-center cursor-pointer">
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
             <span className="text-[10px] font-black uppercase text-quartz">{fileName || 'Anexar Comprovativo'}</span>
          </div>
          <button onClick={handleConfirm} disabled={isSubmitting} className="w-full py-8 bg-ruby text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl active:scale-95 disabled:opacity-50">
            {isSubmitting ? 'Sincronizando...' : 'Confirmar & Gerar Fatura'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
