const CONFIG = {
  // ✅ Prefer the Vercel variable, fallback to Railway manually
  API_BASE_URL:
    import.meta.env?.VITE_API_BASE_URL?.trim() ||
    "https://web-production-f4ec.up.railway.app",
};

// Debug log
console.log("🔍 Loaded API_BASE_URL =>", CONFIG.API_BASE_URL);

export default CONFIG;
