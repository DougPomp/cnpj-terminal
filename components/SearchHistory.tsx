'use client';

import React from 'react';
import { History, Trash2, ArrowUpRight } from 'lucide-react';
import { formatarCNPJ } from '@/lib/cnpj';
import { soundFx } from '@/lib/audio';

export interface HistoryItem {
  cnpj: string;
  razaoSocial: string;
  situacaoCadastral: string;
  timestamp: number;
}

interface SearchHistoryProps {
  history: HistoryItem[];
  onSelectHistory: (cnpj: string) => void;
  onClearHistory: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  const handleItemClick = (cnpj: string) => {
    soundFx.playBeep();
    onSelectHistory(cnpj);
  };

  const handleClear = () => {
    soundFx.playKeyPress();
    onClearHistory();
  };

  if (history.length === 0) return null;

  return (
    <div className="brutalist-card p-4 mb-6">
      <div className="flex items-center justify-between border-b-2 border-matrix-green pb-2 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-matrix-green" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest matrix-glow">
            RECENT_SEARCHES // HISTORICO LOCAL
          </h3>
        </div>

        <button
          onClick={handleClear}
          className="text-xs font-mono px-2 py-0.5 border border-matrix-muted hover:border-matrix-red text-matrix-muted hover:text-matrix-red bg-matrix-black transition-all flex items-center gap-1"
          title="Limpar Histórico do Navegador"
        >
          <Trash2 className="w-3 h-3" />
          <span>[CLEAR_HISTORY]</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 font-mono">
        {history.map((item) => {
          let statusBorder = 'border-matrix-green text-matrix-green';
          if (item.situacaoCadastral.includes('SUSP') || item.situacaoCadastral.includes('PEND')) {
            statusBorder = 'border-matrix-warning text-matrix-warning';
          }
          if (item.situacaoCadastral.includes('BAIX') || item.situacaoCadastral.includes('INAP')) {
            statusBorder = 'border-matrix-red text-matrix-red';
          }

          return (
            <button
              key={item.cnpj}
              onClick={() => handleItemClick(item.cnpj)}
              className="p-2 border border-matrix-muted hover:border-matrix-green bg-matrix-black hover:bg-matrix-darkGreen text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <span className="text-xs font-bold text-matrix-green group-hover:text-matrix-mint">
                  {formatarCNPJ(item.cnpj)}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-matrix-muted group-hover:text-matrix-green transition-colors" />
              </div>
              <p className="text-xs text-matrix-green/80 truncate mb-1.5" title={item.razaoSocial}>
                {item.razaoSocial}
              </p>
              <span className={`text-[10px] font-bold px-1 py-0.2 border ${statusBorder} bg-matrix-black self-start`}>
                {item.situacaoCadastral || 'ATIVA'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
