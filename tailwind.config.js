/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/index.html", "./src/renderer/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        ss: ["0.5rem", "0.75rem"],
        xx: ["0.65rem", "0.9rem"],
      },
      borderRadius: {
        "50%": "50%",
      },
      backgroundColor: {
        "black-50": "rgb(49,48,45)",
      },
    },
  },
  plugins: [],
}
