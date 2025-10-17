import { useState } from "react";
import { generateRecipe } from "../api/recipeAPI"; // ✅ added import

function Step1({ ingredients, setIngredients, onNext }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState([]);

  // ➕ Add ingredient manually
  const addIngredient = () => {
    if (text.trim() === "") return;
    const newItem = { name: text.trim(), confidence: 0.98 };
    setIngredients([...ingredients, newItem]);
    setDetected([...detected, newItem]);
    setText("");
  };

  // 📸 Upload and recognize ingredients
  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/ingredients/recognize", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.ingredients) {
        setDetected(data.ingredients);
        setIngredients(data.ingredients);
      } else {
        alert("No ingredients detected.");
      }
    } catch (err) {
      console.error(err);
      alert("Recognition failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Remove ingredient
  const removeIngredient = (index) => {
    const newList = detected.filter((_, i) => i !== index);
    setDetected(newList);
    setIngredients(newList);
  };

  // 🍳 Generate Smart Recipe using backend
  const handleNext = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);

    try {
      const result = await generateRecipe(ingredients);
      console.log("🍳 Recipe generated:", result);

      // ✅ Directly go to Step2 without alert popup
      onNext(result);

    } catch (err) {
      console.error("Error generating recipe:", err);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start text-gray-200 w-full bg-black h-screen overflow-hidden pt-6 sm:pt-10">
      {/* 🧩 Step 1 Section Card */}
      <div className="bg-gray-100 text-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-gray-300 transition-transform duration-300 hover:scale-[1.01] -mt-4 sm:-mt-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Step 1 – Add or Detect Ingredients
        </h2>

        {/* 📝 Manual Input */}
        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-3">
          <input
            type="text"
            placeholder="Enter ingredient..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-64 text-black focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            onClick={addIngredient}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Add
          </button>
        </div>

        {/* 📷 Image Upload */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-gray-800"
          />
          <button
            onClick={handleUpload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            {loading ? "Detecting..." : "Detect Ingredients"}
          </button>
        </div>

        {/* 🧩 Display Detected Ingredients */}
        {detected.length > 0 && (
          <div className="w-full bg-gray-50 rounded-lg p-4 shadow-inner mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Detected Ingredients
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {detected.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center space-x-2 text-sm shadow-sm"
                >
                  <span>
                    {item.name}{" "}
                    <span className="text-xs text-gray-600">
                      ({Math.round(item.confidence * 100)}%)
                    </span>
                  </span>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔘 Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={ingredients.length === 0 || loading}
            className={`px-6 py-2 rounded-md text-white font-semibold transition ${
              ingredients.length === 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {loading ? "Generating..." : "Generate Smart Recipe →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step1;
