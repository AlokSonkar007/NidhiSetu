/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Source Sans 3', 'Arial', 'sans-serif'] },
      colors: {
        ink: '#20334D',
        navy: '#20334D',
        bank: '#315F8B',
        slateblue: '#6885A2',
        canvas: '#F7F9FC',
        line: '#E5EAF0',
        good: '#438568',
        warn: '#C18A38',
        critical: '#B95350',
      },
      boxShadow: { panel: '0 2px 10px rgba(32,51,77,.045)' },
    },
  },
  plugins: [],
};