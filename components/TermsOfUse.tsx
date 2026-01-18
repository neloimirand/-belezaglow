
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';

interface TermsOfUseProps {
  onClose: () => void;
  onAccept?: () => void;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ onClose, onAccept }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    }
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Aceitação da Patente Glow',
      icon: <Icons.Star filled />,
      content: 'Ao ingressar no ecossistema Beleza Glow, você não está apenas usando um aplicativo, mas tornando-se parte de uma rede de elite de beleza em Angola. O uso desta plataforma implica na aceitação incondicional destes termos de prestígio.'
    },
    {
      id: 'services',
      title: 'Rituais e Agendamentos',
      icon: <Icons.Calendar />,
      content: 'A Beleza Glow atua como um concierge digital. Todos os agendamentos são rituais de compromisso entre cliente e profissional. Cancelamentos devem respeitar a janela de cortesia de 24 horas para manter o status de membro ouro.'
    },
    {
      id: 'payments',
      title: 'Transações e Moeda',
      icon: <Icons.Dollar />,
      content: 'Os valores apresentados são em Kwanzas (Kz). Atualmente, a plataforma facilita a reserva, mas o investimento final é liquidado diretamente com o atelier, garantindo a autonomia financeira dos nossos artistas parceiros.'
    },
    {
      id: 'privacy',
      title: 'Confidencialidade da Identidade',
      icon: <Icons.User />,
      content: 'Sua privacidade é nosso ativo mais valioso. Dados biométricos e de geolocalização são utilizados exclusivamente para otimizar sua experiência no Radar Glow, sob as normas da Lei de Proteção de Dados de Angola.'
    },
    {
      id: 'conduct',
      title: 'Código de Conduta Elite',
      icon: <Icons.Award />,
      content: 'Exigimos respeito mútuo absoluto. Comportamentos inadequados, falta de pontualidade excessiva ou descumprimento de rituais acordados podem resultar na revogação permanente do acesso à Maison.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[9000] bg-onyx flex items-center justify-center p-0 md:p-6 backdrop-blur-3xl animate-fade-in">
      {/* Progress Bar Top */}
      <div className="fixed top-0 left-0 h-1.5 bg-ruby/20 w-full z-[9100]">
        <div 
          className="h-full bg-ruby shadow-[0_0_15px_rgba(157,23,77,0.8)] transition-all duration-300" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="bg-white dark:bg-darkCard w-full max-w-5xl h-full md:h-[90vh] md:rounded-[60px] flex flex-col overflow-hidden shadow-2xl relative border border-white/5">
        
        {/* Editorial Header */}
        <header className="shrink-0 p-8 md:p-16 border-b border-quartz/10 bg-offwhite dark:bg-onyx flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-ruby"></span>
              <p className="text-ruby text-[9px] font-black uppercase tracking-[0.5em]">Documento Oficial v2024</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
              Termos de <span className="text-gold">Uso.</span>
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-14 h-14 bg-onyx dark:bg-white dark:text-onyx text-white rounded-2xl flex items-center justify-center hover:bg-ruby hover:text-white transition-all active:scale-90"
          >
            ✕
          </button>
        </header>

        {/* Content Area */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-8 md:p-20 space-y-16 scrollbar-hide"
        >
          <div className="max-w-3xl mx-auto space-y-12">
            <p className="text-stone-500 dark:text-quartz text-lg md:text-2xl font-medium italic leading-relaxed">
              "Bem-vindo à Beleza Glow. Este contrato define os padrões de excelência e as responsabilidades de todos que buscam ou oferecem serviços de beleza de alto nível em Luanda."
            </p>

            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={section.id} className="group p-8 md:p-12 bg-offwhite dark:bg-onyx/50 rounded-[45px] border border-quartz/10 hover:border-ruby/30 transition-all">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-12 h-12 bg-ruby/10 text-ruby rounded-2xl flex items-center justify-center group-hover:bg-ruby group-hover:text-white transition-all">
                      {section.icon}
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif font-black dark:text-white italic tracking-tight">{idx + 1}. {section.title}</h4>
                  </div>
                  <p className="text-stone-500 dark:text-quartz text-sm md:text-lg leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <section className="pt-12 border-t border-quartz/10 text-center space-y-6">
              <h4 className="text-2xl font-serif font-black dark:text-white italic">Jurisdição de Prestígio</h4>
              <p className="text-quartz text-xs uppercase tracking-widest font-bold">Luanda, Angola • Foro Central de Talatona</p>
            </section>
          </div>
        </div>

        {/* Action Footer */}
        <footer className="shrink-0 p-8 md:p-12 bg-offwhite dark:bg-onyx border-t border-quartz/10 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4 text-quartz text-[10px] font-black uppercase tracking-widest">
            <Icons.Clock /> Tempo de leitura estimado: 4 min
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-12 py-5 bg-white border border-quartz/20 dark:bg-darkCard dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-ruby transition-all"
            >
              Recusar
            </button>
            <button 
              onClick={() => {
                onAccept?.();
                onClose();
              }}
              className="flex-[2] md:flex-none px-16 py-5 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-ruby/30 hover:scale-105 transition-all active:scale-95"
            >
              Aceitar Termos Glow
            </button>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default TermsOfUse;
