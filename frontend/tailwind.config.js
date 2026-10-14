/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#15110E", // fondo base, negro calido (no negro puro)
          surface: "#1F1A16",
          raised: "#2A231D",
          line: "#3A312A",
        },
        coral: {
          DEFAULT: "#FF5A36", // acento primario de marca (🧡)
          soft: "#FF7A5C",
          dim: "#C94526",
        },
        gold: {
          DEFAULT: "#F5B942", // acento secundario, precios / highlights
        },
        moss: {
          DEFAULT: "#8FD14F", // estados activos / confirmaciones, tono apagado (no verde acido)
        },
        cream: {
          DEFAULT: "#F7F3EE", // texto principal sobre fondo oscuro
          muted: "#BBAFA1",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        lg: "6px",
      },
    },
  },
  plugins: [],
};
