/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./apps/myjumpdata/src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
    },
  },
};
