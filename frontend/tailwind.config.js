/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {    extend: {
      colors: {
        // Tema moderno e elegante - cores inspiradas em bibliotecas modernas
        primary: "#fdfeff", // Branco quase puro
        secondary: "#1a365d", // Azul escuro profissional
        secondaryOne: "#4fd1c7", // Verde-azul moderno (accent)
        tertiary: "#2d3748", // Cinza escuro sofisticado
        accent: "#e53e3e", // Vermelho coral para destaques
        muted: "#f7fafc", // Cinza muito claro para backgrounds
        gray: {
          10: "#f8f9fa",
          20: "#9ca3af",
          30: "#6b7280",
          50: "#4b5563",
          90: "#1f2937",
        },
        // Cores adicionais para um design mais rico
        sage: "#9ca984", // Verde sage suave
        cream: "#f9f7f4", // Creme quente
        navy: "#1e3a8a", // Azul marinho
        gold: "#f59e0b", // Dourado para elementos premium
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
      },
    },
  },
  plugins: [],
}

