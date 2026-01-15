
import React, { useState } from 'react';
import { Icons } from '../constants';
import { AppointmentStatus } from '../types';

interface Booking {
  id: string;
  providerName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: AppointmentStatus;
}

interface BookingsViewProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const BookingsView: React.FC<BookingsViewProps> = ({ bookings, onUpdateStatus }) => {
  const [activeFilter, setActiveFilter] = useState<'active' | 'completed'>('active');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleComplete = (id: string) => {
    setProcessingId(id);
    // Simula um pequeno delay para feedback visual
    setTimeout(() => {
      onUpdateStatus(id, AppointmentStatus.COMPLETED);
      setProcessingId(null);
    }, 600);
  };

  const filteredBookings = bookings.filter(b => 
    activeFilter === 'active' ? b.status !== AppointmentStatus.COMPLETED : b.status === AppointmentStatus.COMPLETED
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-10">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-onyx dark:text-offwhite leading-none">
            Minha <span className="text-ruby italic font-normal">Agenda.</span>
          </h2>
          <p className="text-quartz font-medium">Gerencie seus momentos de brilho reservados.</p>
        </div>
        
        <div className="bg-white dark:bg-darkCard p-1.5 rounded-full border border-quartz/10 shadow-sm flex shrink-0">
          <button 
            onClick={() => setActiveFilter('active')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'active' ? 'bg-ruby text-white shadow-lg' : 'text-quartz hover:text-onyx'}`}
          >
            Próximos
          </button>
          <button 
            onClick={() => setActiveFilter('completed')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'completed' ? 'bg-ruby text-white shadow-lg' : 'text-quartz hover:text-onyx'}`}
          >
            Histórico
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(b => (
            <div key={b.id} className="bg-white dark:bg-darkCard p-8 md:p-10 rounded-[40px] luxury-shadow border border-quartz/10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-ruby transition-all animate-fade-in">
              <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row w-full md:w-auto">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${b.status === AppointmentStatus.COMPLETED ? 'bg-emerald/10 text-emerald' : 'bg-ruby/5 text-ruby group-hover:bg-ruby group-hover:text-white'}`}>
                  {b.status === AppointmentStatus.COMPLETED ? <Icons.Star filled /> : <Icons.Calendar />}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-ruby uppercase tracking-[0.3em]">{b.providerName}</p>
                  <h4 className="text-2xl font-serif font-black dark:text-white">{b.serviceName}</h4>
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                     <span className="text-xs font-bold dark:text-quartz">{b.date} às {b.time}</span>
                     <span className="w-1.5 h-1.5 bg-quartz rounded-full"></span>
                     <span className="text-xs font-black text-gold">{b.price.toLocaleString()} Kz</span>
                  </div>
                </div>
              </div>

              {b.status !== AppointmentStatus.COMPLETED ? (
                <button 
                  onClick={() => handleComplete(b.id)}
                  disabled={processingId === b.id}
                  className="w-full md:w-auto px-10 py-5 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {processingId === b.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="w-2 h-2 bg-white dark:bg-emerald rounded-full animate-pulse" />
                  )}
                  {processingId === b.id ? 'Concluindo...' : 'Marcar como Concluído'}
                </button>
              ) : (
                <div className="flex items-center gap-3 px-8 py-4 bg-emerald/5 border border-emerald/10 rounded-2xl text-emerald font-black text-[10px] uppercase tracking-widest">
                  <div className="w-5 h-5 flex items-center justify-center"><Icons.Star filled /></div>
                  Serviço Realizado
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-32 text-center space-y-8 animate-fade-in flex flex-col items-center">
            <div className="w-24 h-24 bg-quartz/5 dark:bg-white/5 rounded-full flex items-center justify-center text-quartz/30">
               <Icons.Calendar />
            </div>
            <div className="space-y-2">
               <p className="font-serif italic text-2xl text-quartz">Nenhum registro encontrado.</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-quartz/50">Seu histórico de brilho aparecerá aqui.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsView;
