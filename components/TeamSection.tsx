
import React from 'react';
import { Icons } from '../constants';
import GlowImage from './GlowImage';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  specialty: string;
  isElite?: boolean;
}

interface TeamSectionProps {
  members?: TeamMember[];
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Carla Silva',
    role: 'Master Hairstylist',
    specialty: 'Visagismo Internacional',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800',
    isElite: true
  },
  {
    id: '2',
    name: 'Mauro Vaz',
    role: 'Senior Barber',
    specialty: 'Barboterapia Real',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800',
    isElite: true
  },
  {
    id: '3',
    name: 'Isabel Cruz',
    role: 'Nail Artist',
    specialty: 'Bio-Gel Designer',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
    isElite: false
  }
];

const TeamSection: React.FC<TeamSectionProps> = ({ members = DEFAULT_TEAM }) => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-onyx overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HEADER CENTRALIZADO */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-[1px] bg-ruby/30"></div>
            <p className="text-ruby text-[10px] font-black uppercase tracking-[0.5em]">Curadoria Humana</p>
            <div className="w-8 h-[1px] bg-ruby/30"></div>
          </div>
          <h2 className="text-4xl md:text-7xl font-serif font-black dark:text-white italic tracking-tighter leading-none">
            Nossos <span className="text-gold">Artistas.</span>
          </h2>
          <p className="text-stone-500 dark:text-quartz text-base md:text-xl font-medium">
            Uma coalizão de talentos certificados para entregar o padrão Glow de excelência.
          </p>
        </header>

        {/* LISTA DE MEMBROS - SCROLL NO MOBILE, GRID NO DESKTOP */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible pb-10 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {members.map((member) => (
            <div 
              key={member.id} 
              className="min-w-[280px] md:min-w-0 group flex flex-col items-center text-center space-y-6 animate-fade-in"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[50px] luxury-shadow border border-quartz/10 transition-all group-hover:border-ruby/30">
                <GlowImage 
                  src={member.photo} 
                  alt={member.name} 
                  variant="prestige" 
                  className="w-full h-full"
                />
                
                {/* BADGE ELITE */}
                {member.isElite && (
                  <div className="absolute top-6 right-6 z-20">
                    <div className="bg-gold text-onyx px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/20">
                      <Icons.Star filled className="w-3 h-3" />
                      Elite Master
                    </div>
                  </div>
                )}

                {/* OVERLAY INFO (MOBILE REVEAL/DESKTOP HOVER) */}
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                   <p className="text-gold text-[9px] font-black uppercase tracking-[0.3em] mb-2">Especialidade</p>
                   <p className="text-white font-serif italic text-lg leading-tight">{member.specialty}</p>
                </div>
              </div>

              {/* TEXT INFO */}
              <div className="space-y-1">
                <h4 className="text-2xl font-serif font-black dark:text-white italic tracking-tight">{member.name}</h4>
                <p className="text-ruby text-[10px] font-black uppercase tracking-[0.4em]">{member.role}</p>
              </div>

              {/* ACTION BUTTON MÍNIMO */}
              <button className="px-8 py-3 bg-offwhite dark:bg-darkCard dark:text-white border border-quartz/10 rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-ruby hover:text-white transition-all">
                Ver Portfólio
              </button>
            </div>
          ))}
        </div>

        {/* TRUST BANNER MÍNIMO */}
        <div className="pt-10 border-t border-quartz/10 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-quartz">Parceiros de Formação</p>
           <div className="flex flex-wrap justify-center gap-10 md:gap-20">
              <span className="font-serif font-black text-xl italic tracking-tighter">L'ORÉAL PRO</span>
              <span className="font-serif font-black text-xl italic tracking-tighter">WELLA MASTER</span>
              <span className="font-serif font-black text-xl italic tracking-tighter">DYSON ELITE</span>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
};

export default TeamSection;
