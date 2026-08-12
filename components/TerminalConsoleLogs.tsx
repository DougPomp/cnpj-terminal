'use client';

import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { soundFx } from '@/lib/audio';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

interface TerminalConsoleLogsProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const TerminalConsoleLogs: React.FC<TerminalConsoleLogsProps> = ({ logs, onClearLogs }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClear = () => {
    soundFx.playKeyPress();
    onClearLogs();
  };

  return (
    <div className="brutalist-card p-4 mb-6">
      <div className="flex items-center justify-between border-b-2 border-matrix-green pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-matrix-green" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest matrix-glow">
            SYSTEM_CONSOLE // STREAM_LOGS
          </h3>
        </div>

        <button
          onClick={handleClear}
          className="text-xs font-mono px-2 py-0.5 border border-matrix-muted hover:border-matrix-red text-matrix-muted hover:text-matrix-red bg-matrix-black transition-all flex items-center gap-1"
          title="Limpar Logs do Terminal"
        >
          <Trash2 className="w-3 h-3" />
          <span>[CLEAR_LOGS]</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="h-32 sm:h-40 overflow-y-auto bg-matrix-black border border-matrix-muted/60 p-2.5 font-mono text-xs space-y-1"
      >
        {logs.length === 0 ? (
          <p className="text-matrix-muted italic">-- Console do Terminal inicializado. Aguardando comandos... --</p>
        ) : (
          logs.map((log) => {
            let badgeColor = 'text-matrix-green';
            if (log.type === 'success') badgeColor = 'text-matrix-mint font-bold';
            if (log.type === 'warn') badgeColor = 'text-matrix-warning font-bold';
            if (log.type === 'error') badgeColor = 'text-matrix-red font-bold';

            return (
              <div key={log.id} className="leading-relaxed flex items-start gap-2">
                <span className="text-matrix-muted select-none">[{log.timestamp}]</span>
                <span className={badgeColor}>[{log.type.toUpperCase()}]</span>
                <span className="text-matrix-green/90 break-all">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
