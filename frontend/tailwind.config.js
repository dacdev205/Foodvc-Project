/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#39d84A",
        red: "#FF6868",
        secondary: "#555",
        primaryBG: "#FCFCFC",
      },
    },
  },
  darkMode: false,
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar"),
    { nocompatible: true },
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "#39d84A white",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#39d84A",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#39d84A",
            borderRadius: "20px",
            border: "1px solid grey",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
