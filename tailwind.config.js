/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        "50%": "50%",
      },
      backgroundColor: {
        "black-50": "rgb(49,48,45)",
      },
    },
  },
  plugins: [],
};
