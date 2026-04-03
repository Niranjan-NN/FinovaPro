/**
 * ============================================================
 * vite.config.js — Vite Build Configuration
 * ============================================================
 * Uses @vitejs/plugin-react for fast refresh (HMR) in dev mode
 * and JSX transform in production builds.
 *
 * No extra config needed for Tailwind — PostCSS handles it
 * automatically via postcss.config.js.
 * ============================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Dev server settings
  server: {
    port: 5173,
    open: true   // auto-open browser on `npm run dev`
  },

  // Build output — goes to /dist
  build: {
    outDir: "dist",
    sourcemap: true   // useful for debugging production builds
  }
});
