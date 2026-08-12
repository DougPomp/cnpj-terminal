'use client';

import React, { useState } from 'react';
import { HelpCircle, Info, ChevronDown, ChevronUp, Lock, Cpu, Server, Database } from 'lucide-react';
import { soundFx } from '@/lib/audio';

const FAQ_ITEMS = [
  {
    q: 'Como funciona a consulta de CNPJ no Terminal?',
    a: 'Ao digitar um CNPJ de 14 dígitos, nosso sistema faz a validação matemática local dos 2 dígitos verificadores e consulta em tempo real a base pública da Receita Federal do Brasil via BrasilAPI e MinhaReceita API.',
  },
  {
    q: 'Quais dados da empresa são retornados?',
    a: 'Você terá acesso completo à Razão Social, Nome Fantasia, Situação Cadastral (Ativa, Suspensa, Inapta, Baixada), Data de Abertura, Capital Social, Natureza Jurídica, Porte, Endereço da Sede, Código e Descrição do CNAE Principal e Secundários, além do Quadro de Sócios e Administradores (QSA).',
  },
  {
    q: 'A consulta retém dados privados ou viola a LGPD?',
    a: 'Não. Todos os dados exibidos são de domínio público corporativo conforme a Lei da Transparência nº 12.527/2011. A aplicação não armazena logs ou históricos em servidores remotos; o histórico fica salvo exclusivamente no seu navegador via localStorage.',
  },
  {
    q: 'O que fazer se um CNPJ constar como INAPTO ou SUSPENSO?',
    a: 'Empresas em situação Suspensa ou Inapta possuem pendências de declaração ou irregularidades perante a Secretaria da Receita Federal. O terminal exibe um alerta temático para facilitação de auditoria B2B.',
  },
];

export const TerminalInfoFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    soundFx.playKeyPress();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 my-8 font-mono">
      {/* Seção Sobre o Sistema */}
      <section id="sobre" className="brutalist-card p-4 sm:p-6">
        <div className="flex items-center gap-2 border-b-2 border-matrix-green pb-3 mb-4">
          <Info className="w-5 h-5 text-matrix-green" />
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider matrix-glow">
            SOBRE O SISTEMA // CNPJ TERMINAL CYBERLOOKUP
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 border border-matrix-muted bg-matrix-black">
            <div className="flex items-center gap-1.5 text-matrix-mint font-bold mb-2">
              <Cpu className="w-4 h-4" />
              <span>ALTA PERFORMANCE EDGE</span>
            </div>
            <p className="text-matrix-green/80 leading-relaxed">
              Desenvolvido em Next.js 14 App Router com execução Serverless Edge Network da Vercel, entregando respostas em menos de 100ms com revalidação SWR de 24 horas.
            </p>
          </div>

          <div className="p-3 border border-matrix-muted bg-matrix-black">
            <div className="flex items-center gap-1.5 text-matrix-mint font-bold mb-2">
              <Lock className="w-4 h-4" />
              <span>PRIVACIDADE & LGPD</span>
            </div>
            <p className="text-matrix-green/80 leading-relaxed">
              Consulta de dados públicos da Receita Federal sem retenção de IP, fingerprint ou logs de usuários. Total conformidade com a Lei de Acesso à Informação.
            </p>
          </div>

          <div className="p-3 border border-matrix-muted bg-matrix-black">
            <div className="flex items-center gap-1.5 text-matrix-mint font-bold mb-2">
              <Database className="w-4 h-4" />
              <span>DUPLO FALLBACK DE APIs</span>
            </div>
            <p className="text-matrix-green/80 leading-relaxed">
              Arquitetura resiliente com timeout de 3.5s na BrasilAPI e alternância automática para a MinhaReceita API para garantia de uptime ininterrupto.
            </p>
          </div>
        </div>
      </section>

      {/* Seção FAQ (Dúvidas Frequentes) */}
      <section id="faq" className="brutalist-card p-4 sm:p-6">
        <div className="flex items-center justify-between border-b-2 border-matrix-green pb-3 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-matrix-green" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider matrix-glow">
              DUVIDAS FREQUENTES // BASE DE CONHECIMENTO
            </h2>
          </div>
          <span className="text-xs text-matrix-mint font-bold">[FAQ_DATABASE]</span>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border border-matrix-muted bg-matrix-black">
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-3 text-left font-bold text-xs sm:text-sm text-matrix-green hover:text-matrix-mint flex items-center justify-between gap-2 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-matrix-muted">&gt;</span>
                    {item.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 pt-1 border-t border-matrix-muted/50 text-xs text-matrix-green/90 leading-relaxed bg-matrix-darkGreen/20">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Links Internos de Atalho SEO */}
        <div className="mt-4 pt-3 border-t border-matrix-muted/40 flex flex-wrap items-center gap-3 text-xs text-matrix-green/70">
          <span>ATALHOS_SEO:</span>
          <a href="#pesquisa" className="hover:text-matrix-mint underline">[Ir para Busca de CNPJ]</a>
          <a href="#historico" className="hover:text-matrix-mint underline">[Ver Histórico Local]</a>
          <a href="#logs" className="hover:text-matrix-mint underline">[Ver Logs do Console]</a>
        </div>
      </section>
    </div>
  );
};
