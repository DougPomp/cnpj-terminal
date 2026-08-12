'use client';

import React from 'react';

interface CRTContainerProps {
  children: React.ReactNode;
  crtEnabled: boolean;
}

export const CRTContainer: React.FC<CRTContainerProps> = ({ children, crtEnabled }) => {
  return (
    <div className={`min-h-screen relative bg-matrix-black ${crtEnabled ? 'crt-screen animate-flicker' : ''}`}>
      {/* Scanline Overlay */}
      {crtEnabled && <div className="crt-overlay" />}

      {/* Conteúdo Principal do Terminal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
