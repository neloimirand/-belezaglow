
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { User, UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'ai' | 'image' | 'system';
}

interface Conversation {
  id: string;
  participantName: string;
  participantPhoto: string;
  participantRole: UserRole;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  isAi?: boolean;
}

interface ChatSystemProps {
  user: User | null;
  onNavigateToBooking: (providerId: string) => void;
  initialClientName?: string | null;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ user, onNavigateToBooking, initialClientName }) => {
  const [activeConvId, setActiveConvId] = useState<string>('ai-concierge');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'ai-concierge',
      participantName: 'Glow AI Concierge',
      participantPhoto: 'https://cdn-icons-png.flaticon.com/512/3138/3138316.png',
      participantRole: UserRole.ADMIN,
      lastMessage: 'Como posso elevar seu brilho hoje?',
      unreadCount: 0,
      isAi: true,
      messages: [
        { id: 'm1', senderId: 'ai', text: 'Olá! Sou seu Concierge de Elite. Posso ajudar a encontrar o melhor salão em Luanda ou dar dicas de cuidados capilares. O que deseja?', timestamp: 'Agora', type: 'ai' }
      ]
    },
    {
      id: 'conv1',
      participantName: 'L’Atelier Beauty',
      participantPhoto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200',
      participantRole: UserRole.SALON,
      lastMessage: 'Seu agendamento foi confirmado para amanhã.',
      unreadCount: 0,
      messages: [
        { id: 'm2', senderId: 'conv1', text: 'Boa tarde! Recebemos sua solicitação de Corte Sculpting.', timestamp: '14:20', type: 'text' },
        { id: 'm3', senderId: 'conv1', text: 'Seu agendamento foi confirmado para amanhã.', timestamp: '14:21', type: 'text' }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // LOGICA PARA ABRIR CHAT DIRETO VIA NOME
  useEffect(() => {
    if (initialClientName) {
      const existing = conversations.find(c => c.participantName === initialClientName);
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newId = `sms-${Date.now()}`;
        const newConv: Conversation = {
          id: newId,
          participantName: initialClientName,
          participantPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(initialClientName)}&background=9D174D&color=fff`,
          participantRole: UserRole.CLIENT,
          lastMessage: 'Canal SMS Direto Aberto.',
          unreadCount: 0,
          messages: [
            { id: `sys-${Date.now()}`, senderId: 'system', text: `Canal de negociação direta aberto com ${initialClientName}. Você pode ajustar horários ou serviços aqui via SMS.`, timestamp: 'Agora', type: 'system' }
          ]
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newId);
      }
    }
  }, [initialClientName]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    const updatedConvs = conversations.map(c => 
      c.id === activeConvId ? { ...c, messages: [...c.messages, userMessage], lastMessage: inputText } : c
    );
    
    setConversations(updatedConvs);
    setInputText('');

    if (activeConv.isAi) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: inputText,
          config: {
            systemInstruction: "Você é o Glow AI Concierge, um assistente de luxo para um app de beleza em Angola. Responda de forma elegante, útil e em português de Angola."
          }
        });

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          text: response.text || 'Lamento, a conexão VIP falhou temporariamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'ai'
        };

        setConversations(prev => prev.map(c => 
          c.id === 'ai-concierge' ? { ...c, messages: [...c.messages, aiMessage], lastMessage: aiMessage.text } : c
        ));
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex h-[75vh] md:h-[85vh] bg-white dark:bg-darkCard rounded-[35px] md:rounded-[50px] luxury-shadow border border-quartz/10 overflow-hidden animate-fade-in mx-auto w-full max-w-6xl">
      
      {/* LISTA DE CONVERSAS (SMS CHANNELS) */}
      <aside className={`w-full md:w-[320px] lg:w-[380px] border-r border-quartz/5 flex flex-col bg-offwhite dark:bg-onyx/50 ${activeConvId && activeConvId !== '' ? 'hidden md:flex' : 'flex'}`}>
         <header className="p-6 md:p-8 space-y-4">
            <h3 className="text-2xl font-serif font-black dark:text-white italic">Canais SMS.</h3>
            <div className="relative">
               <div className="absolute inset-y-0 left-4 flex items-center text-quartz"><Icons.Search /></div>
               <input type="text" placeholder="Buscar canal..." className="w-full bg-white dark:bg-darkCard border border-quartz/10 rounded-2xl py-3 pl-12 pr-4 text-xs outline-none focus:border-ruby transition-all shadow-sm" />
            </div>
         </header>
         <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-10 space-y-2">
            {conversations.map(conv => (
               <button 
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-4 md:p-5 rounded-[25px] md:rounded-[30px] flex items-center gap-3 md:gap-4 transition-all ${activeConvId === conv.id ? 'bg-ruby text-white shadow-xl scale-[1.02]' : 'hover:bg-ruby/5 dark:text-white'}`}
               >
                  <div className="relative shrink-0">
                     <img src={conv.participantPhoto} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border-2 border-white/20" />
                     {conv.unreadCount > 0 && activeConvId !== conv.id && (
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-onyx text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">{conv.unreadCount}</div>
                     )}
                  </div>
                  <div className="text-left overflow-hidden flex-1">
                     <p className={`text-[11px] md:text-xs font-black truncate uppercase tracking-widest ${activeConvId === conv.id ? 'text-white' : ''}`}>{conv.participantName}</p>
                     <p className={`text-[9px] md:text-[10px] truncate opacity-60 ${activeConvId === conv.id ? 'text-white/80' : 'text-stone-500'}`}>{conv.lastMessage}</p>
                  </div>
               </button>
            ))}
         </div>
      </aside>

      {/* JANELA DE CHAT (MENSAGEM SMS) */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-darkCard overflow-hidden ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            <header className="p-4 md:p-8 border-b border-quartz/5 flex justify-between items-center bg-white/90 dark:bg-darkCard/90 backdrop-blur-xl sticky top-0 z-10">
               <div className="flex items-center gap-3 md:gap-5 overflow-hidden">
                  <button onClick={() => setActiveConvId('')} className="md:hidden w-10 h-10 flex items-center justify-center bg-offwhite dark:bg-onyx rounded-xl transition-transform active:scale-90">
                    <div className="rotate-180 scale-110"><Icons.ChevronRight /></div>
                  </button>
                  <img src={activeConv.participantPhoto} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-md shrink-0" />
                  <div className="overflow-hidden">
                     <h4 className="font-serif font-black text-base md:text-lg dark:text-white italic truncate">{activeConv.participantName}</h4>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse"></div>
                        <span className="text-[7px] md:text-[8px] font-black uppercase text-quartz tracking-widest">Canal de SMS Direto</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2 shrink-0">
                  <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-offwhite dark:bg-onyx rounded-xl text-quartz hover:text-ruby transition-colors"><Icons.Settings /></button>
               </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scrollbar-hide bg-offwhite/30 dark:bg-onyx/5">
               {activeConv.messages.map((msg, idx) => (
                 <div key={msg.id} className={`flex flex-col ${msg.senderId === (user?.id || 'me') ? 'items-end' : 'items-start'} animate-fade-in`} style={{ animationDelay: `${idx * 30}ms` }}>
                    {msg.type === 'system' ? (
                       <div className="w-full flex justify-center my-4">
                          <div className="bg-gold/10 text-gold text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-gold/20">
                             {msg.text}
                          </div>
                       </div>
                    ) : (
                      <>
                        <div className={`max-w-[88%] md:max-w-[70%] p-4 md:p-6 rounded-[25px] md:rounded-[35px] text-xs md:text-sm font-medium leading-relaxed shadow-sm ${
                          msg.senderId === (user?.id || 'me') 
                            ? 'bg-ruby text-white rounded-tr-none shadow-ruby/10' 
                            : msg.type === 'ai' 
                              ? 'bg-gold/10 text-onyx dark:text-white border border-gold/20 rounded-tl-none italic'
                              : 'bg-white dark:bg-onyx dark:text-white border border-quartz/5 rounded-tl-none'
                        }`}>
                           {msg.text}
                        </div>
                        <span className="text-[6px] md:text-[7px] font-black uppercase text-quartz mt-1.5 mx-3">{msg.timestamp}</span>
                      </>
                    )}
                 </div>
               ))}
               {isTyping && (
                 <div className="flex gap-1.5 p-3 bg-white dark:bg-onyx rounded-2xl w-16 justify-center animate-pulse border border-quartz/5">
                    <div className="w-1 h-1 bg-ruby rounded-full"></div>
                    <div className="w-1 h-1 bg-ruby rounded-full opacity-60"></div>
                    <div className="w-1 h-1 bg-ruby rounded-full opacity-30"></div>
                 </div>
               )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 md:p-8 border-t border-quartz/5 flex gap-3 items-center bg-white dark:bg-darkCard">
               <button type="button" className="w-11 h-11 md:w-14 md:h-14 shrink-0 flex items-center justify-center bg-offwhite dark:bg-onyx rounded-2xl text-quartz hover:text-ruby transition-all active:scale-90">
                 <Icons.Plus />
               </button>
               <div className="flex-1 relative flex items-center">
                  <input 
                   type="text" 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="Enviar mensagem para o cliente..." 
                   className="w-full bg-offwhite dark:bg-onyx rounded-2xl px-5 md:px-8 py-3 md:py-4 outline-none dark:text-white text-xs md:text-sm font-medium border border-quartz/10 focus:border-ruby transition-all shadow-inner"
                  />
               </div>
               <button type="submit" className="w-11 h-11 md:w-14 md:h-14 shrink-0 bg-ruby text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition-all">
                  <Icons.Message />
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 space-y-6">
             <div className="w-20 h-20 bg-offwhite dark:bg-onyx rounded-full flex items-center justify-center text-ruby"><Icons.Message /></div>
             <p className="font-serif italic text-xl font-black">Selecione um canal de SMS.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatSystem;
