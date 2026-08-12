'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Volume2, VolumeX, Monitor, ShieldCheck, Music } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface TerminalHeaderProps {
  isMuted: boolean;
  onToggleSound: () => void;
  isBgmActive: boolean;
  onToggleBgm: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  isMuted,
  onToggleSound,
  isBgmActive,
  onToggleBgm,
  crtEnabled,
  onToggleCrt,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const brt = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      setTimeStr(`${brt} BRT`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundClick = () => {
    onToggleSound();
    soundFx.playKeyPress();
  };

  const handleBgmClick = () => {
    onToggleBgm();
  };

  const handleCrtClick = () => {
    onToggleCrt();
    soundFx.playKeyPress();
  };

  return (
    <header className="border-b-2 border-matrix-green bg-matrix-darkGreen/80 backdrop-blur px-4 py-3 sticky top-0 z-30 shadow-[0_4px_15px_rgba(0,255,65,0.15)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Marca & Título H1 */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 border-2 border-matrix-green bg-matrix-black">
            <Terminal className="w-6 h-6 text-matrix-green animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider matrix-glow uppercase flex items-center gap-2">
              <span>CNPJ Terminal</span>
              <span className="text-xs px-1.5 py-0.5 border border-matrix-green bg-matrix-black text-matrix-mint">
                v2.4_EDGE
              </span>
            </h1>
            <p className="text-xs text-matrix-green/80 tracking-widest hidden sm:block">
              CyberLookup Enterprise // Consulta Cadastral Corporativa da Receita Federal
            </p>
          </div>
        </div>

        {/* Status do Node & Relógio BRT */}
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap justify-center">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 border border-matrix-muted bg-matrix-black">
            <ShieldCheck className="w-4 h-4 text-matrix-green" />
            <span className="text-matrix-green/90">VERCEL_EDGE_NODE</span>
            <span className="w-2 h-2 rounded-full bg-matrix-green animate-ping" />
          </div>

          <div className="px-2.5 py-1 border border-matrix-green bg-matrix-black text-matrix-mint font-bold tracking-widest">
            {timeStr || '00:00:00 BRT'}
          </div>

          {/* Controles do Terminal */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBgmClick}
              className={`px-2.5 py-1 border-2 flex items-center gap-1.5 font-bold transition-all ${
                isBgmActive
                  ? 'border-matrix-mint text-matrix-black bg-matrix-mint animate-pulse'
                  : 'border-matrix-green text-matrix-green bg-matrix-darkGreen brutalist-button'
              }`}
              title="Chavear Música de Fundo 16-Bits (MIDI Synth)"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">{isBgmActive ? 'BGM_16BIT: ON' : 'BGM: OFF'}</span>
            </button>

            <button
              onClick={handleSoundClick}
              className={`px-2.5 py-1 border-2 flex items-center gap-1.5 font-bold transition-all ${
                isMuted
                  ? 'border-matrix-muted text-matrix-muted bg-matrix-black'
                  : 'border-matrix-green text-matrix-green bg-matrix-darkGreen brutalist-button'
              }`}
              title="Chavear Efeitos Sonoros FX"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'MUTE' : 'FX_ON'}</span>
            </button>

            <button
              onClick={handleCrtClick}
              className={`px-2.5 py-1 border-2 flex items-center gap-1.5 font-bold transition-all ${
                !crtEnabled
                  ? 'border-matrix-muted text-matrix-muted bg-matrix-black'
                  : 'border-matrix-green text-matrix-green bg-matrix-darkGreen brutalist-button'
              }`}
              title="Chavear Efeitos CRT (Scanlines)"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">{crtEnabled ? 'CRT_ON' : 'CRT_OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navegação Interna de Links para SEO */}
      <nav className="max-w-7xl mx-auto mt-2 pt-2 border-t border-matrix-muted/40 flex items-center gap-4 text-xs font-mono overflow-x-auto">
        <span className="text-matrix-green/60 select-none">&gt; NAV:</span>
        <a href="#pesquisa" className="text-matrix-green hover:text-matrix-mint transition-colors whitespace-nowrap">
          [01.CONSULTAR_CNPJ]
        </a>
        <a href="#historico" className="text-matrix-green hover:text-matrix-mint transition-colors whitespace-nowrap">
          [02.HISTORICO_LOCAL]
        </a>
        <a href="#logs" className="text-matrix-green hover:text-matrix-mint transition-colors whitespace-nowrap">
          [03.CONSOLE_LOGS]
        </a>
        <a href="#sobre" className="text-matrix-green hover:text-matrix-mint transition-colors whitespace-nowrap">
          [04.SOBRE_SISTEMA]
        </a>
        <a href="#faq" className="text-matrix-green hover:text-matrix-mint transition-colors whitespace-nowrap">
          [05.DUVIDAS_FREQUENTES]
        </a>
      </nav>
    </header>
  );
};
