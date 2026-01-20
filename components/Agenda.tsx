
import React, { useState, useMemo } from 'react';
import { Icons } from '../constants';
import { AppointmentStatus, UserRole } from '../types';

interface Booking {
  id: string;
  providerId: string;
  clientId: string;
  providerName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  service: any;
  isPersonalBooking?: boolean;
  clientName?: string;
}

interface AgendaProps {
  bookings: Booking[];
  userRole?: UserRole;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
  onReschedule: (booking: Booking) => void;
  onChat: (providerName: string) => void;
  onNegotiate?: (clientId: string, clientName: string) => void;
}

const Agenda: React.FC<AgendaProps> = ({ 
  bookings, 
  userRole,
  onUpdateStatus, 
  onDelete, 
  onReschedule, 
  onChat,
  onNegotiate
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const isProvider = userRole === UserRole.SALON || userRole === UserRole.PROFESSIONAL;

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') return bookings;
    if (activeFilter === 'pending') {
      return bookings.filter(b => 
        String(b.status).toUpperCase() === 'PENDING' || 
        String(b.status).toUpperCase() === 'CONFIRMED'
      );
    }
    return bookings.filter(b => 
      String(b.status).toUpperCase() === 'COMPLETED' || 
      String(b.status).toUpperCase() === 'CANCELLED'
    );
  }, [bookings, activeFilter]);

  const getStatusLabel = (status: AppointmentStatus) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case 'PENDING': return { label: 'Em Análise', color: 'bg-gold/10 text-gold border-gold/20' };
      case 'CONFIRMED': return { label: 'Ritual Marcado', color: 'bg-emerald/10 text-emerald border-emerald/20', icon: true };
      case 'CANCELLED': return { label: 'Cancelado', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'COMPLETED': return { label: 'Finalizado', color: 'bg-ruby/10 text-ruby border-ruby/20' };
      default: return { label: s, color: 'bg-quartz/10 text-quartz' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-40 px-4">
      
      <header className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Glow Private Concierge</p>
          <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
            Meu <span className="text-gold">Compromisso.</span>
          </h2>
        </div>

        <div className="flex bg-white dark:bg-darkCard p-2 rounded-[30px] border border-quartz/10 luxury-shadow w-fit mx-auto overflow-x-auto scrollbar-hide">
           <button 
            onClick={() => setActiveFilter('all')}
            className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeFilter === 'all' ? 'bg-onyx text-white dark:bg-white dark:text-onyx shadow-lg' : 'text-quartz'}`}
           >Todos</button>
           <button 
            onClick={() => setActiveFilter('pending')}
            className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeFilter === 'pending' ? 'bg-ruby text-white shadow-lg' : 'text-quartz'}`}
           >Próximos</button>
           <button 
            onClick={() => setActiveFilter('completed')}
            className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeFilter === 'completed' ? 'bg-gold text-onyx shadow-lg' : 'text-quartz'}`}
           >Histórico</button>
        </div>
      </header>

      <main className="space-y-8">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => {
            const statusStyle = getStatusLabel(b.status);
            const isConfirmed = String(b.status).toUpperCase() === 'CONFIRMED';
            const isPending = String(b.status).toUpperCase() === 'PENDING';

            return (
              <article 
                key={b.id} 
                className="bg-white dark:bg-darkCard rounded-[45px] luxury-shadow border border-quartz/10 p-8 md:p-12 flex flex-col group hover:border-ruby/30 transition-all animate-fade-in relative overflow-hidden"
              >
                {isConfirmed && (
                   <div className="absolute top-0 right-0">
                      <div className="bg-emerald text-white px-6 py-2 rounded-bl-3xl text-[7px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Marcado
                      </div>
                   </div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className={`w-24 h-24 rounded-[30px] flex items-center justify-center shrink-0 transition-all duration-500 shadow-inner ${b.isPersonalBooking ? 'bg-gold/5 text-gold' : 'bg-ruby/5 text-ruby group-hover:bg-ruby group-hover:text-white'}`}>
                        {isConfirmed ? <div className="scale-150 text-emerald"><Icons.Star filled /></div> : <Icons.Calendar />}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0 border ${statusStyle.color}`}>
                            {statusStyle.label}
                            </span>
                            <p className="text-[10px] font-black text-quartz uppercase tracking-widest">
                               {b.isPersonalBooking ? 'Ritual que eu agendei' : 'Ritual na minha agenda'} • {b.providerName}
                            </p>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-serif font-black dark:text-white italic tracking-tighter">{b.serviceName}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <p className="text-ruby font-black text-2xl">{b.time}</p>
                            <div className="w-1.5 h-1.5 bg-quartz/20 rounded-full"></div>
                            <p className="text-stone-500 dark:text-quartz font-black text-lg">{b.date}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-quartz/5 pt-8 md:pt-0 md:pl-12">
                        <div className="text-center md:text-right space-y-1">
                            <p className="text-[10px] font-black uppercase text-quartz tracking-widest">Investimento</p>
                            <p className="text-3xl font-serif font-black text-gold">{b.price.toLocaleString()} Kz</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-quartz/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isProvider && !b.isPersonalBooking && isPending ? (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(b.id, AppointmentStatus.CONFIRMED)}
                          className="flex items-center justify-center gap-3 py-4 bg-emerald text-white rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                        >
                           Aceitar Ritual
                        </button>
                        <button 
                          onClick={() => onDelete(b.id)}
                          className="flex items-center justify-center gap-3 py-4 bg-offwhite dark:bg-onyx text-red-500 rounded-2xl text-[8px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                        >
                           Recusar
                        </button>
                        <button 
                          onClick={() => onNegotiate?.(b.clientId, b.clientName || 'Cliente')}
                          className="flex items-center justify-center gap-3 py-4 bg-onyx text-white dark:bg-white dark:text-onyx rounded-2xl text-[8px] font-black uppercase tracking-widest border border-quartz/10 hover:border-ruby transition-all shadow-sm group relative"
                        >
                           <Icons.Message /> Negociar SMS
                           {!b.isPersonalBooking && <div className="absolute -top-1 -right-1 w-3 h-3 bg-ruby rounded-full border border-white animate-ping opacity-0 group-hover:opacity-100"></div>}
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => onReschedule(b)}
                          className="flex items-center justify-center gap-3 py-4 bg-offwhite dark:bg-onyx text-onyx dark:text-white rounded-2xl text-[8px] font-black uppercase tracking-widest border border-quartz/10 hover:border-ruby transition-all shadow-sm"
                        >
                          <Icons.Clock /> Remarcar
                        </button>
                        <button 
                          onClick={() => onChat(b.providerName)}
                          className="flex items-center justify-center gap-3 py-4 bg-offwhite dark:bg-onyx text-onyx dark:text-white rounded-2xl text-[8px] font-black uppercase tracking-widest border border-quartz/10 hover:border-ruby transition-all shadow-sm"
                        >
                          <Icons.Message /> Chat Directo
                        </button>
                      </>
                    )}

                    {(!isPending && String(b.status).toUpperCase() !== 'CANCELLED' && String(b.status).toUpperCase() !== 'COMPLETED') && (
                      <button 
                        onClick={() => onUpdateStatus(b.id, AppointmentStatus.CANCELLED)}
                        className="py-4 bg-offwhite dark:bg-onyx text-red-500 rounded-2xl text-[8px] font-black uppercase tracking-widest border border-red-500/10 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                         Cancelar Ritual
                      </button>
                    )}

                    {(!isPending || b.isPersonalBooking) && (
                       <button 
                        onClick={() => onDelete(b.id)}
                        className="py-4 bg-offwhite dark:bg-onyx text-stone-400 rounded-2xl text-[8px] font-black uppercase tracking-widest border border-quartz/10 hover:bg-onyx hover:text-white dark:hover:bg-white dark:hover:text-onyx transition-all shadow-sm"
                      >
                         Limpar Registro
                      </button>
                    )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="py-32 flex flex-col items-center justify-center space-y-8 opacity-20 text-center animate-fade-in">
             <div className="w-24 h-24 bg-quartz/10 rounded-full flex items-center justify-center scale-150">
                <Icons.Calendar />
             </div>
             <p className="text-3xl font-serif italic font-black dark:text-white">Nenhum compromisso no radar.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Agenda;
