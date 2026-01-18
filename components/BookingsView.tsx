
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
  onReschedule: (booking: Booking) => void;
}

const BookingsView: React.FC<BookingsViewProps> = ({ bookings, onUpdateStatus, onReschedule }) => {
  const [activeFilter, setActiveFilter] = useState<'active' | 'completed'>('active');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    if (confirm("Deseja remover este ritual da sua agenda? Esta ação é irreversível.")) {
      setProcessingId(id);
      // Pequeno delay para efeito visual de processamento de luxo
      setTimeout(() => {
        onUpdateStatus(id, AppointmentStatus.CANCELLED);
        setProcessingId(null);
      }, 800);
    }
  };

  const filteredBookings = bookings.filter(b => 
    activeFilter === 'active' 
      ? (b.status === AppointmentStatus.CONFIRMED || b.status === AppointmentStatus.PENDING) 
      : (b.status === AppointmentStatus.COMPLETED || b.status === AppointmentStatus.CANCELLED)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in py-10 px-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-4xl md:text-7xl font-serif font-black text-onyx dark:text-offwhite leading-none tracking-tighter">
            Minha <span className="text-ruby italic font-normal">Agenda.</span>
          </h2>
          <p className="text-stone-500 font-medium tracking-widest text-[10px] uppercase">Controle total dos seus agendamentos</p>
        </div>
        
        <div className="bg-white dark:bg-darkCard p-2 rounded-full border border-quartz/10 shadow-sm flex shrink-0">
          <button 
            onClick={() => setActiveFilter('active')}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'active' ? 'bg-ruby text-white shadow-lg' : 'text-quartz hover:text-onyx'}`}
          >
            Ativos ({bookings.filter(b => b.status === AppointmentStatus.CONFIRMED || b.status === AppointmentStatus.PENDING).length})
          </button>
          <button 
            onClick={() => setActiveFilter('completed')}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'completed' ? 'bg-ruby text-white shadow-lg' : 'text-quartz hover:text-onyx'}`}
          >
            Histórico
          </button>
        </div>
      </header>

      {/* GRELHA DE AGENDAMENTOS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-32">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(b => (
            <div key={b.id} className="bg-white dark:bg-darkCard p-6 rounded-[45px] luxury-shadow border border-quartz/10 flex flex-col justify-between gap-6 group hover:border-ruby transition-all animate-fade-in relative overflow-hidden">
              {processingId === b.id && (
                <div className="absolute inset-0 bg-onyx/40 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-ruby border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <div className="space-y-4 text-center">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all ${b.status === AppointmentStatus.COMPLETED ? 'bg-emerald/10 text-emerald' : 'bg-ruby/5 text-ruby group-hover:bg-ruby group-hover:text-white'}`}>
                  {b.status === AppointmentStatus.COMPLETED ? <Icons.Star filled /> : <Icons.Calendar />}
                </div>
                <div>
                  <p className="text-[7px] font-black text-stone-400 uppercase tracking-widest mb-1 truncate">{b.providerName}</p>
                  <h4 className="text-base font-serif font-black dark:text-white truncate italic">{b.serviceName}</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold dark:text-quartz">{b.date}</p>
                  <p className="text-xs font-black text-ruby">{b.time}</p>
                  <p className="text-[9px] font-bold text-gold mt-2">{b.price.toLocaleString()} Kz</p>
                </div>
              </div>

              {activeFilter === 'active' && (
                <div className="flex flex-col gap-2 pt-4 border-t border-quartz/5">
                   <button 
                    onClick={() => onReschedule(b)}
                    className="w-full py-4 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-ruby hover:text-white"
                   >
                     <Icons.Clock /> Remarcar
                   </button>
                   <button 
                    onClick={() => handleCancel(b.id)}
                    className="w-full py-2 text-ruby/60 hover:text-ruby rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                   >
                     Excluir Reserva
                   </button>
                </div>
              )}
              
              {activeFilter === 'completed' && (
                <div className="pt-4 border-t border-quartz/5 text-center">
                   <span className={`text-[8px] font-black uppercase tracking-widest ${b.status === AppointmentStatus.CANCELLED ? 'text-red-500' : 'text-emerald'}`}>
                     {b.status === AppointmentStatus.CANCELLED ? 'Cancelado' : 'Finalizado'}
                   </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-8 animate-fade-in flex flex-col items-center opacity-30">
            <div className="w-20 h-20 bg-quartz/10 rounded-full flex items-center justify-center">
               <Icons.Calendar />
            </div>
            <p className="font-serif italic text-2xl">Agenda vazia.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsView;
