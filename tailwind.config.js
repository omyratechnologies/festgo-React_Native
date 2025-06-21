/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: require('./src/theme/theme').colors,
      fontFamily: {
        blackshield: ['BlackShield'],
        baloo: ['Baloo'],
      },
    },
  },
  plugins: [],
};
