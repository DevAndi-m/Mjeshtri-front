import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Mjeshtri
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          <Link to="/" className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600" : ""}`}>Home</Link>
          <Link to="/marketplace" className={`hover:text-blue-600 ${location.pathname === "/marketplace" ? "text-blue-600" : ""}`}>Marketplace</Link>
          <Link to="/about" className={`hover:text-blue-600 ${location.pathname === "/about" ? "text-blue-600" : ""}`}>About</Link>
          <Link to="/contact" className={`hover:text-blue-600 ${location.pathname === "/contact" ? "text-blue-600   " : ""}`}>Contact</Link>
        </div>

        {/* Auth Area */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">
                {user.fullName}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`px-4 py-2 text-gray-700 hover:text-blue-600 ${location.pathname === "/login" ? "dark:text-gray-900" : ""}`}>
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Header;
