import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Navbar from "./components/Navbar";
import Log from "./components/Log";
import Signup from "./components/Signup";
import MyRecipes from "./components/MyRecipes";
import CONFIG from "./config"; // ✅ Import your config

// 🔍 Debug: Check active API URL
console.log("🔍 Active API URL:", CONFIG.API_BASE_URL);

// 🔒 Protect routes that require login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [step, setStep] = useState(Number(localStorage.getItem("step")) || 1);
  const [ingredients, setIngredients] = useState([]);

  const goToStep1 = () => {
    setStep(1);
    localStorage.setItem("step", 1);
  };

  const goToStep2 = () => {
    setStep(2);
    localStorage.setItem("step", 2);
  };

  return (
    <Router>
      {/* ✅ Global Navbar */}
      <Navbar />

      <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
        <Routes>
          {/* 🔒 Protected main flow */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <header className="mb-6">
                    <h1 className="text-3xl font-bold text-green-700">🥗 Snap2Cook</h1>
                    <p className="text-gray-400 mt-2">
                      Turn your ingredients into delicious recipes 🍳
                    </p>
                  </header>

                  {step === 1 && (
                    <Step1
                      ingredients={ingredients}
                      setIngredients={setIngredients}
                      onNext={goToStep2}
                    />
                  )}

                  {step === 2 && (
                    <Step2
                      ingredients={ingredients}
                      onBack={goToStep1}
                    />
                  )}
                </div>
              </ProtectedRoute>
            }
          />

          {/* 🔑 Auth Pages */}
          <Route path="/login" element={<Log />} />
          <Route path="/signup" element={<Signup />} />

          {/* 👤 User’s personal recipes */}
          <Route
            path="/my-recipes"
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
