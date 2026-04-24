/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-space)', 'monospace'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c2d5ff',
          300: '#93b4ff',
          400: '#5e8eff',
          500: '#3d6ef5',
          600: '#2a51e8',
          700: '#1f3ed4',
          800: '#1e35ab',
          900: '#1d3186',
        },
        accent: {
          cyan:   '#00e5ff',
          lime:   '#aaff00',
          amber:  '#ffb800',
          coral:  '#ff5757',
          violet: '#a855f7',
        },
        surface: {
          0:   '#f8fafc', // Screen background
          1:   '#ffffff', // Cards and panels
          2:   '#f1f5f9', // Sub-panels and inputs
          3:   '#e2e8f0', // Hover states
          4:   '#cbd5e1', // Borders and dividers
          5:   '#94a3b8', // Muted elements
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v1H0zM0 0v40h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-blue':   '0 10px 40px -10px rgba(61, 110, 245, 0.3)',
        'glow-cyan':   '0 10px 40px -10px rgba(0, 229, 255, 0.2)',
        'glow-lime':   '0 10px 40px -10px rgba(170, 255, 0, 0.2)',
        'card':        '0 2px 20px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.02)',
        'card-hover':  '0 10px 40px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};