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
        obsidian: {
          DEFAULT: "#06030C",
          950: "#06030C",
          900: "#0B0716",
          800: "#130D24",
          700: "#1D1435",
          600: "#2B1E4A",
        },
        amethyst: {
          DEFAULT: "#8E4585",
          300: "#C476BB",
          400: "#A8539C",
          500: "#8E4585",
          600: "#74356C",
          700: "#5A2854",
        },
        electric: {
          DEFAULT: "#00E5FF",
          300: "#6BF2FF",
          400: "#2BEAFF",
          500: "#00E5FF",
          600: "#00B8CC",
          700: "#008B99",
        },
        navy: {
          950: "#06030C", // Obsidian Black mapped for backwards compatibility
          900: "#0B0716",
          800: "#130D24",
          700: "#1D1435",
          600: "#2B1E4A",
        },
        cyan: {
          400: "#00E5FF", // Electric Cyan mapped
          500: "#00E5FF",
          600: "#00B8CC",
        },
        violet: {
          400: "#A8539C",
          500: "#8E4585", // Royal Amethyst mapped
          600: "#74356C",
        },
        amber: {
          400: "#fbbf24",
        },
        coral: {
          400: "#fb7185",
        },
      },
      boxShadow: {
        glow: "0 0 20px -3px rgba(0,229,255,0.35), 0 0 10px rgba(142,69,133,0.3)",
        glowPurple: "0 0 20px -3px rgba(142,69,133,0.45)",
        card: "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 36px -12px rgba(0,0,0,0.75)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(65% 55% at 50% 0%, rgba(142,69,133,0.18) 0%, rgba(0,229,255,0.12) 35%, rgba(6,3,12,0) 70%)",
        "ezen-gradient":
          "linear-gradient(135deg, #00E5FF 0%, #8E4585 100%)",
      },
    },
  },
  plugins: [],
};
