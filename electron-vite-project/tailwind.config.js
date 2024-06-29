/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      width: {
        '80rem': '80rem', // Definimos el ancho personalizado de 80rem
      },
      boxShadow: {
        '1': 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      },
      borderRadius:{
        '1':'2rem'
      },
      backgroundColor: {
        'oscuro': '#333333',
      },
    },
  },
  plugins: [],
}

