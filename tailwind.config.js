/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'debug': '#1a1a1a',
        'debug-text': '#00ff00',
        'debug-border': '#333333',
      }
    },
  },
  plugins: [],
}

