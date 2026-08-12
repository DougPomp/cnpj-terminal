'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CRTContainer } from '@/components/CRTContainer';
import { MatrixBackground } from '@/components/MatrixBackground';
import { TerminalHeader } from '@/components/TerminalHeader';
import { CnpjInputForm } from '@/components/CnpjInputForm';
import { CompanyResultCard } from '@/components/CompanyResultCard';
import { TerminalConsoleLogs, LogEntry } from '@/components/TerminalConsoleLogs';
import { SearchHistory, HistoryItem } from '@/components/SearchHistory';
import { TerminalFooter } from '@/components/TerminalFooter';
import { CompanyData, formatarCNPJ } from '@/lib/cnpj';
import { soundFx } from '@/lib/audio';
import { Terminal, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cnpj_terminal_history_v1';

export default function Home() {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Auxiliar para registrar logs com timestamp
  const addLog = useCallback((type: 'info' | 'success' | 'warn' | 'error', message: string) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      type,
      message,
    };
    setLogs((prev) => [...prev, newEntry]);
  }, []);

  // Carregar histórico local na montagem
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignorar erros de localStorage
    }

    addLog('info', 'CNPJ Terminal Engine inicializado em Vercel Edge Server.');
    addLog('info', 'Protocolos HTTPS/SWR ativados com fallback para BrasilAPI e MinhaReceita.');
  }, [addLog]);

  // Salvar no histórico
  const saveToHistory = (data: CompanyData) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.cnpj !== data.cnpj);
      const updated: HistoryItem[] = [
        {
          cnpj: data.cnpj,
          razaoSocial: data.razao_social,
          situacaoCadastral: data.situacao_cadastral,
          timestamp: Date.now(),
        },
        ...filtered,
      ].slice(0, 5);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignorar erros
      }
      return updated;
    });
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    addLog('info', `Efeitos sonoros alterados para: ${nextMuted ? 'MUTE' : 'AUDIO_ON'}`);
  };

  const handleToggleCrt = () => {
    const nextCrt = !crtEnabled;
    setCrtEnabled(nextCrt);
    addLog('info', `Filtro visual CRT alterado para: ${nextCrt ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleSearchCNPJ = async (cleanCnpj: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setCompanyData(null);

    addLog('info', `[INPUT_QUERY] Solicitada inspeção para CNPJ: ${formatarCNPJ(cleanCnpj)}`);
    addLog('info', '[VAL_LOCAL] Executando validação matemática dos 2 dígitos verificadores...');
    addLog('success', '[VAL_LOCAL_OK] Dígitos conferem com o algoritmo da Receita Federal.');

    addLog('info', `[HTTP_GET] Conectando ao nó serverless /api/cnpj/${cleanCnpj}...`);

    try {
      const res = await fetch(`/api/cnpj/${cleanCnpj}`);
      const data = await res.json();

      if (!res.ok) {
        const errorText = data.error || 'Erro desconhecido na consulta.';
        setErrorMsg(errorText);
        soundFx.playError();
        addLog('error', `[HTTP_${res.status}] Falha: ${errorText}`);
      } else {
        setCompanyData(data);
        saveToHistory(data);
        soundFx.playSuccess();
        addLog('success', `[PAYLOAD_RECEIVED] Dados retornados com sucesso via ${data.fonte_dados || 'Receita Network'}.`);
        addLog('info', `[DECODED] ${data.razao_social} // Status: ${data.situacao_cadastral}`);
      }
    } catch {
      const errStr = 'Falha de comunicação ou timeout na requisição.';
      setErrorMsg(errStr);
      soundFx.playError();
      addLog('error', `[FETCH_EXCEPTION] ${errStr}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignorar
    }
    addLog('warn', 'Histórico local limpo pelo usuário.');
  };

  const handleClearLogs = () => {
    setLogs([]);
    addLog('info', 'Console de logs reinicializado.');
  };

  return (
    <CRTContainer crtEnabled={crtEnabled}>
      <MatrixBackground enabled={crtEnabled} />

      <TerminalHeader
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        crtEnabled={crtEnabled}
        onToggleCrt={handleToggleCrt}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Banner Brutalista de Boas-Vindas */}
        <div className="brutalist-card p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-matrix-green text-matrix-black border-2 border-matrix-green">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-matrix-mint">
                TERMINAL DE CONSULTA DE DADOS CADASTRAIS // RECEITA FEDERAL
              </h2>
              <p className="text-xs text-matrix-green/70 font-mono">
                Digite um CNPJ de 14 dígitos para decodificar Razão Social, CNAE, Capital e Quadro Societário (QSA).
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-matrix-green/80 bg-matrix-black px-3 py-1.5 border border-matrix-muted">
            <CheckCircle className="w-4 h-4 text-matrix-green" />
            <span>SWR CACHE: 24h REVALIDATE</span>
          </div>
        </div>

        {/* Form de Busca */}
        <CnpjInputForm onSearch={handleSearchCNPJ} isLoading={isLoading} />

        {/* Histórico de Pesquisas */}
        <SearchHistory
          history={history}
          onSelectHistory={handleSearchCNPJ}
          onClearHistory={handleClearHistory}
        />

        {/* Caixa de Alerta de Erro */}
        {errorMsg && (
          <div className="brutalist-card-red p-4 mb-6 flex items-start gap-3 animate-pulse">
            <ShieldAlert className="w-6 h-6 text-matrix-red shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-matrix-red uppercase tracking-wider matrix-glow-red">
                ALERTA_DE_SISTEMA // ERRO NA REQUISIÇÃO
              </h3>
              <p className="text-xs font-mono text-matrix-red/90 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Indicador de Carregamento Cipher */}
        {isLoading && (
          <div className="brutalist-card p-8 mb-6 text-center">
            <Terminal className="w-12 h-12 text-matrix-green mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-matrix-mint uppercase tracking-widest matrix-glow">
              DECODIFICANDO REGISTRO CORPORATIVO...
            </h3>
            <p className="text-xs font-mono text-matrix-green/70 mt-2">
              Conectando aos nós da Receita Federal via BrasilAPI / MinhaReceita API...
            </p>
            <div className="w-full bg-matrix-black border border-matrix-green h-2 mt-4 overflow-hidden">
              <div className="bg-matrix-green h-full w-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Card de Resultados da Empresa */}
        {companyData && !isLoading && <CompanyResultCard data={companyData} />}

        {/* Console Logs do Terminal */}
        <TerminalConsoleLogs logs={logs} onClearLogs={handleClearLogs} />
      </main>

      <TerminalFooter />
    </CRTContainer>
  );
}
