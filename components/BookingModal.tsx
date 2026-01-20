
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { ProviderProfile, Service } from '../types';
import { supabase } from '../lib/supabase';

interface BookingModalProps {
  provider: ProviderProfile;
  initialService?: Service | null;
  onClose: () => void;
  onSuccess: (date: string, time: string, service: Service) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ provider, initialService, onClose, onSuccess }) => {
  const [step, setStep] = useState(initialService ? 2 : 1);
  const [selectedService, setSelectedService] = useState<Service | null>(initialService || null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const minutesRef = useRef<HTMLDivElement>(null);
  const now = new Date();

  const isToday = (d: Date) => 
    d.getDate() === now.getDate() && 
    d.getMonth() === now.getMonth() && 
    d.getFullYear() === now.getFullYear();

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setStep(2);
    }
  }, [initialService]);

  // Carregar ocupação real do banco de dados
  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      setIsLoadingSlots(true);
      const dateStr = selectedDate.toLocaleDateString('pt-BR');
      try {
        const { data } = await supabase
          .from('appointments')
          .select('time')
          .eq('provider_id', provider.id)
          .eq('date', dateStr)
          .neq('status', 'CANCELLED');
        
        if (data) {
          setOccupiedSlots(data.map(a => a.time));
        }
      } catch (err) {
        console.warn("Erro ao buscar ocupação:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchOccupiedSlots();
  }, [selectedDate, provider.id]);

  const nextDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const minutesSlots = ['00', '15', '30', '45'];

  const availableHours = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayOfWeek = selectedDate.getDay(); 

    return hours.filter(h => {
      if (dayOfWeek === 6 && h < 19) return false;
      if (isToday(selectedDate) && h < now.getHours()) return false;
      return true;
    });
  }, [selectedDate]);

  useEffect(() => {
    if (selectedHour !== null && minutesRef.current) {
      minutesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedHour]);

  const handleConfirm = async () => {
    if (selectedService && selectedHour !== null && selectedMinute) {
      setIsProcessing(true);
      const dateStr = selectedDate.toLocaleDateString('pt-BR');
      const timeStr = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute}`;
      
      // Pequeno delay para percepção de sistema seguro
      setTimeout(() => {
        onSuccess(dateStr, timeStr, selectedService);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const isSlotOccupied = (h: number, m: string) => {
    const timeStr = `${h.toString().padStart(2, '0')}:${m}`;
    // Ocupação do banco de dados
    if (occupiedSlots.includes(timeStr)) return true;
    // Ocupação lógica (passado)
    if (isToday(selectedDate) && h === now.getHours() && parseInt(m) <= now.getMinutes()) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-onyx/98 backdrop-blur-3xl z-[6000] flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
      <div className="bg-white dark:bg-darkCard w-full max-w-6xl md:rounded-[60px] rounded-t-[50px] overflow-hidden luxury-shadow h-[100vh] md:h-[90vh] flex flex-col md:flex-row border border-white/5 relative">
        
        {/* SIDEBAR EDITORIAL (Desktop) */}
        <div className="hidden lg:flex w-[450px] bg-ruby p-16 text-white flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          <div className="space-y-12 relative z-10">
            <div className="space-y-4">
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.6em]">Reserva de Prestígio</span>
              <h3 className="font-serif font-black text-7xl leading-none italic tracking-tighter">{provider.businessName}</h3>
            </div>
            
            {selectedService && (
              <div className="p-10 bg-white/10 backdrop-blur-3xl rounded-[50px] border border-white/10 animate-fade-in space-y-8">
                 <img src={selectedService.photoUrl} className="w-full h-48 object-cover rounded-[35px] shadow-2xl" />
                 <div className="space-y-2">
                   <p className="text-[9px] font-black uppercase text-white/50 tracking-widest">Serviço Selecionado</p>
                   <p className="text-3xl font-serif font-bold italic">{selectedService.name}</p>
                 </div>
                 <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                    <p className="text-4xl font-serif font-black text-gold">{selectedService.price.toLocaleString()} Kz</p>
                    <p className="font-bold text-xs opacity-40">{selectedService.durationMinutes} min</p>
                 </div>
              </div>
            )}
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 relative z-10">Glow Elite Angola Concierge</p>
        </div>

        {/* ÁREA DE AGENDAMENTO */}
        <div className="flex-1 flex flex-col bg-offwhite dark:bg-onyx overflow-hidden">
          
          <header className="px-8 py-8 md:px-16 md:py-12 border-b border-quartz/10 flex items-center justify-between shrink-0 bg-white dark:bg-darkCard z-30 shadow-sm">
             <div className="flex items-center gap-6">
                {step > 1 && !initialService && (
                  <button onClick={() => setStep(step - 1)} className="w-14 h-14 flex items-center justify-center bg-offwhite dark:bg-onyx rounded-[22px] active:scale-90 transition-all border border-quartz/5">
                    <div className="rotate-180 scale-125"><Icons.ChevronRight /></div>
                  </button>
                )}
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-ruby uppercase tracking-[0.4em]">Passo {step} de 3</p>
                   <h4 className="text-2xl md:text-4xl font-serif font-black text-onyx dark:text-white tracking-tighter italic">
                      {step === 1 && 'Escolha o Serviço'}
                      {step === 2 && 'Agenda de Elite'}
                      {step === 3 && 'Confirmação'}
                   </h4>
                </div>
             </div>
             <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-offwhite dark:bg-onyx hover:bg-red-600 hover:text-white rounded-[22px] transition-all">✕</button>
          </header>

          <div className="flex-1 overflow-y-auto p-0 md:p-16 scrollbar-hide">
            
            {step === 1 && (
              <div className="flex flex-col gap-px md:gap-8 animate-fade-in pb-32">
                {provider.services.map((s) => (
                  <button 
                    key={s.id} 
                    onClick={() => { setSelectedService(s); setStep(2); }}
                    className={`w-full flex flex-col md:flex-row items-center p-8 bg-white dark:bg-darkCard md:rounded-[50px] border-b md:border-2 transition-all group relative overflow-hidden ${
                      selectedService?.id === s.id ? 'md:border-ruby ring-8 ring-ruby/5' : 'md:border-transparent'
                    }`}
                  >
                    <div className="flex w-full items-start gap-8">
                      <img src={s.photoUrl} className="w-28 h-28 md:w-40 md:h-40 rounded-[35px] object-cover shadow-2xl border border-white/10 shrink-0" alt={s.name} />
                      <div className="text-left flex-1 space-y-3 py-2">
                        <p className="font-serif font-black text-2xl md:text-4xl text-onyx dark:text-white leading-none group-hover:text-ruby transition-colors">{s.name}</p>
                        <p className="text-[11px] text-ruby font-black uppercase tracking-widest">{s.price.toLocaleString()} Kz • {s.durationMinutes} min</p>
                        <p className="text-[13px] text-stone-500 font-medium leading-relaxed italic pr-6 truncate">
                           {s.specification || "Serviço de alta performance com curadoria de produtos exclusivos."}
                        </p>
                      </div>
                      <div className="self-center text-ruby opacity-20 group-hover:opacity-100 scale-150"><Icons.ChevronRight /></div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-fade-in pb-40 p-8 md:p-0">
                {/* CALENDÁRIO */}
                <div className="space-y-6">
                  <p className="text-[11px] font-black uppercase text-quartz tracking-[0.3em] ml-2">1. Selecione o Dia</p>
                  <div className="flex gap-5 overflow-x-auto pb-6 px-2 scrollbar-hide">
                    {nextDays.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(d); setSelectedHour(null); setSelectedMinute(null); }}
                        className={`min-w-[95px] h-32 rounded-[35px] flex flex-col items-center justify-center transition-all border-2 shrink-0 ${
                          selectedDate.getDate() === d.getDate()
                            ? 'bg-ruby text-white border-ruby shadow-2xl scale-110 ring-4 ring-ruby/10'
                            : 'bg-white dark:bg-darkCard text-onyx dark:text-white border-quartz/5'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-black opacity-50 mb-1">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                        <span className="text-3xl font-serif font-black">{d.getDate()}</span>
                        {d.getDay() === 6 && <span className="text-[8px] bg-gold text-onyx px-3 py-1 rounded-full font-black uppercase mt-2 shadow-sm">Abre 19h</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HORÁRIOS */}
                <div className="space-y-6">
                   <div className="flex justify-between items-center ml-2">
                      <p className="text-[11px] font-black uppercase text-quartz tracking-[0.3em]">2. Escolha o Horário</p>
                      {isLoadingSlots && <div className="w-4 h-4 border-2 border-ruby/30 border-t-ruby rounded-full animate-spin"></div>}
                   </div>
                   <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                      {availableHours.map(h => (
                        <button 
                          key={h} 
                          onClick={() => { setSelectedHour(h); setSelectedMinute(null); }}
                          className={`py-5 rounded-[22px] text-xs font-black transition-all border-2 ${
                            selectedHour === h 
                              ? 'bg-onyx dark:bg-white text-white dark:text-onyx border-onyx shadow-xl scale-110' 
                              : 'bg-white dark:bg-darkCard text-onyx dark:text-white border-quartz/5 hover:border-ruby/30'
                          }`}
                        >
                          {h.toString().padStart(2, '0')}:00
                        </button>
                      ))}
                   </div>
                </div>

                {/* MINUTOS */}
                {selectedHour !== null && (
                  <div ref={minutesRef} className="space-y-8 bg-ruby/5 p-10 rounded-[50px] border border-ruby/20 animate-fade-in mx-1 luxury-shadow">
                     <p className="text-[11px] font-black uppercase text-ruby tracking-[0.5em] text-center">3. Minuto Exato</p>
                     <div className="grid grid-cols-4 gap-4">
                        {minutesSlots.map(m => {
                          const occupied = isSlotOccupied(selectedHour, m);
                          return (
                            <button 
                              key={m} 
                              disabled={occupied}
                              onClick={() => setSelectedMinute(m)}
                              className={`py-6 rounded-2xl text-base font-black transition-all border-2 relative overflow-hidden ${
                                selectedMinute === m 
                                  ? 'bg-gold text-onyx border-gold shadow-xl scale-110 ring-8 ring-gold/10' 
                                  : occupied 
                                    ? 'bg-quartz/10 text-quartz/40 cursor-not-allowed border-transparent grayscale'
                                    : 'bg-white dark:bg-onyx text-onyx dark:text-white border-quartz/10'
                              }`}
                            >
                              {occupied && <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20"></div>}
                              {occupied ? 'Ocupado' : `:${m}`}
                            </button>
                          );
                        })}
                     </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-fade-in py-16 px-8 text-center max-w-2xl mx-auto">
                <div className="w-28 h-28 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto border border-gold/10 animate-pulse shadow-[0_0_60px_rgba(212,175,55,0.2)]">
                   <Icons.Star filled />
                </div>
                <h4 className="text-5xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter leading-none">Confirmar <br /><span className="text-ruby">o seu Momento.</span></h4>

                <div className="bg-white dark:bg-darkCard p-10 md:p-14 rounded-[60px] luxury-shadow border border-quartz/5 text-left space-y-10 relative overflow-hidden">
                   <div className="flex items-center gap-8">
                      <img src={selectedService?.photoUrl} className="w-28 h-28 rounded-[40px] object-cover shadow-2xl" />
                      <div>
                        <p className="font-serif font-black text-3xl text-ruby leading-none">{selectedService?.name}</p>
                        <p className="text-[12px] text-stone-500 font-bold uppercase mt-3 tracking-widest">{provider.businessName}</p>
                      </div>
                   </div>
                   
                   <div className="pt-10 border-t border-quartz/5 grid grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-quartz uppercase tracking-widest">Data Escolhida</p>
                        <p className="font-black dark:text-white text-xl leading-tight">
                          {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                        </p>
                        <p className="text-ruby font-black text-2xl italic mt-1">às {selectedHour?.toString().padStart(2, '0')}:{selectedMinute}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-[10px] font-black text-quartz uppercase tracking-widest">Investimento</p>
                        <p className="font-serif font-black text-4xl text-ruby">{selectedService?.price.toLocaleString()} Kz</p>
                        <p className="text-[11px] font-bold text-stone-500">{selectedService?.durationMinutes} min de serviço</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <footer className="p-8 md:p-16 bg-white dark:bg-darkCard border-t border-quartz/10 shrink-0 z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {step < 3 ? (
              <button 
                disabled={step === 2 && (selectedHour === null || selectedMinute === null)}
                onClick={() => setStep(step + 1)} 
                className="w-full py-7 md:py-10 bg-ruby text-white rounded-[35px] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl disabled:opacity-20 transition-all active:scale-95 flex items-center justify-center gap-6"
              >
                Prosseguir <Icons.ChevronRight />
              </button>
            ) : (
              <button 
                onClick={handleConfirm} 
                disabled={isProcessing}
                className="w-full py-7 md:py-10 bg-onyx dark:bg-white text-white dark:text-onyx rounded-[35px] font-black uppercase tracking-[0.6em] text-[11px] shadow-2xl hover:bg-ruby hover:text-white transition-all flex items-center justify-center gap-6"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sincronizando Reserva...
                  </div>
                ) : 'Confirmar Serviço Elite'}
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
