const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        mono: ["Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", "monospace"],
      },
      colors: {
        primary: colors.sky,
        gray: colors.neutral,
      },
      boxShadow: {
        light: "0 0 12px 0 rgba(0, 0, 0, 0.09)",
        "light-lg": "0 2px 20px 0 rgba(0, 0, 0, 0.09)",
        dark: "0 1px 1px 0 rgba(60, 60, 60, 0.6)",
        "card-dark": "0 0 2px 1px rgba(60, 60, 60, 0.6)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
