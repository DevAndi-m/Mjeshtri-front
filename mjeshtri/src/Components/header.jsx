import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Mjeshtri
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/marketplace" className="hover:text-blue-600 transition">Marketplace</Link>
          <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;