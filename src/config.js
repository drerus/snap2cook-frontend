const CONFIG = {
  // Uses Vercel environment variable if available; otherwise defaults to localhost
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://web-production-f4ec.up.railway.app",
};

export default CONFIG;
