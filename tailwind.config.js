/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb",        // يعادل gray-200
        background: "#ffffff",    // أبيض
        foreground: "#000000",    // أسود
        ring: "#3b82f6",          // يعادل blue-500
      },
    },
  },
  plugins: [],
}
