import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Clean config — Vercel automatically injects env vars during build
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely expose the backend URL at build time
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL || "https://web-production-f4ec.up.railway.app"
    ),
  },
});
