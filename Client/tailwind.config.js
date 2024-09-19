/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
      },
      colors: {
        colorPrimary: '#F86F03',
      },
      container: {
        screens: {
          sm: '540px',
          md: '720px',
          lg: '960px',
          xl: '1140px',
          '2xl': '1320px',
        },
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
        },
      },
    },
  },
  plugins: [],
};
