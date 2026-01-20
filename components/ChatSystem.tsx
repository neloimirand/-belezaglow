
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  text: string;
  timestamp: string;
  type: 'text' | 'system';
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  online: boolean;
}

interface ChatSystemProps {
  user: User | null;
  onNavigateToBooking?: (providerId: string) => void;
  initialContact?: {id: string, name: string} | null;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ user, initialContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'support_id', name: 'Suporte Glow Elite', role: 'Concierge', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200', lastMessage: 'Como posso ajudar hoje?', online: true },
  ]);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gatilho de negociação externa (da Agenda para o Chat)
  useEffect(() => {
    if (initialContact) {
      const existing = contacts.find(c => c.id === initialContact.id);
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newContact: Contact = {
          id: initialContact.id,
          name: initialContact.name,
          role: 'Membro Elite (Cliente)',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(initialContact.name)}&background=9D174D&color=fff`,
          lastMessage: 'Aguardando negociação via SMS...',
          online: true
        };
        setContacts(prev => [newContact, ...prev]);
        setActiveConvId(newContact.id);
      }
      setTimeout(() => inputRef.current?.focus(), 600);
    }
  }, [initialContact]);

  // Sync de Mensagens em Tempo Real
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

    // Filtro anti-duplicidade: ignora mensagens cujo remetente seja o usuário atual
    const channel = supabase.channel(`private-chat-${activeConvId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const m = payload.new;
        if (m.sender_id !== user.id && m.receiver_id === user.id && m.sender_id === activeConvId) {
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConvId) return;

    const content = inputText;
    const currentId = user.id;
    const currentTarget = activeConvId;
    setInputText('');

    // Adição otimista local (Rápido e Fluido)
    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, {
        id: tempId,
        sender_id: currentId,
        text: content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
    }]);

    // Registro persistente
    await supabase.from('messages').insert({
      sender_id: currentId,
      receiver_id: currentTarget,
      content: content,
      is_global: false
    });
  };

  const activeContact = contacts.find(c => c.id === activeConvId);

  return (
    <div className="flex h-[75vh] md:h-[85vh] bg-white dark:bg-darkCard rounded-[40px] md:rounded-[60px] luxury-shadow border border-quartz/10 overflow-hidden animate-fade-in mx-auto w-full max-w-6xl">
      
      {/* LISTA DE CONTATOS */}
      <aside className={`w-full md:w-80 border-r border-quartz/10 bg-offwhite dark:bg-onyx/50 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
         <header className="p-8 border-b border-quartz/10">
            <h3 className="text-xl font-serif font-black dark:text-white italic">Mensagens.</h3>
            <p className="text-[8px] font-black uppercase text-quartz tracking-widest mt-1">Sinais em Tempo Real</p>
         </header>
         <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {contacts.map(contact => (
               <button 
                key={contact.id}
                onClick={() => setActiveConvId(contact.id)}
                className={`w-full p-4 rounded-[30px] flex items-center gap-4 transition-all ${activeConvId === contact.id ? 'bg-white dark:bg-darkCard shadow-xl border border-ruby/20 scale-105' : 'hover:bg-white/50 dark:hover:bg-white/5'}`}
               >
                  <div className="relative shrink-0">
                     <img src={contact.avatar} className="w-12 h-12 rounded-2xl object-cover border border-quartz/10" alt={contact.name} />
                     {contact.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald rounded-full border-2 border-white animate-pulse"></div>}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                     <h4 className="font-bold text-sm dark:text-white truncate leading-tight">{contact.name}</h4>
                     <p className="text-[9px] text-stone-500 font-medium truncate uppercase tracking-tighter">{contact.role}</p>
                  </div>
               </button>
            ))}
         </div>
      </aside>

      {/* ÁREA DE CHAT */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-darkCard overflow-hidden ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConvId && activeContact ? (
          <>
            <header className="p-6 border-b border-quartz/5 flex justify-between items-center bg-white/90 dark:bg-darkCard/90 backdrop-blur-xl z-10">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveConvId(null)} className="md:hidden w-10 h-10 rounded-xl bg-offwhite dark:bg-onyx flex items-center justify-center">
                    <div className="rotate-180"><Icons.ChevronRight /></div>
                  </button>
                  <img src={activeContact.avatar} className="w-10 h-10 rounded-xl object-cover shadow-lg" alt={activeContact.name} />
                  <div>
                    <h4 className="font-serif font-black text-lg dark:text-white italic leading-none">{activeContact.name}</h4>
                    <span className="text-[8px] font-black uppercase text-emerald tracking-widest flex items-center gap-1 mt-1">
                      <div className="w-1 h-1 bg-emerald rounded-full animate-ping"></div> Sessão Privada Ativa
                    </span>
                  </div>
               </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-hide bg-offwhite/30 dark:bg-onyx/10">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-quartz/10 rounded-full flex items-center justify-center"><Icons.Message /></div>
                    <p className="font-serif italic text-lg">Inicie o ritual de negociação.</p>
                 </div>
               ) : (
                 messages.map((msg) => (
                   <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'} animate-fade-in`}>
                      <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[30px] text-sm font-medium shadow-sm transition-all ${
                        msg.sender_id === user?.id 
                          ? 'bg-ruby text-white rounded-tr-none' 
                          : 'bg-white dark:bg-onyx dark:text-white border border-quartz/5 rounded-tl-none'
                      }`}>
                         {msg.text}
                      </div>
                      <span className="text-[7px] font-black text-quartz mt-2 mx-3 uppercase tracking-widest">{msg.timestamp}</span>
                   </div>
                 ))
               )}
            </div>

            <footer className="p-6 md:p-8 border-t border-quartz/10 bg-white dark:bg-darkCard shrink-0">
               <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escrever proposta de SMS..." 
                    className="flex-1 bg-offwhite dark:bg-onyx rounded-[25px] py-5 px-8 outline-none dark:text-white font-bold text-sm shadow-inner border border-transparent focus:border-ruby transition-all"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="w-16 h-16 bg-ruby text-white rounded-[22px] flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-30"
                  >
                     <Icons.Message />
                  </button>
               </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 space-y-6">
             <div className="w-24 h-24 bg-quartz/5 rounded-full flex items-center justify-center scale-150">
                <Icons.Message />
             </div>
             <div className="text-center space-y-2">
                <p className="font-serif italic text-3xl font-black">Central de SMS.</p>
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Selecione uma negociação activa</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatSystem;
