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
        background: '#08060b',
        surface: {
          DEFAULT: '#110c17',
          light: '#1b1325',
          lighter: '#261b34',
          card: 'rgba(23, 15, 33, 0.75)',
        },
        primary: {
          DEFAULT: '#ff2d78',
          hover: '#ff4b8e',
          light: '#ff70a5',
          dark: '#db135d',
        },
        rose: {
          500: '#f43f5e',
          600: '#e11d48',
        },
        neon: {
          pink: '#ff2d78',
          magenta: '#e024c3',
          purple: '#9333ea',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(255, 45, 120, 0.35)',
        'glow-md': '0 0 25px rgba(255, 45, 120, 0.5)',
        'glow-lg': '0 0 45px rgba(255, 45, 120, 0.65)',
        'glow-card': '0 10px 30px -10px rgba(255, 45, 120, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
