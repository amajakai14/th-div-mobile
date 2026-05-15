/** @type {import('tailwindcss').Config} */
// NOTE: Tailwind CSS v4 is CSS-first. Design tokens live in src/global.css via @theme.
// This file is kept for tooling compatibility (e.g. IDE autocomplete) but the
// authoritative color definitions are in src/global.css.
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F4EE',
        surface: '#FFFFFF',
        surface2: '#F0EDE6',
        text: '#15181D',
        muted: '#8A8478',
        'out-month': '#C9C3B5',
        divider: '#E7E2D6',
        'selected-bg': '#EBE6D8',
        xd: '#E25241',
        pay: '#1F9D6B',
        today: '#2D6CDF',
        weekend: '#B65A7B',
      },
    },
  },
  plugins: [],
};
