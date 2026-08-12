'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  enabled: boolean;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres Matrix (Katakana + Números + Hex)
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    // Aleatorizar início das quedas
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    let fpsInterval = 1000 / 24; // 24 FPS retro
    let then = Date.now();

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      const now = Date.now();
      const elapsed = now - then;

      if (elapsed < fpsInterval) return;
      then = now - (elapsed % fpsInterval);

      // Fundo preto semitransparente para criar rastro
      ctx.fillStyle = 'rgba(2, 11, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Cabeça da gota mais brilhante (mint neon)
        if (Math.random() > 0.9) {
          ctx.fillStyle = '#33FF77';
        } else {
          ctx.fillStyle = 'rgba(0, 255, 65, 0.7)';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-25"
    />
  );
};
