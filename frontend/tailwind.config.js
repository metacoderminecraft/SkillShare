/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7E60BF',     // Deep Purple
        secondary: '#E4B1F0',   // Light Purple/Pink
        accent: '#FFE1FF',      // Very Light Pink
        background: '#FAF7F0',  // Light Beige/Off-White
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['focus'],
      ringColor: ['focus'],
    },
  },
  plugins: [],
}