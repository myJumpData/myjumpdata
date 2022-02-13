module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: { config: "./apps/myjumpdata/tailwind.config.js" },
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
