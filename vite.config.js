import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ No dotenv import — Vercel automatically injects environment variables
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(process.env.VITE_API_BASE_URL),
  },
});
