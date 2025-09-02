import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "admin" | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType") as "user" | "admin" | null;
    setIsLoggedIn(!!token);
    setUserType(type);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserType(null);
    navigate("/");
  };

  const handleLoginChoice = (type: "admin" | "user") => {
    navigate(`/${type}/login`);
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-teal-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          AI Knowledge Hub
        </h1>

        <div className="flex items-center gap-4">
          {/* Always show search input for logged-in users */}
          {isLoggedIn && userType === "admin" && (
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="px-2 py-1 rounded-l text-black"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1 bg-white text-teal-600 rounded-r hover:bg-gray-100"
              >
                Search
              </button>
            </div>
          )}


          {/* Logged-in users */}
          {isLoggedIn ? (
            <>
              {userType && (
                <>
                  <a
                    href={`/${userType}/dashboard`}
                    className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                  <a
                    href={`/${userType}/profile`}
                    className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100"
                  >
                    Profile
                  </a>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100"
              >
                Login
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-10">
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-200 text-left"
                    onClick={() => handleLoginChoice("admin")}
                  >
                    Admin Login
                  </button>
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-200 text-left"
                    onClick={() => handleLoginChoice("user")}
                  >
                    User Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
