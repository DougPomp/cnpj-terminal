'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, X } from 'lucide-react';
import { formatarCNPJ, cleanCNPJ, validarCNPJ } from '@/lib/cnpj';
import { soundFx } from '@/lib/audio';

interface CnpjInputFormProps {
  onSearch: (cnpj: string) => void;
  isLoading: boolean;
}

const SAMPLE_CNPJS = [
  { label: 'BANCO DO BRASIL', cnpj: '00.000.000/0001-91' },
  { label: 'PETROBRAS', cnpj: '33.000.167/0001-01' },
  { label: 'VALE S.A.', cnpj: '33.592.510/0001-54' },
];

export const CnpjInputForm: React.FC<CnpjInputFormProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const cleaned = cleanCNPJ(inputValue);
  const isValid = cleaned.length === 14 && validarCNPJ(cleaned);
  const isComplete = cleaned.length === 14;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatarCNPJ(raw);
    setInputValue(formatted);
    soundFx.playKeyPress();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) {
      soundFx.playError();
      return;
    }
    soundFx.playBeep();
    onSearch(cleaned);
  };

  const handleClear = () => {
    setInputValue('');
    soundFx.playKeyPress();
  };

  const handleQuickFill = (cnpj: string) => {
    setInputValue(formatarCNPJ(cnpj));
    soundFx.playBeep();
    onSearch(cleanCNPJ(cnpj));
  };

  return (
    <div className="brutalist-card p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between border-b-2 border-matrix-green pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-matrix-green inline-block animate-pulse" />
          <h2 className="text-lg font-bold uppercase tracking-widest matrix-glow">
            SEARCH_QUERY // ENTRADA DE PARAMETROS
          </h2>
        </div>
        
        {/* Status da Validação Algorítmica */}
        <div className="text-xs font-mono">
          {inputValue ? (
            isComplete ? (
              isValid ? (
                <span className="flex items-center gap-1 text-matrix-green font-bold bg-matrix-black border border-matrix-green px-2 py-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  [ALGORITMO: VALIDO]
                </span>
              ) : (
                <span className="flex items-center gap-1 text-matrix-red font-bold bg-matrix-black border border-matrix-red px-2 py-0.5">
                  <XCircle className="w-3.5 h-3.5" />
                  [DIGITOS_INVALIDOS]
                </span>
              )
            ) : (
              <span className="text-matrix-green/60 bg-matrix-black border border-matrix-muted px-2 py-0.5">
                [{cleaned.length}/14 DIGITOS]
              </span>
            )
          ) : (
            <span className="text-matrix-muted bg-matrix-black border border-matrix-muted px-2 py-0.5">
              [AGUARDANDO_INPUT]
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-matrix-green font-bold text-lg select-none">
            &gt;
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="00.000.000/0001-00"
            maxLength={18}
            disabled={isLoading}
            className="w-full bg-matrix-black border-2 border-matrix-green text-matrix-green font-mono text-xl sm:text-2xl font-bold py-3 pl-8 pr-10 focus:outline-none focus:bg-matrix-darkGreen focus:border-matrix-mint placeholder:text-matrix-muted uppercase tracking-wider"
          />
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-matrix-muted hover:text-matrix-green transition-colors"
              title="Limpar campo"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`px-6 py-3 border-2 font-mono text-base font-bold flex items-center justify-center gap-2 whitespace-nowrap ${
            isValid && !isLoading
              ? 'border-matrix-green text-matrix-black bg-matrix-green hover:bg-matrix-mint brutalist-button'
              : 'border-matrix-muted text-matrix-muted bg-matrix-black cursor-not-allowed opacity-60'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{isLoading ? 'DECODIFICANDO...' : 'EXAMINAR_EMPRESA'}</span>
        </button>
      </form>

      {/* Atalhos Rápidos para Empresas Demonstração */}
      <div className="mt-4 pt-3 border-t border-matrix-muted/50 flex flex-wrap items-center gap-2">
        <span className="text-xs text-matrix-green/70 font-mono">EXEMPLOS_RAPIDOS:</span>
        {SAMPLE_CNPJS.map((sample) => (
          <button
            key={sample.cnpj}
            type="button"
            onClick={() => handleQuickFill(sample.cnpj)}
            disabled={isLoading}
            className="text-xs font-mono px-2 py-1 border border-matrix-muted hover:border-matrix-green bg-matrix-black text-matrix-green/90 hover:text-matrix-mint transition-all"
          >
            + {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
};
