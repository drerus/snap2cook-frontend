import React, { useState } from "react";

function Log() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("✅ Login successful!");
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        setMessage(`❌ ${data.detail || "Login failed"}`);
      }
    } catch (error) {
      setMessage("❌ Error logging in");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center 
                 bg-black text-white transition-all duration-500"
    >
      {/* 🌿 Snap2Cook Branding */}
      <div className="text-center mb-10 animate-fadeIn w-full">
        <h1 className="text-5xl font-extrabold text-green-400 flex items-center justify-center gap-2 drop-shadow-lg">
          🥗 Snap2Cook
        </h1>
        <p className="text-gray-400 mt-3 text-base md:text-lg font-light text-center">
          Turn your ingredients into delicious recipes 
        </p>
      </div>

      {/* 🔐 Login Card */}
      <div className="bg-white text-gray-800 shadow-2xl rounded-2xl p-8 w-96 border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default Log;
