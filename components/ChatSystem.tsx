
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  text: string;
  timestamp: string;
  type: 'text' | 'system';
}

interface ChatSystemProps {
  user: User | null;
  onNavigateToBooking: (providerId: string) => void;
  initialClientName?: string | null;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ user, initialClientName }) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Monitorar Mensagens Privadas
  useEffect(() => {
    if (!user || !activeConvId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeConvId}),and(sender_id.eq.${activeConvId},receiver_id.eq.${user.id})`)
        .eq('is_global', false)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data.map(m => ({
          id: m.id,
          sender_id: m.sender_id,
          text: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        })));
      }
    };

    fetchMessages();

    const channel = supabase.channel(`private-chat-${activeConvId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        const m = payload.new;
        if ((m.sender_id === user.id && m.receiver_id === activeConvId) || 
            (m.sender_id === activeConvId && m.receiver_id === user.id)) {
          setMessages(prev => [...prev, {
            id: m.id,
            sender_id: m.sender_id,
            text: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
          }]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConvId) return;

    const content = inputText;
    setInputText('');

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: activeConvId,
      content: content,
      is_global: false
    });
  };

  return (
    <div className="flex h-[75vh] md:h-[85vh] bg-white dark:bg-darkCard rounded-[35px] md:rounded-[50px] luxury-shadow border border-quartz/10 overflow-hidden animate-fade-in mx-auto w-full max-w-6xl">
      <main className="flex-1 flex flex-col bg-white dark:bg-darkCard overflow-hidden">
        {activeConvId ? (
          <>
            <header className="p-4 md:p-8 border-b border-quartz/5 flex justify-between items-center bg-white/90 dark:bg-darkCard/90 backdrop-blur-xl z-10">
               <div className="flex items-center gap-3">
                  <h4 className="font-serif font-black text-base md:text-lg dark:text-white italic">Conversa Privada</h4>
                  <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse"></div>
               </div>
               <button onClick={() => setActiveConvId(null)} className="text-quartz hover:text-ruby">Fechar</button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 scrollbar-hide">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-[25px] text-sm ${msg.sender_id === user?.id ? 'bg-ruby text-white rounded-tr-none' : 'bg-offwhite dark:bg-onyx dark:text-white border border-quartz/5 rounded-tl-none'}`}>
                       {msg.text}
                    </div>
                    <span className="text-[7px] text-quartz mt-1 mx-2">{msg.timestamp}</span>
                 </div>
               ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 md:p-8 border-t border-quartz/5 flex gap-3">
               <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Negociar ritual..." 
                className="flex-1 bg-offwhite dark:bg-onyx rounded-2xl px-6 py-3 outline-none dark:text-white text-sm"
               />
               <button type="submit" className="w-12 h-12 bg-ruby text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Icons.Message />
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 space-y-4">
             <Icons.Message />
             <p className="font-serif italic text-xl">Inicie uma conversa no Radar.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatSystem;
