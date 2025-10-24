import CONFIG from "../config";

export async function generateRecipe(ingredients) {
  try {
    const apiUrl = `${CONFIG.API_BASE_URL}/recipes/generate`;
    console.log("📡 Sending request to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pantry: ingredients.map(i => i.name) }),
    });

    // Read text instead of JSON to handle Azure's possible extra formatting
    const text = await response.text();
    console.log("🧾 Raw backend response:", text);

    if (!response.ok) {
      console.error("❌ Backend responded with:", text);
      throw new Error(`HTTP ${response.status}`);
    }

    // Gracefully handle empty or malformed responses
    if (!text || !text.includes("{")) {
      console.error("⚠️ Empty or invalid JSON from backend:", text);
      alert("⚠️ The backend returned an empty or invalid recipe. Check Railway logs.");
      return null;
    }

    let jsonStart = text.indexOf("{");
    let jsonEnd = text.lastIndexOf("}") + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("⚠️ JSON parsing failed:", parseError, "\nRaw:", jsonText);
      alert("⚠️ Backend sent invalid JSON — check logs for details.");
      return null;
    }

    console.log("✅ Parsed recipe:", data);
    return data;

  } catch (error) {
    console.error("🔥 Recipe fetch failed:", error.message || error);
    alert("❌ Failed to fetch recipe. Please check backend connection or Azure GPT.");
    return null;
  }
}
