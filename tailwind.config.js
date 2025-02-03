/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': {opacity: 0},
          '100%': {opacity: 1},

        }
      },
      animation: {
        fadeIn: 'fadeIn 1.5s'
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio")
  ],
};