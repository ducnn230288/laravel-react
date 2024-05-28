const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  safelist: [{ pattern: /col-span-/, variants: ['sm', 'lg'] }, 'w-7', 'h-7'],
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
      serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1280px',
    },
    extend: {
      fontSize: {
        xs: ['.6875rem', '.9375rem'],
        sm: ['.8125rem', '1.1875rem'],
      },
      keyframes: {
        shine: {
          '100%': { left: '125%' },
        },
        burgerHover: {
          '0%': { width: '100%' },
          '50%': { width: '50%' },
          '100%': { width: '100%' },
        },
        introXAnimation: {
          to: {
            opacity: '1',
            transform: 'translateX(0px)',
          },
        },
      },
      animation: {
        shine: 'shine 0.8s',
        'intro-x-animation': 'introXAnimation .4s ease-in-out forwards .33333s',
        'burger-hover-2': 'burgerHover 1s infinite ease-in-out alternate forwards 200ms',
        'burger-hover-4': 'burgerHover 1s infinite ease-in-out alternate forwards 400ms',
        'burger-hover-6': 'burgerHover 1s infinite ease-in-out alternate forwards 600ms',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: '#491eff',
          'primary-content': '#d4dbff',
          secondary: '#ff41c7',
          'secondary-content': '#fff9fc',
          accent: '#00cfbd',
          'accent-content': '#00100d',
          neutral: '#2b3440',
          'neutral-content': '#d7dde4',
          'base-100': '#fff',
          'base-200': '#e5e6e6',
          'base-300': '#e5e6e6',
          'base-content': '#1f2937',
          info: '#00b3f0',
          'info-content': '#000',
          success: '#00ca92',
          'success-content': '#000',
          warning: '#ffc22d',
          'warning-content': '#000',
          error: '#ff6f70',
          'error-content': '#000',
        },
        dark: {
          primary: '#7582ff',
          'primary-content': '#050617',
          secondary: '#ff71cf',
          'secondary-content': '#190211',
          accent: '#00c7b5',
          'accent-content': '#00100d',
          neutral: '#2a323c',
          'neutral-content': '#a6adbb',
          'base-100': '#1d232a',
          'base-200': '#191e24',
          'base-300': '#15191e',
          'base-content': '#a6adbb',
          info: '#00b3f0',
          'info-content': '#000',
          success: '#00ca92',
          'success-content': '#000',
          warning: '#ffc22d',
          'warning-content': '#000',
          error: '#ff6f70',
          'error-content': '#000',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
