import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Trash2 } from "lucide-react";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ Please log in to view your saved recipes.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/recipes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      } else {
        setMessage("❌ Failed to fetch your recipes.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/recipes/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRecipes(recipes.filter((r) => r.id !== id));
        setMessage("🗑️ Recipe deleted successfully!");
      } else {
        setMessage("❌ Failed to delete recipe.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting recipe.");
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center mt-10 w-full px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <Heart size={28} /> My Saved Recipes
      </h1>

      {loading ? (
        <p className="text-gray-500 text-lg">Loading your recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          {message || "You haven’t saved any recipes yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {recipes.map((r) => {
            const recipeData = JSON.parse(r.recipe_data);
            return (
              <motion.div
                key={r.id}
                className="bg-white border shadow-md rounded-xl p-5"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {r.title}
                  </h2>
                  <button
                    onClick={() => deleteRecipe(r.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Recipe"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* ⭐ Rating */}
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Ingredients */}
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  🧂 Ingredients:
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-600 mb-3">
                  {recipeData.ingredients.slice(0, 4).map((i, idx) => (
                    <li key={idx}>{i.name}</li>
                  ))}
                  {recipeData.ingredients.length > 4 && <li>...more</li>}
                </ul>

                {/* Instructions preview */}
                <p className="text-sm text-gray-600 italic mb-2">
                  {recipeData.instructions[0]}...
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </motion.div>
  );
}

export default MyRecipes;
