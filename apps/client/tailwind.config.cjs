/* eslint @typescript-eslint/no-var-requires: "off" */
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backdrop: colors.gray["900"],
        muted: colors.gray["500"],
        primary: colors.red["500"],
        gray: {
          DEFAULT: colors.gray["400"],
          ...colors.gray,
        },
        highlight: colors.gray["100"],
      },
      borderColor: {
        DEFAULT: colors.gray["600"],
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-out",
      },
    },
  },
  plugins: [],
}
