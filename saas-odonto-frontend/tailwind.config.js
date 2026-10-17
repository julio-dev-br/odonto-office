/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Injeção da nossa identidade visual premium (Design High-Tech)
        'deep-obsidian': '#0F172A',   // Elegância para fundos, sidebars e texto principal
        'mint-clean': '#10B981',      // Botões de conversão (CTA) e saldos positivos de caixa
        'soft-platinum': '#F8FAFC',   // Fundo ultra-limpo para cards no estilo Apple
        'dentistry-teal': '#06B6D4',  // Destaques sutis, ícones ativos e links da agenda
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
