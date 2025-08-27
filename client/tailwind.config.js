// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#1c1e29',
        'dark-accent': '#282a36',
        'light': '#f8f8f2',
        'text-dark': '#44475a',
        'accent-green': '#50fa7b',
        'accent-blue': '#8be9fd',
        'accent-red': '#ff5555',
        'accent-yellow': '#f1fa8c',
      }
    },
  },
  plugins: [],
}