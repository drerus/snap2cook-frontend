const CONFIG = {
  // ✅ Uses the API base URL from Vercel or local .env, with Railway as fallback
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://web-production-f4ec.up.railway.app",
};

// 🧠 Debug log (shows which API base URL is used)
console.log("🔍 Loaded API_BASE_URL =>", CONFIG.API_BASE_URL);

export default CONFIG;
