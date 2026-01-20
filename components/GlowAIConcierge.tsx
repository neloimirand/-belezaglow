
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { User, ProviderProfile } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  recommendedProviderIds?: string[];
}

interface GlowAIConciergeProps {
  user: User | null;
  onSelectProvider: (p: ProviderProfile) => void;
  onNavigate: (tab: string) => void;
  onShowRoute: (p: ProviderProfile) => void;
  providers: ProviderProfile[];
}

const GlowAIConcierge: React.FC<GlowAIConciergeProps> = ({ user, onSelectProvider, onNavigate, onShowRoute, providers }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Saudações de elite, ${user?.name?.split(' ')[0] || 'Membro'}. Meu Radar Live está ativo e sincronizado com ${providers.length} especialistas em Luanda. O que deseja agendar hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const platformKnowledge = useMemo(() => {
    return {
      usuario: {
        nome: user?.name,
        localizacao_atual: userCoords || "Luanda Central",
      },
      provedores: providers.map(p => ({
        id: p.id,
        nome: p.businessName,
        local: p.location.address,
        coordenadas: { lat: p.location.latitude, lng: p.location.longitude },
        bio: p.bio,
        servicos: p.services.map(s => `${s.name} (${s.price} Kz)`)
      }))
    };
  }, [user, userCoords, providers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const parseAiResponse = (text: string) => {
    // Busca por IDs no formato [REC:id]
    const recRegex = /\[REC:([a-zA-Z0-9_-]+)\]/g;
    const ids: string[] = [];
    let match;
    while ((match = recRegex.exec(text)) !== null) {
      ids.push(match[1]);
    }
    const cleanText = text.replace(/\[REC:[a-zA-Z0-9_-]+\]/g, '').trim();
    return { cleanText, ids };
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsgText = input.trim();
    const newMsg: Message = {
      role: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é o "Glow AI Concierge". Sua base de dados real são os profissionais abaixo:
          ${JSON.stringify(platformKnowledge.provedores)}.
          
          REGRAS:
          1. Sugira apenas os profissionais desta lista.
          2. Use o formato [REC:ID] para citar um profissional.
          3. Seja sofisticado, use português de Angola.
          4. Mencione que você está analisando o Radar Live em tempo real.`,
          thinkingConfig: { thinkingBudget: 0 }
        },
        history: history
      });

      const result = await chat.sendMessage({ message: userMsgText });
      const responseText = result.text || "Erro na sincronização.";
      const { cleanText, ids } = parseAiResponse(responseText);

      setMessages(prev => [...prev, {
        role: 'model',
        text: cleanText,
        recommendedProviderIds: ids.length > 0 ? ids : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Radar Glow em manutenção. Tente novamente.", 
        timestamp: "Agora" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderProviderCard = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return null;

    return (
      <div key={id} className="mt-6 bg-white dark:bg-darkCard rounded-[40px] overflow-hidden luxury-shadow border border-ruby/20 animate-fade-in group w-full max-w-sm">
         <div className="relative aspect-video overflow-hidden">
            <img src={provider.portfolio[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
               <span className="bg-emerald text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                 <div className="w-1 h-1 bg-white rounded-full animate-ping"></div> Radar Live
               </span>
            </div>
         </div>
         <div className="p-6 space-y-4">
            <div>
               <h4 className="text-xl font-serif font-black dark:text-white italic leading-none">{provider.businessName}</h4>
               <p className="text-quartz text-[9px] font-bold uppercase mt-1 tracking-widest">{provider.location.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => onSelectProvider(provider)} className="py-3 bg-ruby text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">Ver Ritual</button>
               <button onClick={() => onShowRoute(provider)} className="py-3 bg-white text-onyx border border-quartz/10 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"><Icons.Map /> Rota</button>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] md:h-[85vh] flex flex-col bg-white dark:bg-darkCard rounded-[50px] luxury-shadow border border-quartz/10 overflow-hidden animate-fade-in relative">
      <header className="p-8 border-b border-quartz/5 bg-white/80 dark:bg-darkCard/80 backdrop-blur-3xl flex justify-between items-center z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-ruby rounded-[20px] flex items-center justify-center text-white shadow-2xl"><Icons.Star filled /></div>
          <div>
            <h2 className="text-2xl font-serif font-black dark:text-white italic tracking-tighter">Glow <span className="text-ruby">Concierge.</span></h2>
            <span className="text-[7px] font-black uppercase text-emerald tracking-[0.3em] flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald rounded-full animate-ping"></div> Luanda Live Sync Ativo</span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
            <div className={`max-w-[90%] md:max-w-[80%] p-6 md:p-8 rounded-[35px] text-sm md:text-base font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-ruby text-white rounded-tr-none' : 'bg-offwhite dark:bg-onyx dark:text-white border border-quartz/5 rounded-tl-none italic font-serif'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.recommendedProviderIds?.map(id => renderProviderCard(id))}
            </div>
            <span className="text-[7px] font-black uppercase text-quartz mt-3 mx-4 opacity-40">{msg.timestamp}</span>
          </div>
        ))}
        {isTyping && <div className="p-5 bg-offwhite/50 dark:bg-onyx/50 rounded-[30px] w-fit animate-pulse border border-quartz/5 text-[8px] font-black uppercase text-ruby">Consultando Radar de Elite...</div>}
      </div>

      <footer className="p-6 md:p-10 border-t border-quartz/5 bg-white dark:bg-darkCard z-10">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping} placeholder="O que busca em Luanda hoje?" className="w-full bg-offwhite dark:bg-onyx border border-quartz/10 rounded-full py-6 px-10 pr-24 outline-none dark:text-white font-medium focus:border-ruby shadow-inner" />
          <button type="submit" disabled={isTyping || !input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-ruby text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-30">
            {isTyping ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icons.Message />}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default GlowAIConcierge;
