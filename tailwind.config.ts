const { fontFamily } = require("tailwindcss/defaultTheme");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
 
/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      borderColor: {
        border: "var(--border)",
      },
      outlineColor: {
        ring: "var(--ring)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
