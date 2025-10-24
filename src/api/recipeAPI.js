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

    // Read text instead of JSON to handle Azure's formatting issues
    const text = await response.text();
    console.log("🧾 Raw backend response:", text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // Try to safely parse JSON, even if there's extra text around it
    let jsonStart = text.indexOf("{");
    let jsonEnd = text.lastIndexOf("}") + 1;
    let jsonText = text.slice(jsonStart, jsonEnd);

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("⚠️ JSON parsing failed:", parseError);
      throw new Error("Invalid JSON received from backend");
    }

    console.log("✅ Parsed recipe:", data);
    return data;

  } catch (error) {
    console.error("🔥 Recipe fetch failed:", error);
    alert("Failed to fetch recipe. Please check backend connection.");
    throw error;
  }
}
