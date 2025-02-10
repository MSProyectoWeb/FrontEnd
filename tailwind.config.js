/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Incluye todos los archivos JavaScript y TypeScript
  ],
  theme: {
    extend: {
      colors: {
        principal: '#35352F',
        acento: '#D96531',
        fondo: '#EDEDED',
        'texto-principal': '#020204',
        'texto-secundario': '#4B4A45',
        exito: '#3FE1B2',
        'exito-50': 'rgba(63, 225, 178, 0.5)',  // Exito al 50% de opacidad
        error: '#D75A70',
        'error-50': 'rgba(215, 90, 112, 0.5)',  // Error al 50% de opacidad
        advertencia: '#E8CB6C',
        'advertencia-50': 'rgba(232, 203, 108, 0.5)',  // Advertencia al 50% de opacidad
        'fondo-claro': '#F8F8F8',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],  // Fuente predeterminada
        bebas: ['Bebas Neue', 'sans-serif'],  // Fuente Bebas Neue
        lato: ['Lato', 'sans-serif'],  // Fuente Lato
      },
    },
  },
  plugins: [],
}
