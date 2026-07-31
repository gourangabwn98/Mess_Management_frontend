/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3EEE2",
        card: "#FBF8F0",
        ink: "#1E2A38",
        inkSoft: "#2a3a4c",
        rule: "#B03A2E",
        turmeric: "#D9A621",
        good: "#2F6F4E",
        muted: "#8b8266",
        border: "#c9bd9e",
        divider: "#e0d8bf",
        hover: "#e6dfc9",
      },
      fontFamily: {
        display: ["'Zilla Slab'", "serif"],
        bn: ["'Noto Sans Bengali'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        num: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
