/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./apps/myjumpdata/src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      animation: {
        "spin-reverse": "spin 1s linear infinite reverse",
      },
      screens: {
        xs: "480px",
      },
    },
  },
};
