import React, { useState } from "react";
import CONFIG from "../config"; // ✅ Import config

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use backend from config instead of localhost
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Signup successful! You can now log in.");
        setTimeout(() => (window.location.href = "/login"), 1000);
      } else {
        setMessage(`❌ ${data.detail || "Signup failed"}`);
      }
    } catch (error) {
      console.error("🔥 Signup error:", error);
      setMessage("❌ Error signing up");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white transition-all duration-500">
      <div className="text-center mb-10 animate-fadeIn w-full">
        <h1 className="text-5xl font-extrabold text-green-400 flex items-center justify-center gap-2 drop-shadow-lg">
          🥗 Snap2Cook
        </h1>
        <p className="text-gray-400 mt-3 text-base md:text-lg font-light text-center">
          Turn your ingredients into delicious recipes
        </p>
      </div>

      <div className="bg-white text-gray-800 shadow-2xl rounded-2xl p-8 w-96 border border-gray-200">
        <h2 className="text-2xl font-semibold text-green-600 mb-4 text-center">
          Create an Account ✨
        </h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default Signup;
