import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Prevents Vite from trying to polyfill Node env
  },
  server: {
    host: true,
    port: 5173,
  },
});
