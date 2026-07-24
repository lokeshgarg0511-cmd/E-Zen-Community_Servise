/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#070b14",
          900: "#0b1120",
          800: "#111a2e",
          700: "#1a2540",
          600: "#243454",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
        amber: {
          400: "#fbbf24",
        },
        coral: {
          400: "#fb7185",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 8px 30px -8px rgba(34,211,238,0.25)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 30px -12px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(34,211,238,0.10) 0%, rgba(0,0,0,0) 60%)",
      },
    },
  },
  plugins: [],
};
