
import React from 'react';
import { Icons } from '../constants';

interface Order {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  price: number;
}

interface PendingOrdersProps {
  orders: Order[];
  onConfirm: (id: string) => void;
  onDecline: (id: string) => void;
  onReschedule: (order: Order) => void;
  onMessage: (client: string) => void;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ orders, onConfirm, onDecline, onReschedule, onMessage }) => {
  return (
    <div className="space-y-8 animate-fade-in px-2">
      <header className="flex flex-col gap-2">
        <p className="text-gold text-[9px] font-black uppercase tracking-[0.4em]">Fluxo de Confirmação</p>
        <h3 className="text-4xl font-serif font-black dark:text-white italic tracking-tighter">
          Em <span className="text-gold">Pendência.</span>
        </h3>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-quartz/20 rounded-[45px] opacity-30">
            <p className="font-serif italic text-2xl">Nada pendente.</p>
            <p className="text-[9px] font-black uppercase mt-2">Sua agenda está sincronizada.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-darkCard p-8 rounded-[45px] luxury-shadow border border-quartz/10 transition-all flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center font-black">
                        <Icons.Clock />
                      </div>
                      <div>
                        <h4 className="font-serif font-black dark:text-white italic text-lg leading-none">{order.client}</h4>
                        <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest mt-1">Aguardando Confirmação</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-black text-ruby font-mono bg-ruby/5 px-2 py-1 rounded">{order.time}</span>
                </div>

                <div className="bg-offwhite dark:bg-onyx/30 p-4 rounded-2xl space-y-2 border border-quartz/5">
                  <p className="text-[9px] font-black text-quartz uppercase tracking-widest">Ritual: {order.service}</p>
                  <p className="text-xs font-bold dark:text-white italic">Data sugerida: {order.date}</p>
                </div>

                <div className="flex gap-2">
                   <button 
                    onClick={() => onMessage(order.client)}
                    className="flex-1 py-4 bg-offwhite dark:bg-onyx text-quartz dark:text-white rounded-2xl text-[8px] font-black uppercase tracking-widest border border-quartz/10 hover:border-ruby/30 transition-all"
                   >Negociar</button>
                   <button 
                    onClick={() => onReschedule(order)}
                    className="flex-1 py-4 bg-offwhite dark:bg-onyx text-quartz dark:text-white rounded-2xl text-[8px] font-black uppercase tracking-widest border border-quartz/10 hover:border-gold/30 transition-all"
                   >Remarcar</button>
                </div>
              </div>

              {/* BOTÕES DE AÇÃO FINAL - RESTAURADOS */}
              <div className="flex gap-3 mt-8">
                 <button 
                  onClick={() => onDecline(order.id)}
                  className="flex-1 py-4 border border-ruby/30 text-ruby rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                 >
                   Cancelar
                 </button>
                 <button 
                  onClick={() => onConfirm(order.id)}
                  className="flex-[2] py-4 bg-emerald text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald/20 hover:brightness-110 transition-all active:scale-95"
                 >
                   Confirmar Ritual
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingOrders;
