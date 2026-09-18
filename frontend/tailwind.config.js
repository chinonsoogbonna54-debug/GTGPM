/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Pulled directly from the GTGPM logo — see /public/logo.jpg
        brand: {
          red: "#B91C1C",
          redDark: "#7F1414",
          ink: "#0A0A0A",
          bg: "#FAFAFA",
          gold: "#D4AF37",
          grey: "#525252",
          line: "#E5E5E5",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
