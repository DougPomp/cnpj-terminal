'use client';

import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

export const TerminalFooter: React.FC = () => {
  return (
    <footer className="mt-12 border-t-2 border-matrix-green bg-matrix-darkGreen/50 py-6 px-4 font-mono text-xs text-matrix-green/80">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Aviso LGPD / Transparência */}
        <div className="flex items-start gap-2 max-w-2xl">
          <ShieldCheck className="w-5 h-5 text-matrix-green shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-matrix-mint">SEGURANÇA &amp; CONFORMIDADE (LGPD):</strong> Esta ferramenta é uma interface gráfica pública de consulta cadastral corporativa baseada em dados abertos da Receita Federal do Brasil (Lei da Transparência nº 12.527/2011). Não retemos, indexamos nem armazenamos logs privados.
          </p>
        </div>

        {/* Branding & Infraestrutura */}
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-1 text-matrix-mint font-bold">
            <Cpu className="w-4 h-4" />
            <span>VERCEL EDGE NETWORK // SERVERLESS ENGINE</span>
          </div>
          <p className="text-matrix-muted text-[11px]">
            CYBERLOOKUP ENTERPRISE &copy; {new Date().getFullYear()} — MATRIX CRT SYSTEM TERMINAL
          </p>
        </div>
      </div>
    </footer>
  );
};
