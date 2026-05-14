/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: '#050505',
        graphite: '#101012',
        ember: '#ff2f45',
        rouge: '#9c0f22',
      },
      boxShadow: {
        neon: '0 0 48px rgba(255, 47, 69, 0.28)',
      },
    },
  },
  plugins: [],
};
