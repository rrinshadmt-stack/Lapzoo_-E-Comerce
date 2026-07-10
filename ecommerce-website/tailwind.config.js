/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
  extend: {
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translate(0px, 0px)' },
        '25%': { transform: 'translate(15px, -10px)' },
        '50%': { transform: 'translate(-15px, 10px)' },
        '75%': { transform: 'translate(10px, -15px)' },
      },
    },
    animation: {
      float: 'float 10s ease-in-out infinite',
    },
  },
},


  plugins: [],
}
