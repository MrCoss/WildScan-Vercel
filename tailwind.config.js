/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sand-light': '#EBD9A3',   // light sandy color
        'earth-dark': '#A86B3F',   // deep earthy brown
        'grass-green': '#8FB339',  // soft green
        'leaf-dark': '#4C7C3F',    // dark green
        'water-blue': '#6AB0DE',   // accent blue
      },
    },
  },
  plugins: [],
};
