
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { User } from '../types';

interface ChatMessage {
  id: string;
  senderName: string;
  senderPhoto: string;
  content: string;
  timestamp: string;
  isElite: boolean;
}

interface GlobalChatProps {
  user: User | null;
  forcedOpen?: boolean;
  onForcedClose?: () => void;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ user, forcedOpen, onForcedClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderName: 'Neloi (ADM)', senderPhoto: 'https://i.pravatar.cc/150?u=neloi', content: 'Bem-vindos ao Chat Global da Beleza Glow! O espaço oficial da elite.', timestamp: '10:00', isElite: true },
    { id: '2', senderName: 'Ana Luanda', senderPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', content: 'Bom dia! Alguma recomendação de penteado para o evento de hoje?', timestamp: '10:05', isElite: true }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forcedOpen) setIsOpen(true);
  }, [forcedOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onForcedClose?.();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: user.name,
      senderPhoto: user.photoUrl || 'https://i.pravatar.cc/150',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isElite: user.role === 'ADMIN' || user.role === 'PROFESSIONAL'
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[2000] flex flex-col items-end pointer-events-none">
      
      {isOpen && (
        <div className="w-[90vw] md:w-[400px] h-[550px] bg-white dark:bg-darkCard rounded-[40px] luxury-shadow border border-quartz/10 flex flex-col overflow-hidden mb-6 animate-fade-in pointer-events-auto">
           <header className="bg-ruby p-8 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Icons.Message /></div>
                 <div>
                    <h4 className="text-sm font-black uppercase tracking-widest">Glow Community</h4>
                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Membros Online: 242</p>
                 </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
           </header>

           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-4 ${msg.senderName === user?.name ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.senderPhoto} className="w-10 h-10 rounded-xl object-cover border border-quartz/10" />
                    <div className={`max-w-[75%] space-y-1 ${msg.senderName === user?.name ? 'items-end' : ''}`}>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-quartz">{msg.senderName}</span>
                          {msg.isElite && <span className="bg-gold/10 text-gold text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Elite</span>}
                       </div>
                       <div className={`p-4 rounded-3xl text-sm font-medium ${msg.senderName === user?.name ? 'bg-ruby text-white rounded-tr-none' : 'bg-offwhite dark:bg-onyx dark:text-white rounded-tl-none border border-quartz/5'}`}>
                          {msg.content}
                       </div>
                       <span className="text-[7px] text-quartz font-bold uppercase block">{msg.timestamp}</span>
                    </div>
                 </div>
              ))}
           </div>

           <form onSubmit={handleSendMessage} className="p-6 bg-offwhite dark:bg-onyx border-t border-quartz/10 shrink-0 flex gap-3 items-center">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Diga algo à elite..."
                className="flex-1 bg-white dark:bg-darkCard p-4 rounded-2xl outline-none text-xs font-medium dark:text-white border border-quartz/10 focus:border-ruby transition-all"
              />
              <button type="submit" className="w-12 h-12 bg-ruby text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition-all">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
           </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 md:w-20 md:h-20 bg-ruby text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(157,23,77,0.4)] hover:scale-110 active:scale-95 transition-all pointer-events-auto relative"
      >
        <Icons.Message />
        {!isOpen && <div className="absolute top-0 right-0 w-6 h-6 bg-gold text-onyx text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">2</div>}
      </button>
    </div>
  );
};

export default GlobalChat;
