/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      width: {
        '80rem': '80rem', // Definimos el ancho personalizado de 80rem
      },
      boxShadow: { "para llamarlo es:":{/*shadow-(clave)*/},
        '1': 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        'interno':'rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(0, 0, 0, 0.20) 0px -2px 12px 0px inset',
      },
      borderRadius:{
        '1':'2rem'
      },
      backgroundColor: {
        'oscuro': '#333333',
      },
      translate: {
        '7.5rem': '7.5rem', 
      },
      lineClamp: {
        4: '4',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),],
}

