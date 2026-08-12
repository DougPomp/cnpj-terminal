import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          black: '#020B05',
          green: '#00FF41',
          mint: '#33FF77',
          darkGreen: '#00220A',
          warning: '#FFD700',
          red: '#FF0033',
          muted: '#005511',
        },
      },
      fontFamily: {
        mono: ['var(--font-share-tech-mono)', 'monospace'],
      },
      boxShadow: {
        brutalist: '5px 5px 0px 0px #00FF41',
        'brutalist-warning': '5px 5px 0px 0px #FFD700',
        'brutalist-red': '5px 5px 0px 0px #FF0033',
        'brutalist-sm': '3px 3px 0px 0px #00FF41',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.96' },
          '70%': { opacity: '0.98' },
        },
        pulseGlow: {
          '0%, 100%': { textShadow: '0 0 4px rgba(0, 255, 65, 0.6), 0 0 10px rgba(0, 255, 65, 0.4)' },
          '50%': { textShadow: '0 0 8px rgba(0, 255, 65, 0.9), 0 0 18px rgba(0, 255, 65, 0.7)' },
        },
      },
      animation: {
        flicker: 'flicker 0.15s infinite',
        glow: 'pulseGlow 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
