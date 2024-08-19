/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Barlow', 'sans-serif'],
      },
      colors: {
        colorPrimary: '#F86F03',
      },
      container: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          // 2xl: '1536px', // Bạn có thể bỏ dòng này nếu không muốn kích thước 1536px
        },
      },
    },
  },
  plugins: [],
}

