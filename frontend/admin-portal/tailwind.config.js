/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          banking: {
            bg: "#020617",
            card: "#020617",
            accent: "#0ea5e9",
            accentSoft: "#1d4ed8",
            danger: "#f97316",
            success: "#22c55e",
          },
        },
        boxShadow: {
          banking: "0 18px 45px rgba(15,23,42,0.85)",
        },
        borderRadius: {
          xl2: "1rem",
        },
      },
    },
    plugins: [],
  };
  