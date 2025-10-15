import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Leaf, Clock, RefreshCcw, Star, Heart } from "lucide-react";

function Step2({ ingredients, onBack }) {
  const [diet, setDiet] = useState("");
  const [maxTime, setMaxTime] = useState(30);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0); // ⭐ rating
  const [message, setMessage] = useState(""); // feedback message

  // Auto-generate recipe when component loads
  useEffect(() => {
    if (ingredients.length > 0) getRecipe();
  }, []);

  const getRecipe = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantry: ingredients.map((i) => i.name),
          diet,
          constraints: { time_minutes: maxTime },
        }),
      });
      const data = await res.json();
      setRecipe(data);
      setRating(0);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch recipe. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Save recipe to backend
  const saveRecipe = async () => {
    if (!recipe) return;
    if (rating === 0) {
      alert("Please rate the recipe before saving ⭐");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save recipes.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: recipe.title,
          recipe_data: JSON.stringify(recipe),
          rating: rating,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Recipe saved to your 'My Recipes'!");
      } else {
        setMessage(`❌ ${data.detail || "Failed to save recipe"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving recipe");
    }
  };

  // ⭐ Rating component
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={28}
          onClick={() => setRating(i)}
          className={`cursor-pointer transition ${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex justify-center mt-4">{stars}</div>;
  };

  return (
    <motion.div
      className="flex flex-col items-center mt-10 text-gray-800 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <Utensils size={28} /> AI-Generated Recipe
      </h1>

      {/* Controls */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white shadow-md p-4 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <label className="font-semibold mr-2">Dietary Preference:</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten Free</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} />
          <label className="font-semibold mr-2">Max Time (min):</label>
          <input
            type="number"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            className="border p-2 rounded-md w-20 text-center"
          />
        </div>

        <button
          onClick={getRecipe}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          {loading ? "Regenerating..." : "Regenerate"}
        </button>
      </motion.div>

      {/* Recipe Loading */}
      {loading && (
        <motion.p
          className="text-gray-500 mt-4 text-lg"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          🍳 Cooking up your recipe...
        </motion.p>
      )}

      {/* Recipe Display */}
      {recipe && !loading && (
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl w-full text-left border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-3 flex items-center gap-2">
            <Leaf size={22} />
            {recipe.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-2">🧂 Ingredients</h3>
              <ul className="list-disc ml-6 mb-4 text-sm">
                {recipe.ingredients.map((i, idx) => (
                  <li key={idx}>
                    {i.name} – {i.qty || "as needed"}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition */}
            <div>
              <h3 className="text-lg font-semibold mb-2">⚖️ Nutrition Info</h3>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                <p>Calories: {recipe.nutrition.calories} kcal</p>
                <p>Protein: {recipe.nutrition.protein} g</p>
                <p>Carbs: {recipe.nutrition.carbs} g</p>
                <p>Fat: {recipe.nutrition.fat} g</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <h3 className="text-lg font-semibold mb-2 mt-6">🍳 Instructions</h3>
          <ol className="list-decimal ml-6 mb-4 text-sm">
            {recipe.instructions.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                {step}
              </motion.li>
            ))}
          </ol>

          {/* Missing Items */}
          <h3 className="text-lg font-semibold mb-1">🛒 Missing Items</h3>
          <p className="text-sm text-gray-700 mb-4">
            {recipe.missing_items?.join(", ") || "None"}
          </p>

          {/* Explanation */}
          <p className="text-sm italic text-gray-600 border-t pt-3 mb-4">
            {recipe.explanation}
          </p>

          {/* ⭐ Rating + ❤️ Save */}
          <div className="text-center mt-6">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">
              Rate this recipe
            </h4>
            {renderStars()}
            <button
              onClick={saveRecipe}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto"
            >
              <Heart size={18} /> Save to My Recipes
            </button>
            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          ← Back
        </button>
      </div>
    </motion.div>
  );
}

export default Step2;
