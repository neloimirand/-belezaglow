
import React, { useState, useMemo } from 'react';
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

interface AgendaProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onReschedule: (booking: Booking) => void;
}

const Agenda: React.FC<AgendaProps> = ({ bookings, onUpdateStatus, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [activeFilter, setActiveFilter] = useState<'active' | 'history'>('active');

  // Gera os últimos 7 dias e próximos 14 dias para o seletor horizontal
  const dateStrip = useMemo(() => {
    const dates = [];
    for (let i = -3; i < 12; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toLocaleDateString('pt-BR'),
        day: d.getDate(),
        weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        month: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
      });
    }
    return dates;
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const isHistory = b.status === AppointmentStatus.COMPLETED || b.status === AppointmentStatus.CANCELLED;
      if (activeFilter === 'history') return isHistory;
      return !isHistory && b.date === selectedDate;
    });
  }, [bookings, selectedDate, activeFilter]);

  const handleDelete = (id: string) => {
    if (confirm("Deseja remover permanentemente este ritual da sua agenda de elite?")) {
      onUpdateStatus(id, AppointmentStatus.CANCELLED);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-40">
      
      {/* HEADER EDITORIAL */}
      <header className="space-y-6 px-4">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Glow Private Concierge</p>
            <h2 className="text-5xl md:text-8xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
              Minha <span className="text-gold">Agenda.</span>
            </h2>
          </div>
          <div className="flex bg-white dark:bg-darkCard p-1.5 rounded-2xl border border-quartz/10 luxury-shadow">
             <button 
              onClick={() => setActiveFilter('active')}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'active' ? 'bg-ruby text-white shadow-lg' : 'text-quartz'}`}
             >Atuais</button>
             <button 
              onClick={() => setActiveFilter('history')}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'history' ? 'bg-ruby text-white shadow-lg' : 'text-quartz'}`}
             >Histórico</button>
          </div>
        </div>

        {/* DATE STRIP SELECTOR */}
        {activeFilter === 'active' && (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2 -mx-4 md:mx-0">
            {dateStrip.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(d.full)}
                className={`min-w-[85px] h-28 rounded-[35px] flex flex-col items-center justify-center transition-all border-2 shrink-0 ${
                  selectedDate === d.full
                    ? 'bg-ruby text-white border-ruby shadow-[0_15px_35px_rgba(157,23,77,0.3)] scale-110'
                    : 'bg-white dark:bg-darkCard text-onyx dark:text-white border-quartz/5 hover:border-ruby/20'
                }`}
              >
                <span className="text-[8px] uppercase font-black opacity-50 mb-1">{d.weekday}</span>
                <span className="text-2xl font-serif font-black">{d.day}</span>
                <span className="text-[7px] uppercase font-bold opacity-40 mt-1">{d.month}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* LISTA DE RITUAIS */}
      <main className="px-4 space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <article 
              key={b.id} 
              className="bg-white dark:bg-darkCard rounded-[45px] luxury-shadow border border-quartz/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 group hover:border-ruby/30 transition-all animate-fade-in"
            >
              <div className="w-24 h-24 bg-ruby/5 rounded-[30px] flex items-center justify-center text-ruby shrink-0 group-hover:bg-ruby group-hover:text-white transition-all duration-500 shadow-inner">
                <Icons.Calendar />
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="bg-gold/10 text-gold px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">Ritual Elite</span>
                  <p className="text-[10px] font-black text-quartz uppercase tracking-widest">{b.providerName}</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-black dark:text-white italic">{b.serviceName}</h3>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <p className="text-ruby font-black text-xl">{b.time}</p>
                  <div className="w-1 h-1 bg-quartz/30 rounded-full"></div>
                  <p className="text-stone-500 font-bold text-sm uppercase">{b.price.toLocaleString()} Kz</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-quartz/5 pt-8 md:pt-0 md:pl-10">
                {activeFilter === 'active' ? (
                  <>
                    <button 
                      onClick={() => onReschedule(b)}
                      className="w-full md:w-48 py-5 bg-onyx dark:bg-white dark:text-onyx text-white rounded-[25px] text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-ruby hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      <Icons.Clock /> Remarcar
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)}
                      className="w-full py-2 text-ruby/40 hover:text-ruby text-[8px] font-black uppercase tracking-widest transition-all"
                    >
                      Excluir Reserva
                    </button>
                  </>
                ) : (
                  <div className="text-center md:text-right space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-quartz">Status Final</p>
                    <p className={`text-sm font-black uppercase tracking-widest ${b.status === AppointmentStatus.CANCELLED ? 'text-red-500' : 'text-emerald'}`}>
                      {b.status === AppointmentStatus.CANCELLED ? 'Cancelado' : 'Finalizado'}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center space-y-8 opacity-20 text-center animate-fade-in">
             <div className="w-24 h-24 bg-quartz/10 rounded-full flex items-center justify-center scale-150">
                <Icons.Calendar />
             </div>
             <div className="space-y-2">
                <p className="text-3xl font-serif italic font-black">Agenda livre para hoje.</p>
                <p className="text-[10px] font-black uppercase tracking-widest">Que tal agendar uma nova experiência?</p>
             </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Agenda;
