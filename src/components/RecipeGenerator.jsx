import React, { useState } from "react";
import axios from "axios";

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);

    const payload = {
      pantry: ingredients.split(",").map(i => i.trim()),
      diet: "vegetarian",
      constraints: { time_minutes: 20 }
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/recipes/generate", payload);
      setRecipe(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">🍳 Snap2Cook Recipe Generator</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block mb-2 text-gray-700 font-medium">Enter ingredients (comma-separated):</label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., rice, tomato, onion"
          className="w-full border rounded-lg p-3 mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {recipe && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">{recipe.title}</h2>

          <h3 className="font-medium mt-3">🧂 Ingredients:</h3>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing.qty} {ing.name}</li>
            ))}
          </ul>

          <h3 className="font-medium mt-4">🍳 Instructions:</h3>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          <h3 className="font-medium mt-4">⚖️ Nutrition:</h3>
          <p>
            {recipe.nutrition.calories} kcal • Protein {recipe.nutrition.protein}g •
            Carbs {recipe.nutrition.carbs}g • Fat {recipe.nutrition.fat}g
          </p>

          <h3 className="font-medium mt-4">🛒 Missing items:</h3>
          <p>{recipe.missing_items.join(", ")}</p>

          <p className="text-gray-600 mt-4 text-sm italic">{recipe.explanation}</p>
        </div>
      )}
    </div>
  );
}
