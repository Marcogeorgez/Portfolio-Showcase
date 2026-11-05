import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Portfolio-Showcase/",
  root: "client",
  plugins: [react(), tailwindcss()],
  build: {
    // three.js is lazy-loaded for the hero scene, so its own chunk is expected to be large.
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
});
