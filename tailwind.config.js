// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4D6D9E',
          hover: '#3A5A8F',
          light: '#E3F2FD',
        },
        secondary: {
          DEFAULT: '#FF66CC',
          hover: '#ff4dc2',
        },
        accent: '#E6A699',
        dark: '#2C3E50',
        light: '#F8F9FA',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        primary: ['Outfit', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}