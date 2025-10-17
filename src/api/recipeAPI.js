import CONFIG from "../config";

// 🍳 Generate Recipe from backend API
export async function generateRecipe(ingredients) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/recipes/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pantry: ingredients.map((i) => i.name), // backend expects a 'pantry' list
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recipe: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🔥 Error fetching recipe:", error);
    throw error;
  }
}
