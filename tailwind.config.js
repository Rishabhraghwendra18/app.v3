const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: {
          normal: "#5a6972",
          bright: "#979797",
          bluish: "#2e5da9",
          light: "#eaeaea",
        },
        black: {
          normal: "#12141a",
        },
        blue: {
          bright: "#0061ff",
          light: "#99ccff",
          lighter: "#dff1ff",
          border: "#abc8d8",
          lightbg: "#fafafa",
          bg: "#f0f8ff",
          darkbg: "#000f29",
        },
        purple: {
          bright: "#e70aab",
        },
        red: {
          bright: "#f45151",
          light: "#ffdcdc",
          lighter: "#ffebeb",
        },
        green: {
          bright: "#5fe086",
          light: "#d9ffe2",
          lighter: "#eefff2",
        },
      },
      borderWidth: {
        1: "1px",
      },
      fontFamily: {
        sans: ["Archivo", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "2xs": "0.5rem",
        "3xs": "0.35rem",
      },
      scale: {
        102: "1.02",
        103: "1.03",
      },
    },
  },
  plugins: [],
};
