'use client';

import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAProvider: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Registrar Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registrado com sucesso:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Falha ao registrar Service Worker:', err);
          });
      });
    }

    // Capturar evento de instalação do PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    soundFx.playBeep();
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      soundFx.playSuccess();
    }
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleInstallClick}
        className="px-4 py-2.5 border-2 border-matrix-green bg-matrix-black text-matrix-green hover:bg-matrix-green hover:text-matrix-black font-mono font-bold text-xs shadow-[4px_4px_0px_0px_#00FF41] transition-all flex items-center gap-2"
        title="Instalar CNPJ Terminal como aplicativo no seu dispositivo"
      >
        <Download className="w-4 h-4 animate-bounce text-matrix-mint" />
        <span>[INSTALAR_APP // PWA]</span>
      </button>
    </div>
  );
};
