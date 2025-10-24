import CONFIG from "../config";

// 🍳 Generate Recipe from backend API
export async function generateRecipe(ingredients) {
  try {
    const apiUrl = `${CONFIG.API_BASE_URL}/recipes/generate`;
    console.log("📡 Sending request to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pantry: ingredients.map((i) => i.name),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recipe: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Recipe generated successfully:", data);
    return data;
  } catch (error) {
    console.error("🔥 Error fetching recipe:", error);
    throw error;
  }
}
