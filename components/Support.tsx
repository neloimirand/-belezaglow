
import React, { useState } from 'react';
import { Icons } from '../constants';
import PolicyModal from './PolicyModal';

const Support: React.FC = () => {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const contacts = [
    {
      title: "WhatsApp Oferecido",
      value: "+244 942 644 781",
      action: "https://wa.me/244942644781",
      desc: "Suporte imediato para agendamentos e dúvidas rápidas.",
      icon: <Icons.Message />,
      color: "text-emerald bg-emerald/5 border-emerald/10"
    },
    {
      title: "Linha VIP Glow",
      value: "951 154 266",
      action: "tel:244951154266",
      desc: "Atendimento por voz para consultoria de rituais.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
      color: "text-ruby bg-ruby/5 border-ruby/10"
    },
    {
      title: "E-mail de Suporte",
      value: "neloimik@gmail.com",
      action: "mailto:neloimik@gmail.com",
      desc: "Solicitações formais, parcerias e questões técnicas.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      color: "text-onyx dark:text-white bg-quartz/5 border-quartz/10"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-fade-in py-8 px-4 md:px-0 pb-32">
      
      {/* Editorial Header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
           <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse"></div>
           <p className="text-emerald text-[9px] font-black uppercase tracking-[0.4em]">Concierge Disponível</p>
        </div>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-onyx dark:text-white tracking-tighter leading-none">Central de <br /><span className="text-ruby italic font-normal">Apoio Elite.</span></h2>
        <p className="text-quartz dark:text-quartz/60 text-lg md:text-2xl font-medium max-w-2xl mx-auto">Assistência premium para garantir que sua jornada de beleza seja impecável.</p>
      </header>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contacts.map((c, i) => (
          <a 
            key={i} 
            href={c.action} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-white dark:bg-darkCard p-10 rounded-[45px] luxury-shadow border border-quartz/10 transition-all hover:scale-105 active:scale-95 text-center space-y-6"
          >
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center transition-all group-hover:rotate-6 ${c.color}`}>
              {c.icon}
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-quartz">{c.title}</h4>
              <p className="text-xl md:text-2xl font-serif font-black text-onyx dark:text-white">{c.value}</p>
            </div>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">{c.desc}</p>
            <div className="pt-4">
              <span className="inline-block px-8 py-3 bg-onyx dark:bg-white text-white dark:text-onyx text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg group-hover:bg-ruby group-hover:text-white transition-colors">Acionar Agora</span>
            </div>
          </a>
        ))}
      </div>

      {/* Service Status & Hours */}
      <div className="bg-onyx dark:bg-white text-white dark:text-onyx p-12 md:p-20 rounded-[50px] md:rounded-[60px] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-ruby/10 rounded-full blur-[100px]"></div>
        
        <div className="space-y-6 relative z-10 text-center md:text-left">
           <div className="space-y-2">
             <h3 className="text-3xl md:text-5xl font-serif font-bold italic tracking-tight">Presença constante.</h3>
             <p className="text-quartz dark:text-stone-500 font-medium text-lg">Nossa equipe técnica monitora a rede 24/7 para sua segurança.</p>
           </div>
           <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-ruby/20 rounded-xl flex items-center justify-center text-ruby"><Icons.Clock /></div>
                 <div>
                    <p className="text-[9px] font-black uppercase text-quartz">Janela de Atendimento</p>
                    <p className="font-bold">Domingo a Sexta-feira</p>
                 </div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-ruby/20 rounded-xl flex items-center justify-center text-ruby"><Icons.Map /></div>
                 <div>
                    <p className="text-[9px] font-black uppercase text-quartz">Sede</p>
                    <p className="font-bold">Talatona, Luanda, AO</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative z-10 bg-white/5 dark:bg-onyx/5 p-10 rounded-[40px] border border-white/10 dark:border-onyx/10 text-center space-y-6 w-full md:w-80">
           <div className="w-16 h-16 bg-gold text-onyx rounded-full flex items-center justify-center mx-auto shadow-2xl"><Icons.Star filled /></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-gold">Tempo de Resposta</p>
           <p className="text-4xl font-serif font-bold leading-none">Rápido <span className="text-xl">& Eficaz</span></p>
           <p className="text-[9px] font-medium text-quartz">Atendimento Humanizado</p>
        </div>
      </div>

      {/* Atendimento e Feedback Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-white dark:bg-darkCard p-12 rounded-[50px] border border-quartz/10 luxury-shadow space-y-6">
            <h4 className="text-3xl font-serif font-black dark:text-white italic">Atendimento <span className="text-ruby">Humanizado.</span></h4>
            <p className="text-stone-500 dark:text-quartz text-sm leading-relaxed font-medium">
              Prezamos por um atendimento respeitoso, rápido e eficiente. Todas as solicitações são analisadas com atenção e respondidas o mais breve possível pela nossa curadoria de prestígio.
            </p>
         </div>
         <div className="bg-white dark:bg-darkCard p-12 rounded-[50px] border border-quartz/10 luxury-shadow space-y-6">
            <h4 className="text-3xl font-serif font-black dark:text-white italic">Sugestões e <span className="text-gold">Feedback.</span></h4>
            <p className="text-stone-500 dark:text-quartz text-sm leading-relaxed font-medium">
              Sua opinião é muito importante para nós! Envie sugestões, elogios ou críticas através de qualquer um dos canais acima e ajude-nos a elevar o padrão Beleza Glow. 💬✨
            </p>
         </div>
      </section>

      {/* Short FAQ Section */}
      <section className="space-y-10 pt-12">
         <h3 className="text-3xl font-serif font-bold text-center dark:text-white">Perguntas Frequentes</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Como cancelar um agendamento?", a: "Vá em 'Minha Agenda', selecione o serviço e clique em 'Marcar como Concluído' ou entre em contato com o profissional para reagendamento." },
              { q: "O pagamento é feito pelo app?", a: "Atualmente servimos como ponte para reserva. O pagamento é realizado diretamente ao profissional via Multicaixa ou Cash." },
              { q: "Como me tornar um profissional Gold?", a: "Acesse seu Perfil, vá em 'Prestígio & Planos' e siga as instruções para ativação do nível Ouro." },
              { q: "Problemas com a localização?", a: "Certifique-se que o GPS está ativo e que o app tem permissão nas configurações do seu smartphone." }
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-darkCard p-8 rounded-[35px] border border-quartz/5 space-y-3">
                <p className="text-ruby font-black uppercase text-[9px] tracking-widest">Dúvida Comum</p>
                <h4 className="font-bold text-onyx dark:text-white">{f.q}</h4>
                <p className="text-sm text-stone-500 leading-relaxed font-medium">{f.a}</p>
              </div>
            ))}
         </div>
      </section>

      {/* FOOTER DO SUPORTE COM POLÍTICA */}
      <div className="pt-12 flex justify-center">
         <button 
          onClick={() => setIsPolicyOpen(true)}
          className="px-10 py-4 bg-offwhite dark:bg-onyx border border-quartz/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-quartz hover:text-ruby hover:border-ruby transition-all"
         >
            Ver Política de Uso Completa
         </button>
      </div>

      {isPolicyOpen && <PolicyModal onClose={() => setIsPolicyOpen(false)} />}
    </div>
  );
};

export default Support;
