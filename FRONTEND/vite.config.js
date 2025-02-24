import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite"; // Using Tailwind's Vite plugin

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  plugins: [react(), tailwind()],
  root: ".",  // Ensure root is set correctly
    build: {
        outDir: "dist",
    },
});

