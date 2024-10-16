/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        customGray: '#333333',
        customDarkGray: '#242424',
      },
    },
  },
  plugins: [],
};
