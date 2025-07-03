/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  darkMode: 'class',
  plugins: [
    require('daisyui'),             
    require('@tailwindcss/forms'),  // optional
    require('tw-animate-css'),      // optional
  ],
  daisyui: { themes: ['light','dark'], styled: true, base: true },
};
