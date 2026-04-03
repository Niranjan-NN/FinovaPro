/**
 * ============================================================
 * tailwind.config.js
 * ============================================================
 * Tailwind CSS v3 configuration.
 * The `content` array tells Tailwind which files to scan for
 * class usage when purging unused styles in production.
 * ============================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Scan all JSX/JS files inside src/
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  // No forced dark mode class — toggled via inline styles in App
  darkMode: "class",

  theme: {
    extend: {
      // Custom font family (loaded via Google Fonts in App.jsx)
      fontFamily: {
        sans: ["DM Sans", "sans-serif"]
      },

      // Extended border-radius for the pill/card aesthetic
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },

      // Custom box-shadow tokens used on active nav items
      boxShadow: {
        "indigo-glow": "0 10px 15px -3px rgba(99, 102, 241, 0.3)"
      }
    }
  },

  plugins: []
};
