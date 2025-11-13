// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  
  // ¡EL GRAN CAMBIO ESTÁ AQUÍ!
  // Ya no usamos "extend" para las claves principales.
  theme: {
    // ----------------------------------------------------
    // 1. FUENTE (Reemplaza la fuente por defecto)
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
    // ----------------------------------------------------
    
    // 2. COLORES (Reemplaza los colores por defecto)
    colors: {
      // --- Incluimos los colores base para que sigan funcionando ---
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      
      // --- Y AHORA, NUESTRA PALETA PERSONALIZADA ---
      
      // NEUTRAL (Seriedad, Fondos, Texto)
      neutral: colors.slate,
      
      // PRIMARY (Energía, Acción)
      primary: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316',
        600: '#FF6F00', // <-- SU COLOR DE MARCA
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
        905: '#431407', // Corrección: 950
      },
      
      // SECONDARY (Confianza, Técnico)
      secondary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1', // <-- SU COLOR SECUNDARIO
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
        950: '#1E1B4B',
      },
      
      // ACCENT (Para etiquetas, éxito, etc.)
      accent: {
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        300: '#5EEAD4',
        400: '#2DD4BF',
        500: '#14B8A6', // <-- SU COLOR DE ACENTO
        600: '#0D9488',
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
        950: '#042f2e',
      },
    },
    // ----------------------------------------------------
    
    // 3. EXTEND (Opcional, para otras cosas)
    // Dejamos "extend" por si en el futuro queremos AÑADIR
    // algo a la paleta de espaciado, por ejemplo, pero
    // colors y fontFamily están FUERA.
    extend: {
      // (Aquí podríamos añadir cosas como 'spacing', etc.)
    }
  },
  
  plugins: [],
};