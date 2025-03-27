/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Rubik", "sans-serif"],
        secondry: ["Roboto Slab", "sans-serif"],
        title: ["Poppins", "sans-serif"],
        mainfont: ["Signika", "sans-serif"],
      },
    },
  },
  plugins: [],
};
