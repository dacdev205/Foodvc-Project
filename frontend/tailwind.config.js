/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "green": "#39d84A",
        "red": "#FF6868",
        "secondary":"#555",
        "primaryBG":"#FCFCFC",
      }
    },
  },
  plugins: [require("daisyui")],
  
  
}

