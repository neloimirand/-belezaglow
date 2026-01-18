
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

interface NewOrdersProps {
  orders: Order[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onPending: (id: string) => void;
  onMessage: (client: string) => void;
}

const NewOrders: React.FC<NewOrdersProps> = ({ orders, onAccept, onDecline, onPending, onMessage }) => {
  return (
    <div className="space-y-8 animate-fade-in px-2">
      <header className="flex flex-col gap-2">
        <p className="text-ruby text-[9px] font-black uppercase tracking-[0.4em]">Radar de Oportunidades</p>
        <h3 className="text-4xl font-serif font-black dark:text-white italic tracking-tighter">
          Novos <span className="text-ruby">Pedidos.</span>
        </h3>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-quartz/20 rounded-[45px] opacity-30">
            <p className="font-serif italic text-2xl">Radar Silencioso.</p>
            <p className="text-[9px] font-black uppercase mt-2">Novos rituais aparecerão aqui instantaneamente.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-darkCard p-8 rounded-[45px] luxury-shadow border border-ruby/20 relative overflow-hidden group transition-all hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ruby/5 rounded-full -mr-16 -mt-16 animate-pulse"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-ruby text-white rounded-2xl flex items-center justify-center font-serif font-black text-2xl shadow-lg shrink-0">
                         {order.client.charAt(0)}
                      </div>
                      <div>
                         <h4 className="text-xl font-serif font-black dark:text-white italic leading-none">{order.client}</h4>
                         <p className="text-ruby text-[9px] font-black uppercase tracking-widest mt-1">Solicitou agora mesmo</p>
                      </div>
                   </div>
                </div>

                <div className="bg-offwhite dark:bg-onyx/50 p-5 rounded-3xl border border-quartz/10">
                   <p className="text-[10px] font-black text-quartz uppercase tracking-widest mb-1">Ritual Escolhido</p>
                   <p className="font-bold text-base dark:text-white uppercase truncate">{order.service}</p>
                   <div className="flex justify-between items-end mt-4 pt-4 border-t border-quartz/5">
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-stone-400">{order.date} • {order.time}</p>
                         <p className="text-xl font-serif font-black text-emerald">{order.price.toLocaleString()} Kz</p>
                      </div>
                      <button onClick={() => onMessage(order.client)} className="w-12 h-12 bg-white dark:bg-onyx rounded-2xl flex items-center justify-center text-quartz hover:text-ruby shadow-sm border border-quartz/10 transition-all active:scale-90">
                         <Icons.Message />
                      </button>
                   </div>
                </div>

                {/* BOTÕES DE AÇÃO - TRIPLE ACTION LAYOUT */}
                <div className="flex gap-2 pt-2">
                   <button 
                    onClick={() => onDecline(order.id)}
                    className="flex-1 py-4 border border-ruby/30 text-ruby rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all active:scale-95"
                    title="Recusar Definitivamente"
                   >
                     Recusar
                   </button>
                   <button 
                    onClick={() => onPending(order.id)}
                    className="flex-1 py-4 border border-gold/40 text-gold rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all active:scale-95"
                    title="Mover para Em Pendência"
                   >
                     Pendente
                   </button>
                   <button 
                    onClick={() => onAccept(order.id)}
                    className="flex-[2] py-4 bg-ruby text-white rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-xl shadow-ruby/20 hover:brightness-110 transition-all active:scale-95"
                   >
                     Aceitar Ritual
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewOrders;
