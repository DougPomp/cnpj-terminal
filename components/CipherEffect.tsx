'use client';

import React, { useState, useEffect } from 'react';

interface CipherEffectProps {
  text: string;
  speed?: number; // milissegundos por quadro
  className?: string;
}

const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

export const CipherEffect: React.FC<CipherEffectProps> = ({
  text,
  speed = 25,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState<string>('');

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    let frame = 0;
    const totalFrames = text.length * 3;
    const interval = setInterval(() => {
      frame++;

      const revealedLength = Math.floor((frame / totalFrames) * text.length);
      let result = text.slice(0, revealedLength);

      for (let i = revealedLength; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else {
          const randChar = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
          result += randChar;
        }
      }

      setDisplayText(result);

      if (frame >= totalFrames) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayText || text}</span>;
};
