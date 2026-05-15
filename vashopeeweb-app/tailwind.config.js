/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E91E8C',
          light: '#F06BB7',
          dark: '#C2177A',
        },
        secondary: '#FF6B9D',
        accent: '#FFD6E8',
      },
    },
  },
  plugins: [],
}

