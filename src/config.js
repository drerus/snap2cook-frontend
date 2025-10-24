// ✅ Global configuration for Snap2Cook Frontend

const CONFIG = {
  // 🔗 Always point to the deployed Railway backend
  API_BASE_URL:
    "https://web-production-f4ec.up.railway.app" ||
    "https://snap2cook-backend.up.railway.app", // optional fallback
};

// 🧩 Debug log to verify the correct backend URL is being used
if (typeof window !== "undefined") {
  console.log("🔍 Active API URL:", CONFIG.API_BASE_URL);
  if (CONFIG.API_BASE_URL.includes("127.0.0.1") || CONFIG.API_BASE_URL.includes("localhost")) {
    console.warn("⚠️ Warning: Frontend is pointing to localhost! Update API_BASE_URL in config.js");
  }
}

export default CONFIG;
