
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  is_elite: boolean;
}

interface GlobalChatProps {
  user: User | null;
  forcedOpen?: boolean;
  onForcedClose?: () => void;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ user, forcedOpen, onForcedClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Carregar Histórico e Assinar Canal Real-time
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, 
          content, 
          created_at, 
          sender_id,
          profiles:sender_id (full_name, role)
        `)
        .eq('is_global', true)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          sender_id: m.sender_id,
          sender_name: m.profiles?.full_name || "Membro Elite",
          content: m.content,
          created_at: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_elite: m.profiles?.role === 'ADMIN' || m.profiles?.role === 'PROFESSIONAL'
        })));
      }
    };

    fetchHistory();

    // Inscrição Realtime
    const channel = supabase.channel('global-chat-room')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: 'is_global=eq.true'
      }, async (payload) => {
        // Buscar dados do perfil do remetente para a nova mensagem
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', payload.new.sender_id)
          .single();

        const newMessage: ChatMessage = {
          id: payload.new.id,
          sender_id: payload.new.sender_id,
          sender_name: profile?.full_name || "Membro Elite",
          content: payload.new.content,
          created_at: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_elite: profile?.role === 'ADMIN' || profile?.role === 'PROFESSIONAL'
        };
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (forcedOpen) setIsOpen(true);
  }, [forcedOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const contentToSend = input;
    setInput(''); // Limpeza otimista

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      content: contentToSend,
      is_global: true
    });

    if (error) console.error("Erro ao transmitir sinal:", error);
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
                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Live Sync Ativo</p>
                 </div>
              </div>
              <button onClick={() => {setIsOpen(false); onForcedClose?.();}} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">✕</button>
           </header>

           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-4 ${msg.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl bg-ruby/10 flex items-center justify-center font-bold text-ruby border border-ruby/10 shrink-0`}>
                      {msg.sender_name.charAt(0)}
                    </div>
                    <div className={`max-w-[75%] space-y-1 ${msg.sender_id === user?.id ? 'items-end' : ''}`}>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-quartz">{msg.sender_name}</span>
                          {msg.is_elite && <span className="bg-gold/10 text-gold text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Elite</span>}
                       </div>
                       <div className={`p-4 rounded-3xl text-sm font-medium ${msg.sender_id === user?.id ? 'bg-ruby text-white rounded-tr-none' : 'bg-offwhite dark:bg-onyx dark:text-white rounded-tl-none border border-quartz/5'}`}>
                          {msg.content}
                       </div>
                       <span className="text-[7px] text-quartz font-bold uppercase block">{msg.created_at}</span>
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
              <button type="submit" className="w-12 h-12 bg-ruby text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                 <Icons.Message />
              </button>
           </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 md:w-20 md:h-20 bg-ruby text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(157,23,77,0.4)] hover:scale-110 active:scale-95 transition-all pointer-events-auto relative"
      >
        <Icons.Message />
      </button>
    </div>
  );
};

export default GlobalChat;
