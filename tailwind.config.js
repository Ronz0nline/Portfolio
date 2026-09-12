/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#11110F",
        surface: "#11110F",
        "surface-low": "#161513",
        "surface-card": "#1c1b18",
        "surface-container": "#24221E",
        "surface-border": "rgba(232, 227, 217, 0.12)",
        "on-surface": "#E8E3D9",
        "on-surface-muted": "#8D887E",
        clay: "#B76545",
        "clay-dark": "#7F4636",
        terracotta: "#7F4636",
        stone: "#8D887E",
      },
      fontFamily: {
        sans: ["'DM Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      }
    },
  },
  plugins: [],
}
