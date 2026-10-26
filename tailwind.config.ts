import { type Config } from "tailwindcss";

// Brand tokens shared with the Maingoo app (Maingoo-Front DESIGN.md).
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f9f4",
          100: "#dcf2e4",
          200: "#bce5cd",
          300: "#8dd2ac",
          400: "#5ea37d",
          500: "#4a8c68",
          600: "#3a7154",
          700: "#2f5a44",
          800: "#274838",
          900: "#213c2f",
          950: "#10211a",
        },
        deep: "#1A3C34",
        ink: "#0f172a",
        muted: "#5b6b80",
      },
      borderRadius: {
        control: "10px",
        card: "14px",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
