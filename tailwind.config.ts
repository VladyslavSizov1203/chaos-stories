import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      keyframes: {
        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'scene-enter': {
          from: {
            opacity: '0',
            transform: 'scale(1.02)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'scene-exit': {
          from: {
            opacity: '1',
            transform: 'scale(1)',
          },
          to: {
            opacity: '0',
            transform: 'scale(0.98)',
          },
        },
      },
      animation: {
        'slide-up': 'slide-up 300ms ease-out',
        'fade-in': 'fade-in 300ms ease-out',
        'fade-out': 'fade-out 300ms ease-out',
        'scene-enter': 'scene-enter 300ms ease-out',
        'scene-exit': 'scene-exit 300ms ease-out',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
