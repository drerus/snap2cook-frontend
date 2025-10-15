import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-black text-white shadow-md">

      <Link to="/" className="text-2xl font-bold text-green-700 flex items-center gap-2">
        🥗 <span>Snap2Cook</span>
      </Link>

      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <Link to="/my-recipes" className="text-gray-700 hover:text-green-600 font-medium">
              My Recipes
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
