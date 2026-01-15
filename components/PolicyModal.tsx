
import React from 'react';

interface PolicyModalProps {
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-12 backdrop-blur-3xl bg-onyx/90 overflow-y-auto">
      <div className="bg-white dark:bg-darkCard w-full max-w-4xl rounded-[60px] p-10 md:p-20 shadow-2xl animate-fade-in relative my-8">
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 w-12 h-12 rounded-full bg-offwhite dark:bg-onyx flex items-center justify-center hover:text-ruby transition-all z-10"
        >
          ✕
        </button>

        <header className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-[1px] bg-ruby/30"></div>
            <p className="text-ruby text-[10px] font-black uppercase tracking-[0.6em]">Documento de Conformidade</p>
            <div className="w-12 h-[1px] bg-ruby/30"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-onyx dark:text-white italic tracking-tighter">
            Política de <span className="text-gold">Uso.</span>
          </h2>
          <p className="text-quartz text-xs font-medium uppercase tracking-widest">Beleza Glow – Termos e Condições Oficiais</p>
        </header>

        <div className="prose prose-stone dark:prose-invert max-w-none space-y-12 text-stone-600 dark:text-quartz font-medium leading-relaxed overflow-y-auto max-h-[60vh] pr-4 scrollbar-hide">
          <p className="text-lg italic border-l-4 border-ruby pl-8 py-2 bg-ruby/5 rounded-r-2xl">
            Bem-vindo(a) ao site Beleza Glow. Ao acessar ou utilizar este site, você concorda com os termos e condições descritos abaixo. Caso não concorde, recomendamos que não utilize nossos serviços.
          </p>

          <div className="grid grid-cols-1 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">01.</span> Objetivo do Site
              </h3>
              <p>O site Beleza Glow tem como finalidade oferecer informações, conteúdos, produtos e/ou serviços relacionados à área de beleza, estética e bem-estar.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">02.</span> Aceitação dos Termos
              </h3>
              <p>Ao navegar no site, o usuário declara que leu, compreendeu e concorda com esta Política de Uso, bem como com nossa Política de Privacidade.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">03.</span> Uso Adequado
              </h3>
              <p>O usuário compromete-se a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizar o site apenas para fins lícitos;</li>
                <li>Não praticar atos que violem a legislação vigente, a moral ou os bons costumes;</li>
                <li>Não tentar invadir, danificar ou comprometer a segurança do site;</li>
                <li>Não reproduzir, copiar ou distribuir conteúdos sem autorização prévia.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">04.</span> Propriedade Intelectual
              </h3>
              <p>Todo o conteúdo disponível no site (textos, imagens, logotipos, marcas, vídeos, layout e design) é de propriedade do Beleza Glow, salvo quando indicado o contrário, sendo protegido por leis de direitos autorais e propriedade intelectual.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">05.</span> Responsabilidades
              </h3>
              <p>O Beleza Glow não se responsabiliza por:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Eventuais falhas técnicas ou indisponibilidade do site;</li>
                <li>Danos causados por vírus ou ataques cibernéticos;</li>
                <li>Informações fornecidas por terceiros;</li>
                <li>Uso indevido das informações disponibilizadas no site.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">06.</span> Conteúdo e Informações
              </h3>
              <p>As informações disponibilizadas no site têm caráter informativo e não substituem orientação profissional especializada, quando aplicável.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">07.</span> Privacidade e Proteção de Dados
              </h3>
              <p>O tratamento de dados pessoais dos usuários é realizado conforme a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018). Para mais detalhes, consulte nossa Política de Privacidade.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">08.</span> Links para Sites de Terceiros
              </h3>
              <p>O site pode conter links para páginas externas. O Beleza Glow não se responsabiliza pelo conteúdo, políticas ou práticas desses sites.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">09.</span> Alterações na Política de Uso
              </h3>
              <p>O Beleza Glow reserva-se o direito de modificar esta Política de Uso a qualquer momento, sendo recomendável que o usuário a revise periodicamente.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">10.</span> Legislação Aplicável
              </h3>
              <p>Esta Política de Uso é regida pelas leis da República Federativa do Brasil e jurisdições internacionais de operação em Luanda.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-serif font-black text-onyx dark:text-white flex items-center gap-4">
                <span className="text-gold">11.</span> Contato
              </h3>
              <p>Em caso de dúvidas, sugestões ou solicitações, entre em contato pelo e-mail:</p>
              <p className="font-bold text-ruby">📧 neloimik@gmail.com</p>
            </section>
          </div>

          <footer className="pt-10 border-t border-quartz/10">
            <div className="bg-offwhite dark:bg-onyx p-8 rounded-[35px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
               <div className="text-center md:text-left">
                  <p className="text-[10px] font-black uppercase text-quartz tracking-widest mb-1">Última Atualização</p>
                  <p className="text-onyx dark:text-white font-bold">Maio de 2024</p>
               </div>
               <button 
                onClick={onClose}
                className="px-12 py-4 bg-ruby text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
               >
                 Aceitar e Continuar
               </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
