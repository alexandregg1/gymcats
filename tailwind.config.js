/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        // Base "aço/grafite" - fundo escuro de alto contraste (uso em academia)
        graphite: {
          950: '#0E0F11',
          900: '#15171A',
          800: '#1D2024',
          700: '#2A2E34',
          600: '#3A3F47',
          500: '#565C66',
          400: '#7C828C',
          300: '#A6ABB3',
          200: '#D2D4D8',
          100: '#EDEEEF',
        },
        // Acento primário roxo - destaque energético e moderno
        sulfur: {
          600: '#6D28D9',
          500: '#7C3AED',
          400: '#A855F7',
          300: '#C084FC',
        },
        // Acento secundário "giz azul" - usado em tags de grupo muscular e info neutra
        chalk: {
          600: '#2E4F7A',
          500: '#3F6BA6',
          400: '#5B87C2',
          300: '#8FADD9',
        },
        // Estados
        danger: {
          500: '#C0392B',
          400: '#E05A4A',
        },
        success: {
          500: '#3F8C57',
          400: '#57B072',
        },
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 20px -12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
