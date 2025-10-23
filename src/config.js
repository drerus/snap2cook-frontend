const CONFIG = {
  // ✅ Use Vercel variable first, fallback to Railway
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    "https://web-production-f4ec.up.railway.app",
};

console.log("🔍 Loaded API_BASE_URL:", CONFIG.API_BASE_URL); // <-- debug log
export default CONFIG;
