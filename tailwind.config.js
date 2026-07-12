/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0b0c0f",
          900: "#131418",
          800: "#1b1d23",
          700: "#24262e",
          600: "#33353f",
          500: "#4a4d5a",
        },
        mist: { 100: "#f5f5f7", 200: "#e4e4e9", 400: "#9a9ba6" },
        signal: { DEFAULT: "#6e5bff", soft: "#8a7bff", dim: "#4a3ecf" },
        coral: "#ff6b5b",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(110,91,255,0.4), 0 0 24px rgba(110,91,255,0.25)",
      },
      keyframes: {
        pulseMarker: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.6" },
        },
      },
      animation: { pulseMarker: "pulseMarker 1.6s ease-in-out infinite" },
    },
  },
  plugins: [],
};
