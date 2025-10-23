const CONFIG = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://web-production-f4ec.up.railway.app", // <-- your actual backend URL
};

console.log("✅ Using API_BASE_URL:", CONFIG.API_BASE_URL);

export default CONFIG;
